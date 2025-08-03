from functools import lru_cache
from prefect import get_client
from sqlmodel import select
from oto.infra.database import create_db_session
from oto.domain.job import ConversationJob, PrefectJobStatus


@lru_cache
def get_prefect_job_manager() -> "PrefectJobManager":
    return PrefectJobManager()


class PrefectJobManager:
    def __init__(self):
        self.client = get_client()

    def put_job(
        self, job_type: str, flow_run_id: str, conversation_id: str, user_id: str
    ):
        with create_db_session() as session:
            session.add(
                ConversationJob(
                    job_type=job_type,
                    flow_run_id=str(flow_run_id),
                    conversation_id=conversation_id,
                    user_id=user_id,
                )
            )
            session.commit()

    def get_job(self, job_type: str, conversation_id: str) -> ConversationJob | None:
        with create_db_session() as session:
            return session.exec(
                select(ConversationJob).where(
                    ConversationJob.job_type == job_type,
                    ConversationJob.conversation_id == conversation_id,
                )
            ).first()

    async def get_job_status(self, job: ConversationJob) -> PrefectJobStatus:
        result = await self.client.read_flow_run(job.flow_run_id)
        return PrefectJobStatus(
            status=result.state.name,
            started_at=result.start_time,
            estimated_run_time_in_seconds=result.estimated_run_time.total_seconds()
            if result.estimated_run_time
            else -1,
        )

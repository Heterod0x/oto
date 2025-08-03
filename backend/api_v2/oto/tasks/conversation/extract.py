from prefect import flow, task, get_run_logger
from sqlmodel import select
from prefect.task_runners import ConcurrentTaskRunner
from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation
from oto.domain.transcript import Transcript
from oto.domain.transcript import Captions
from oto.domain.analysis import Topic
from oto.services.extract_topic import get_extract_topic_service
from oto.domain.conversation import ProcessingStatus


@task(task_run_name="extract_topic")
def extract_topic(conversation_id: str) -> None:
    with create_db_session() as session:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            raise ValueError(f"Conversation {conversation_id} not found")
        transcript = session.get(Transcript, conversation.id)
        if not transcript:
            raise ValueError(f"Transcript {conversation.id} not found")
        topic = session.exec(select(Topic).where(Topic.id == conversation_id)).first()
        if topic:
            return
        captions = Captions.model_validate_json(transcript.captions_dump)
        extract_topic_service = get_extract_topic_service()
        topics = extract_topic_service.extract_topics(captions)
        topic = Topic.from_topic_datas(topics)
        topic.id = conversation_id
        topic.user_id = conversation.user_id
        session.add(topic)
        session.commit()


@flow(name="extract_topic", task_runner=ConcurrentTaskRunner())
def extract_topic_flow(conversation_id: str) -> None:
    extract_topic(conversation_id)


@flow(name="extract_topics_from_all_conversations", task_runner=ConcurrentTaskRunner())
def extract_topics_from_all_conversations_flow() -> None:
    log = get_run_logger()
    with create_db_session() as session:
        conversations = session.exec(
            select(Conversation).where(
                Conversation.status == ProcessingStatus.COMPLETED
            )
        ).all()
        for conversation in conversations:
            log.info("Extracting topics from conversation %s", conversation.id)
            try:
                extract_topic.submit(conversation.id).result()
            except Exception:
                pass
        log.info("Extracted topics from all conversations")

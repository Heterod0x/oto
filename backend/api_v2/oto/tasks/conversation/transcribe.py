from prefect import task
from sqlmodel import select, func
from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation, ProcessingStatus
from oto.domain.transcript import Transcript
from oto.services.transcription_whisper import get_transcription_service
from oto.domain.point import Point, PointTransaction


@task(task_run_name="transcribe_conversation")
def transcribe_conversation(conversation_id: str) -> None:
    with create_db_session() as session:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            raise ValueError(f"Conversation {conversation_id} not found")

        conversation.status = ProcessingStatus.PROCESSING
        conversation.inner_status = "Transcribing conversation"
        session.add(conversation)
        session.commit()

        transcription_service = get_transcription_service()
        result, total_active_seconds = transcription_service.transcribe(
            conversation.file_path, conversation.mime_type
        )

        acquired_points = round(total_active_seconds / 60 / 60 * 200, 1)

        transcript = Transcript(
            id=conversation_id,
            user_id=conversation.user_id,
            captions_dump=result.model_dump_json(),
        )
        session.add(transcript)

        conversation.status = ProcessingStatus.PROCESSING
        conversation.inner_status = "Transcription completed"
        conversation.points = acquired_points
        session.add(conversation)
        session.commit()

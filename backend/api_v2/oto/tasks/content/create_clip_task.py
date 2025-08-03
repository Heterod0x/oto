from prefect import task, get_run_logger
from oto.infra.database import create_db_session
from oto.services.content.clip import get_clip_generator_service
from oto.services.content.clip_construct import get_clip_construct_service
from oto.services.content.audio_enhancer import get_audio_enhancer_service
from oto.services.content.text_to_speech import get_text_to_speech_service
from oto.infra.storage import get_storage
from oto.domain.clip import Clip, ClipData
from oto.domain.conversation import Conversation
from sqlmodel import select
from io import BytesIO


def get_conversation(conversation_id: str) -> Conversation:
    with create_db_session() as session:
        return session.exec(
            select(Conversation).where(Conversation.id == conversation_id)
        ).first()


@task(task_run_name="create_clip")
def create_clip_task(conversation_id: str) -> None:
    log = get_run_logger()
    log.info("▶️ Creating clips for conversation %s", conversation_id)
    conversation = get_conversation(conversation_id)

    path = conversation.file_path
    import_mime_type = conversation.mime_type

    clip_generator_service = get_clip_generator_service()
    log.info("▶️ Generating clips for conversation %s", conversation_id)
    result = clip_generator_service.generate(
        path,
        import_mime_type,
    )
    log.info("▶️ Generated clips for conversation %s", conversation_id)

    storage = get_storage()
    audio_file = storage.open_for_read(path)

    clip_construct_service = get_clip_construct_service()
    result = clip_construct_service.construct(audio_file, result)

    ret: list[ClipData] = []

    log.info("▶️ Cleaning clips for conversation %s", conversation_id)
    for target_data in result.root:
        cleaned_captions = clip_generator_service.pretty(target_data.audio, "audio/wav")
        if cleaned_captions.root.count == 0:
            continue
        audio_data, cleaned_captions = clip_construct_service.construct_with_captions(
            BytesIO(target_data.audio), cleaned_captions
        )
        target_data.captions = cleaned_captions
        target_data.audio = audio_data
        ret.append(target_data)
    log.info("▶️ Cleaned clips for conversation %s", conversation_id)

    with create_db_session() as session:
        i = 0
        log.info("▶️ Uploading clips for conversation %s", conversation_id)
        for target_data in ret:
            path = storage.upload_bytes(
                target_data.audio,
                f"clips/{conversation.user_id}",
                "wav",
                "audio/wav",
            )
            # enhance audio
            signed_url = storage.generate_signed_url(path)
            audio_enhancer_service = get_audio_enhancer_service()
            try:
                bytes = audio_enhancer_service.enhance_audio(signed_url, "opus")
                enhanced_path = storage.upload_bytes(
                    bytes,
                    f"clips/{conversation.user_id}",
                    "opus",
                    "audio/opus",
                )
            except Exception as e:
                log.error("▶️ Enhancing audio failed: %s", e)
                log.info("▶️ Enhancing audio failed, converting to opus instead")
                bytes = audio_enhancer_service.convert_to_opus(target_data.audio)
                enhanced_path = storage.upload_bytes(
                    bytes,
                    f"clips/{conversation.user_id}",
                    "opus",
                    "audio/opus",
                )
            text_to_speech_service = get_text_to_speech_service()
            tts_bytes = text_to_speech_service.generate(target_data.comment, "opus")
            tts_path = storage.upload_bytes(
                tts_bytes,
                f"clip_comments/{conversation.user_id}",
                "opus",
                "audio/opus",
            )
            session.add(
                Clip(
                    user_id=conversation.user_id,
                    conversation_id=conversation.id,
                    file_name=f"clip_{i}.opus",
                    file_path=enhanced_path,
                    mime_type="audio/opus",
                    comment_file_name=f"comment_{i}.opus",
                    comment_file_path=tts_path,
                    comment_mime_type="audio/opus",
                    title=target_data.title,
                    description=target_data.description,
                    comment=target_data.comment,
                    captions_dump=target_data.captions.model_dump_json(),
                )
            )
        log.info("▶️ Uploaded clips for conversation %s", conversation_id)
        session.commit()
    log.info("✅ Created clips for conversation %s", conversation_id)

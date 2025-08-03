# from prefect import flow
# from prefect.task_runners import ConcurrentTaskRunner
# from oto.infra.database import create_db_session
from oto.services.content.clip import get_clip_generator_service
from oto.services.content.clip_construct import get_clip_construct_service
from oto.services.content.audio_enhancer import get_audio_enhancer_service
from oto.infra.storage import get_storage
from oto.environment import get_settings

# from oto.domain.clip import Clip
# from sqlmodel import delete
import pickle
import os
from io import BytesIO


def create_clip_flow() -> None:
    path = "uploads/leno_72696b75/20250625_191518_222a43c8.mp3"
    import_mime_type = "audio/mp3"

    clip_generator_service = get_clip_generator_service()
    if os.path.exists("result.pkl"):
        result = pickle.load(open("result.pkl", "rb"))
    else:
        result = clip_generator_service.generate(
            path,
            import_mime_type,
        )
        pickle.dump(result, open("result.pkl", "wb"))

    storage = get_storage()
    audio_file = storage.open_for_read(path)

    clip_construct_service = get_clip_construct_service()
    result = clip_construct_service.construct(audio_file, result)

    i = 0
    for target_data in result.root:
        print("Cleaning...")
        cleaned_captions = clip_generator_service.pretty(target_data.audio, "audio/wav")
        print("Cleaned captions", cleaned_captions)
        audio_data, cleaned_captions = clip_construct_service.construct_with_captions(
            BytesIO(target_data.audio), cleaned_captions
        )
        with open(f"output_{i}.wav", "wb") as f:
            f.write(audio_data)
        target_data.captions = cleaned_captions
        target_data.audio = audio_data
        path = storage.upload_bytes(audio_data, "clips", "wav", "audio/wav")
        signed_url = storage.generate_signed_url(path)
        print("enhancing...")
        audio_enhancer_service = get_audio_enhancer_service()
        bytes = audio_enhancer_service.enhance_audio(signed_url, "opus")
        with open(f"output_{i}_enhanced.opus", "wb") as f:
            f.write(bytes)
        i += 1
        break

    # with create_db_session() as session:
    #     session.exec(delete(Clip))
    #     session.add_all(result)
    #     session.commit()

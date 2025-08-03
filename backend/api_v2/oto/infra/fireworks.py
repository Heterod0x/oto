import requests
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from functools import lru_cache
from oto.environment import get_settings
from oto.infra.storage import get_storage
from io import TextIOWrapper
from oto.domain.fireworks import FireworksTranscriptionResponse


@lru_cache
def get_fireworks() -> "Fireworks":
    settings = get_settings()
    return Fireworks(settings.fireworks_api_key)


class Fireworks:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def transcribe(self, f: TextIOWrapper) -> FireworksTranscriptionResponse:
        response = requests.post(
            "https://audio-prod.us-virginia-1.direct.fireworks.ai/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {self.api_key}"},
            files={"file": f},
            data={
                "vad_model": "whisperx-pyannet",
                "alignment_model": "mms_fa",
                "preprocessing": "bass_dynamic",
                "temperature": "0.2",
                "timestamp_granularities": "word,segment",
                "audio_window_seconds": "5",
                "speculation_window_words": "4",
                "diarize": "true",
                "response_format": "verbose_json",
            },
        )

        if response.status_code == 200:
            return FireworksTranscriptionResponse.model_validate_json(response.text)
        else:
            raise Exception(f"Error: {response.status_code}", response.text)

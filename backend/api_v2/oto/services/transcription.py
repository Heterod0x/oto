from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from functools import lru_cache
from oto.environment import get_settings


@lru_cache
def get_transcription_service() -> "TranscriptionService":
    settings = get_settings()
    return TranscriptionService(get_vertexai(), settings.google_cloud_bucket_name)


class TranscriptionService:
    def __init__(self, vertexai: VertexAI, bucket_name: str):
        self.vertexai = vertexai
        self.bucket_name = bucket_name

    def transcribe(self, audio_file_path: str, mime_type: str) -> Captions:
        messages = [
            self._prompt(),
            Part.from_uri(
                uri=f"gs://{self.bucket_name}/{audio_file_path}", mime_type=mime_type
            ),
        ]
        response = self.vertexai.model.generate_content(
            messages,
            generation_config=GenerationConfig(
                max_output_tokens=65535,
                response_mime_type="application/json",
                response_schema={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "timecode": {"type": "string"},
                            "speaker": {"type": "string"},
                            "caption": {"type": "string"},
                        },
                        "required": ["timecode", "speaker", "caption"],
                    },
                },
            ),
        )

        captions = Captions.model_validate_json(response.text)
        return captions

    def _prompt(self) -> str:
        return """Can you transcribe this conversation recording, in the format of timecode, speaker, caption.
Use Speaker A, Speaker B, Speaker C, etc. to identify speakers. The timecode should be in the format of HH:MM:SS.

You have to transcribe the whole conversation, not just a part of it.
"""

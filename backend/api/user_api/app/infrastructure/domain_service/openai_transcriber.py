from app.domain.domain_service.i_transcriber import ITranscriber
from app.infrastructure.handler.openai_handler import OpenAIHandler


class OpenAITranscriber(ITranscriber):
    def __init__(self, openai_handler: OpenAIHandler):
        self.openai_handler = openai_handler

    def transcribe(self, audio: bytes) -> str:
        return self.openai_handler.transcribe(audio)

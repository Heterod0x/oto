from io import BytesIO

from openai import OpenAI


class OpenAIHandler:
    def __init__(self, openai_client: OpenAI):
        self.openai_client = openai_client

    def transcribe(self, audio: bytes) -> str:
        audio_file = BytesIO(audio)
        audio_file.name = "audio.wav"

        response = self.openai_client.audio.transcriptions.create(model="whisper-1", file=audio_file)
        return response.text

from io import BufferedReader

from openai import OpenAI


class OpenAIHandler:
    def __init__(self, openai_client: OpenAI):
        self.openai_client = openai_client

    def transcribe(self, audio: BufferedReader) -> str:
        response = self.openai_client.audio.transcriptions.create(model="whisper-1", file=audio)
        return response.text

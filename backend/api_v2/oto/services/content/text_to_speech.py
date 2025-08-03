from pydub import AudioSegment
from functools import lru_cache
from oto.environment import get_settings
from io import BytesIO
from openai import OpenAI


@lru_cache
def get_text_to_speech_service() -> "TextToSpeechService":
    settings = get_settings()
    return TextToSpeechService(settings.openai_api_key)


class TextToSpeechService:
    def __init__(self, openai_api_key: str):
        self.openai_api_key = openai_api_key

    def generate(self, text: str, format: str = "opus") -> bytes:
        client = OpenAI(api_key=self.openai_api_key)
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            input=text,
            voice="nova",
            instructions="Speak in a calm and soothing tone",
        )
        seg: AudioSegment = AudioSegment.from_file(BytesIO(response.content))
        bytes_io = BytesIO()
        seg.export(bytes_io, format=format)
        audio = bytes_io.getvalue()
        bytes_io.close()
        return audio

import requests
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions, Caption
from functools import lru_cache
from oto.environment import get_settings
from oto.infra.storage import get_storage
from oto.infra.fireworks import Fireworks, get_fireworks


@lru_cache
def get_transcription_service() -> "TranscriptionService":
    return TranscriptionService(get_fireworks())


class TranscriptionService:
    def __init__(self, fireworks: Fireworks):
        self.fireworks = fireworks
        self.storage = get_storage()

    def transcribe(
        self, audio_file_path: str, mime_type: str
    ) -> tuple[Captions, float]:
        with self.storage.open_for_read(audio_file_path) as f:
            response = self.fireworks.transcribe(f)

            captions = []

            total_active_seconds = 0

            for segment in response.segments:
                if segment.no_speech:
                    continue
                total_active_seconds += segment.end - segment.start

            for word in response.words:
                captions.append(
                    Caption(
                        timecode=self._seconds_to_timecode(word.start)
                        + "-"
                        + self._seconds_to_timecode(word.end),
                        speaker=word.speaker_id,
                        caption=word.word,
                    )
                )

            return Captions(captions), total_active_seconds

    def _seconds_to_timecode(self, seconds: float) -> str:
        """
        make seconds to HH:MM:SS
        """
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

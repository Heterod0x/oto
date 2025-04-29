from abc import ABC, abstractmethod


class ISoundQualityEvaluator(ABC):
    @abstractmethod
    def handle(self, audio_frame: bytes) -> float:
        pass

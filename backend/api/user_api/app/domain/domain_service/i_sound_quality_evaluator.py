from abc import ABC, abstractmethod


class ISoundQualityEvaluator(ABC):
    @abstractmethod
    def evaluate(self, audio_frame: bytes) -> float:
        pass

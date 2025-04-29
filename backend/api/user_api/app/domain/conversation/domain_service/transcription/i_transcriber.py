from abc import ABC, abstractmethod


class ITranscriber(ABC):
    @abstractmethod
    def transcribe(self, audio: bytes) -> str:
        pass

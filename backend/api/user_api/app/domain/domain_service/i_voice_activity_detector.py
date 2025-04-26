from abc import ABC, abstractmethod


class IVoiceActivityDetector(ABC):
    @abstractmethod
    def detect(self, audio_frame: bytes) -> float:
        """this returns voice activity ratio [0, 1]"""
        pass

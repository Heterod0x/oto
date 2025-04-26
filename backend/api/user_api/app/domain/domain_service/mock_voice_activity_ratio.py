from app.domain.domain_service.i_voice_activity_detector import IVoiceActivityDetector


class MockVoiceActivityDetector(IVoiceActivityDetector):
    def detect(self, audio_frame: bytes) -> float:
        return 0.5

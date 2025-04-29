from app.domain.conversation.domain_service.voice_activity.i_voice_activity_detector import IVoiceActivityDetector


class MockVoiceActivityDetector(IVoiceActivityDetector):
    def handle(self, audio_frame: bytes) -> float:
        return 0.5

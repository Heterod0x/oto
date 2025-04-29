from app.domain.conversation.domain_service.sound_quality.i_sound_quality_evaluator import ISoundQualityEvaluator


class MockSoundQualityEvaluator(ISoundQualityEvaluator):
    def handle(self, audio_frame: bytes) -> float:
        return 0.5

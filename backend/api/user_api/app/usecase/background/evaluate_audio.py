from loguru import logger

from app.domain.conversation.domain_service.sound_quality.i_sound_quality_evaluator import ISoundQualityEvaluator
from app.domain.conversation.domain_service.voice_activity.i_voice_activity_detector import IVoiceActivityDetector
from app.domain.conversation.repository.i_conversation_audio_repository import IConversationAudioRepository
from app.usecase.usecase import UseCase


class EvaluateAudio(UseCase):
    def __init__(
        self,
        conversation_audio_repository: IConversationAudioRepository,
        voice_activity_detector: IVoiceActivityDetector,
        sound_quality_evaluator: ISoundQualityEvaluator,
    ):
        self._conversation_audio_repository = conversation_audio_repository
        self._voice_activity_detector = voice_activity_detector
        self._sound_quality_evaluator = sound_quality_evaluator

    def handle(self, conversation_id: str) -> None:
        conversation_audio = self._conversation_audio_repository.get(conversation_id)

        # voice activity ratio
        voice_activity_ratio = self._voice_activity_detector.handle(conversation_audio.audio_data)
        logger.info(f"Voice activity ratio: {voice_activity_ratio}")

        # sound quality score
        sound_quality_score = self._sound_quality_evaluator.handle(conversation_audio.audio_data)
        logger.info(f"Sound quality score: {sound_quality_score}")

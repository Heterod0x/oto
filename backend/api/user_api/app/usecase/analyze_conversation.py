from loguru import logger

from app.usecase.usecase import UseCase
from app.agent.conversation_agent import ConversationOverviewExtractor
from app.domain.repository.i_conversation_audio_repository import IConversationAudioRepository
from app.domain.domain_service.i_transcriber import ITranscriber


class AnalyzeConversation(UseCase):
    def __init__(
        self,
        conversation_audio_repository: IConversationAudioRepository,
        transcriber: ITranscriber,
    ):
        self._conversation_overview_extractor = ConversationOverviewExtractor()
        self._conversation_audio_repository = conversation_audio_repository
        self._transcriber = transcriber

    def handle(self, conversation_id: str) -> None:
        conversation_audio = self._conversation_audio_repository.get(conversation_id)
        transcript = self._transcriber.transcribe(conversation_audio.audio_data)
        logger.info(f"Transcript: {transcript[:100]}")

        overview = self._conversation_overview_extractor.handle(transcript)

        logger.info(f"Overview: {overview}")
        # self._conversation_repository.save_conversation_overview(conversation_id, overview)

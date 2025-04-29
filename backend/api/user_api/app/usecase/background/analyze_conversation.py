from loguru import logger

from app.usecase.usecase import UseCase
from app.domain.conversation.repository.i_conversation_repository import IConversationRepository
from app.domain.conversation.repository.i_conversation_audio_repository import IConversationAudioRepository
from app.domain.conversation.domain_service.transcription.i_transcriber import ITranscriber
from app.domain.conversation.domain_service.conversation_factory import ConversationFactory


class AnalyzeConversation(UseCase):
    def __init__(
        self,
        conversation_audio_repository: IConversationAudioRepository,
        transcriber: ITranscriber,
        conversation_repository: IConversationRepository,
        conversation_factory: ConversationFactory,
    ):
        self._conversation_audio_repository = conversation_audio_repository
        self._transcriber = transcriber
        self._conversation_factory = conversation_factory
        self._conversation_repository = conversation_repository

    # TODO: returnの型に違和感あり
    def handle(self, conversation_id: str) -> str:
        conversation_audio = self._conversation_audio_repository.get(conversation_id)

        # transcribe audio
        transcript = self._transcriber.transcribe(conversation_audio.audio_data)
        logger.info(f"Transcript: {transcript[:100]}")

        # store conversation
        conversation = self._conversation_factory.create(transcript)
        logger.info(f"Overview: {conversation.overview}")
        self._conversation_repository.store(conversation_id, conversation)

        return transcript

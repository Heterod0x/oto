from loguru import logger

from app.domain.conversation.object.conversation_audio import ConversationAudio
from app.domain.conversation.repository.i_conversation_audio_repository import IConversationAudioRepository
from app.tasks import analyze_conversation, evaluate_audio
from app.usecase.usecase import UseCase


class StoreConversationAudio(UseCase):
    def __init__(self, conversation_audio_repository: IConversationAudioRepository):
        self._conversation_audio_repository = conversation_audio_repository

    def handle(self, user_id: str, audio_data: bytes) -> None:
        audio = ConversationAudio(user_id=user_id, audio_data=audio_data)

        self._conversation_audio_repository.store(audio)

        analyze_conversation.delay(user_id=user_id, conversation_id=audio.conversation_id)
        logger.info("Conversation audio stored and analysis task queued")

        evaluate_audio.delay(conversation_id=audio.conversation_id)
        logger.info("Audio stored and evaluation task queued")

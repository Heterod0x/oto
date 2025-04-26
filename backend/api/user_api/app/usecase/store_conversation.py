from loguru import logger

from app.usecase.usecase import UseCase
from app.domain.repository.i_conversation_repository import IConversationRepository
from app.domain.domain_service.i_transcriber import ITranscriber
from app.domain.domain_service.i_embedder import IEmbedder
from app.domain.object.conversation import Conversation, ConversationMetadata
from app.domain.object.user_id import UserId


class StoreConversation(UseCase):
    def __init__(
        self, conversation_repository: IConversationRepository, transcriber: ITranscriber, embedder: IEmbedder
    ):
        self._conversation_repository = conversation_repository
        self._transcriber = transcriber
        self._embedder = embedder

    def handle(self) -> str:
        path = "/Users/lud/product-dev/lud/novas_backend/api/user_api/data/audio-8min.m4a"
        audio_stream = open(path, "rb")
        logger.info("Transcribing audio...")
        text = self._transcriber.transcribe(audio=audio_stream)
        # embedding = self._embedder.embed(text)

        user_id = "dev"
        audio_stream.seek(0)  # ポインタを先頭に戻す
        conversation_metadata = ConversationMetadata()
        conversation = Conversation(
            metadata=conversation_metadata,
            raw_voice_data=audio_stream.read(),
            text_data=text,
        )
        self._conversation_repository.store(user_id, conversation)

        logger.info(f"Transcribed text: {text}")
        # logger.info(f"Embedding: {embedding.values[:10]}")
        return text

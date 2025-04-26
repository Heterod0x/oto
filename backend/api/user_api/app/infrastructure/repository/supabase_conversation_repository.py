from loguru import logger
from supabase import Client

from app.domain.object.conversation import Conversation
from app.domain.object.user_id import UserId
from app.domain.repository.i_conversation_repository import IConversationRepository


class SupabaseConversationRepository(IConversationRepository):
    def __init__(self, supabase: Client):
        self._client = supabase

    def store(self, user_id: UserId, conversation: Conversation) -> None:
        logger.info(f"Storing conversation: {conversation.conversation_id}")

        # save raw voice data in storage
        self._client.storage.from_("raw-conversation").upload(
            path=f"{conversation.conversation_id}.m4a",
            file=conversation.raw_voice_data,
        )

        pass

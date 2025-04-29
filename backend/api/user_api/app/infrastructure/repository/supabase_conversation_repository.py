from loguru import logger
from supabase import Client

from app.domain.conversation.object.conversation import Conversation
from app.domain.conversation.repository.i_conversation_repository import IConversationRepository
from app.domain.general.object.user_id import UserId


class SupabaseConversationRepository(IConversationRepository):
    def __init__(self, supabase: Client):
        self._client = supabase

    def store(self, user_id: UserId, conversation: Conversation) -> None:
        logger.info(f"Storing conversation: {conversation.conversation_id}")

        # TODO: 実装
        # save raw voice data in storage
        # self._client.table("conversation").insert(
        #     {
        #         "conversation_id": conversation.conversation_id,
        #         "user_id": user_id,
        #         "conversation": conversation,
        #     }
        # )
        pass

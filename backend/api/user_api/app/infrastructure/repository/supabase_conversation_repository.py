from loguru import logger
from supabase import Client

from app.domain.conversation.object.conversation import Conversation, ConversationQuery
from app.domain.conversation.repository.i_conversation_repository import IConversationRepository
from app.domain.general.object.user_id import UserId


class SupabaseConversationRepository(IConversationRepository):
    def __init__(self, supabase: Client):
        self._supabase_client = supabase
        self._table_name = "conversation"

    def get_all(self, user_id: UserId) -> list[ConversationQuery]:
        response = self._supabase_client.table(self._table_name).select("*").eq("user_id", user_id).execute()
        conversations = []
        for row in response.data:
            conversations.append(
                ConversationQuery(
                    conversation_id=row["id"],
                    title=row["title"],
                    overview=row["overview"],
                    full_transcript=row["full_transcript"],
                    created_at=row["created_at"],
                )
            )
        return conversations

    def store(self, user_id: UserId, conversation: Conversation) -> None:
        logger.info(f"Storing conversation: {conversation.conversation_id}")

        self._supabase_client.table(self._table_name).insert(
            {
                "id": conversation.conversation_id,
                "user_id": user_id,
                "title": conversation.title,
                "overview": conversation.overview,
                "full_transcript": conversation.full_transcript,
                "created_at": str(conversation.metadata.record_start_at),
            }
        ).execute()

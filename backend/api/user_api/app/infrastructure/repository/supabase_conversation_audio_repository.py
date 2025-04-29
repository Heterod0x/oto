from loguru import logger
from supabase import Client

from app.domain.conversation.object.conversation_audio import ConversationAudio
from app.domain.conversation.repository.i_conversation_audio_repository import IConversationAudioRepository


class SupabaseConversationAudioRepository(IConversationAudioRepository):
    def __init__(self, supabase_client: Client):
        self._client = supabase_client

    def get(self, conversation_id: str) -> ConversationAudio:
        response_in_bytes = self._client.storage.from_("raw-conversation-audio").download(path=f"{conversation_id}.wav")

        # TODO: user_id
        return ConversationAudio(user_id="dev", conversation_id=conversation_id, audio_data=response_in_bytes)

    def store(self, audio: ConversationAudio) -> None:
        logger.info(f"Storing conversation audio: {audio.conversation_id}")

        # save raw voice data in storage
        self._client.storage.from_("raw-conversation-audio").upload(
            path=f"{audio.conversation_id}.wav",
            file=audio.audio_data,
        )

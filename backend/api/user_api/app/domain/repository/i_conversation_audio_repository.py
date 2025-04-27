from abc import ABC, abstractmethod
from app.domain.object.conversation_audio import ConversationAudio


class IConversationAudioRepository(ABC):
    @abstractmethod
    def get(self, conversation_id: str) -> ConversationAudio:
        pass

    @abstractmethod
    def store(self, audio: ConversationAudio) -> None:
        pass

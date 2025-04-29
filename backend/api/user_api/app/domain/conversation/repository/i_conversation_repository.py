from abc import ABC, abstractmethod

from app.domain.conversation.object.conversation import Conversation
from app.domain.general.object.user_id import UserId


class IConversationRepository(ABC):
    @abstractmethod
    def store(self, user_id: UserId, conversation: Conversation) -> None:
        pass

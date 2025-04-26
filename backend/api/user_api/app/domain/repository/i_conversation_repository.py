from abc import ABC, abstractmethod

from app.domain.object.conversation import Conversation
from app.domain.object.user_id import UserId


class IConversationRepository(ABC):
    @abstractmethod
    def store(self, user_id: UserId, conversation: Conversation) -> None:
        pass

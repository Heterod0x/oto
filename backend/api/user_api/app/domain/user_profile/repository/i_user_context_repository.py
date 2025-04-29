from abc import ABC, abstractmethod

from app.domain.user_profile.object.user_context import UserContext


class IUserContextRepository(ABC):
    @abstractmethod
    def get_all(self, user_id: str) -> list[UserContext]:
        # TODO: Top K
        pass

    @abstractmethod
    def store(self, user_id: str, user_context: UserContext) -> None:
        pass

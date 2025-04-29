from abc import ABC, abstractmethod

from app.domain.user_profile.object.user_profile import UserProfile


class IUserProfileRepository(ABC):
    @abstractmethod
    def store(self, user_id: str, user_profile: UserProfile) -> None:
        pass

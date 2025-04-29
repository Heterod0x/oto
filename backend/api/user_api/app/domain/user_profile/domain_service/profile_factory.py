from app.agent.profile_generator import ProfileGenerator as ProfileGeneratorAgent
from app.domain.user_profile.object.user_profile import UserProfile
from app.domain.user_profile.repository.i_user_context_repository import IUserContextRepository


class ProfileFactory:
    def __init__(self, user_context_repository: IUserContextRepository):
        self._user_context_repository = user_context_repository
        self._profile_generator = ProfileGeneratorAgent()

    def handle(self, user_id: str) -> UserProfile:
        contexts = self._user_context_repository.get_all(user_id)
        profile = self._profile_generator.handle(contexts)
        return profile

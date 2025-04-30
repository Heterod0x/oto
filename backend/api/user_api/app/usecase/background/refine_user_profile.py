from app.domain.user_profile.domain_service.context_extractor import ContextExtractor
from app.domain.user_profile.domain_service.profile_factory import ProfileFactory
from app.domain.user_profile.repository.i_user_context_repository import IUserContextRepository
from app.domain.user_profile.repository.i_user_profile_repository import IUserProfileRepository
from app.usecase.usecase import UseCase


class RefineUserProfile(UseCase):
    def __init__(
        self,
        context_extractor: ContextExtractor,
        user_context_repository: IUserContextRepository,
        profile_factory: ProfileFactory,
        user_profile_repository: IUserProfileRepository,
    ):
        self._context_extractor = context_extractor
        self._user_context_repository = user_context_repository
        self._profile_factory = profile_factory
        self._user_profile_repository = user_profile_repository

    def handle(self, user_id: str, transcript: str) -> None:
        # extract new context from transcript
        user_contexts = self._context_extractor.handle(transcript)
        for user_context in user_contexts:
            self._user_context_repository.store(user_id, user_context)

        # generate user profile using all contexts
        user_profile = self._profile_factory.handle(user_id)
        self._user_profile_repository.store(user_id, user_profile)

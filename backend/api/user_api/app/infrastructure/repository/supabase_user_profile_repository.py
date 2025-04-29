from supabase import Client
from loguru import logger
from app.domain.user_profile.object.user_profile import UserProfile
from app.domain.user_profile.repository.i_user_profile_repository import IUserProfileRepository


class SupabaseUserProfileRepository(IUserProfileRepository):
    def __init__(self, supabase_client: Client):
        self.supabase_client = supabase_client

    def store(self, user_id: str, user_profile: UserProfile) -> None:
        logger.info(f"Storing user profile: {user_profile}")
        self.supabase_client.table("user_profile").insert(
            {
                "user_id": user_id,
                "age": user_profile.age,
                "gender": user_profile.gender,
                "favorite_foods": ",".join(user_profile.favorite_foods),
                "personality": user_profile.personality,
                "self_introduction": user_profile.self_introduction,
            }
        ).execute()

from loguru import logger
from supabase import Client

from app.domain.user_profile.object.user_profile import UserProfile
from app.domain.user_profile.repository.i_user_profile_repository import IUserProfileRepository


class SupabaseUserProfileRepository(IUserProfileRepository):
    def __init__(self, supabase_client: Client):
        self.supabase_client = supabase_client

    def get(self, user_id: str) -> UserProfile:
        response = self.supabase_client.table("user_profile").select("*").eq("user_id", user_id).execute()
        data = response.data[0]
        profile = UserProfile(
            age=data["age"],
            gender=data["gender"],
            interests=data["interests"].split(",") if data["interests"] else None,
            favorite_foods=data["favorite_foods"].split(",") if data["favorite_foods"] else None,
            personality=data["personality"],
            self_introduction=data["self_introduction"],
        )
        return profile

    def store(self, user_id: str, user_profile: UserProfile) -> None:
        logger.info(f"Storing user profile: {user_profile}")
        # TODO: upsert
        self.supabase_client.table("user_profile").insert(
            {
                "user_id": user_id,
                "age": user_profile.age,
                "gender": user_profile.gender,
                "interests": ",".join(user_profile.interests) if user_profile.interests else None,
                "favorite_foods": ",".join(user_profile.favorite_foods) if user_profile.favorite_foods else None,
                "personality": user_profile.personality,
                "self_introduction": user_profile.self_introduction,
            }
        ).execute()

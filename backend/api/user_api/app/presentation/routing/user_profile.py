from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.infrastructure.handler.supabase_handler import supabase_client
from app.infrastructure.repository.supabase_user_profile_repository import SupabaseUserProfileRepository

user_profile_router = APIRouter(prefix="/profile", tags=["user_profile"])


@user_profile_router.get("/{user_id}")
async def get_user_profile(user_id: str) -> JSONResponse:
    supabase_user_profile_repository = SupabaseUserProfileRepository(supabase_client)
    user_profile = supabase_user_profile_repository.get(user_id)
    return JSONResponse(content={"profile": user_profile.model_dump()})

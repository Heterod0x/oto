from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from loguru import logger

from app.usecase.store_conversation_audio import StoreConversationAudio
from app.infrastructure.repository.supabase_conversation_audio_repository import SupabaseConversationAudioRepository
from app.infrastructure.handler.supabase_handler import supabase_client

conversation_router = APIRouter(prefix="/conversation", tags=["conversation"])


@conversation_router.get("/")
async def get_conversations(
    user_id: str,
) -> JSONResponse:
    return JSONResponse(content={"message": "success"})


@conversation_router.post("/")
async def store_conversation(audio: UploadFile = File(...)) -> JSONResponse:
    conversation_audio_repository = SupabaseConversationAudioRepository(supabase_client)
    store_conversation_usecase = StoreConversationAudio(conversation_audio_repository)
    store_conversation_usecase.handle(user_id="dev", audio_data=audio.file.read())
    return JSONResponse(content={"message": "success"})

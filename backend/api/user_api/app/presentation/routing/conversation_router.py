from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse
from loguru import logger

from app.infrastructure.handler.supabase_handler import supabase_client
from app.infrastructure.repository.supabase_conversation_audio_repository import SupabaseConversationAudioRepository
from app.infrastructure.repository.supabase_conversation_repository import SupabaseConversationRepository
from app.usecase.store_conversation_audio import StoreConversationAudio

conversation_router = APIRouter(prefix="/conversation", tags=["conversation"])


@conversation_router.get("/")
async def get_conversations(
    user_id: str,
) -> JSONResponse:
    conversation_repository = SupabaseConversationRepository(supabase_client)
    conversations = conversation_repository.get_all(user_id)
    return JSONResponse(content={"conversations": [conversation.model_dump() for conversation in conversations]})


@conversation_router.post("/")
async def store_conversation(user_id: str = Form(...), audio: UploadFile = File(...)) -> JSONResponse:
    conversation_audio_repository = SupabaseConversationAudioRepository(supabase_client)
    store_conversation_usecase = StoreConversationAudio(conversation_audio_repository)
    store_conversation_usecase.handle(user_id=user_id, audio_data=audio.file.read())
    return JSONResponse(content={"message": "success"})

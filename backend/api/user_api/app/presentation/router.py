from openai import OpenAI
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from loguru import logger
from supabase import create_client

from app.domain.user_profile.object.user_profile import UserProfile
from app.usecase.store_conversation_audio import StoreConversationAudio
from app.infrastructure.repository.supabase_conversation_audio_repository import SupabaseConversationAudioRepository

# from app.infrastructure.domain_service.openai_transcriber import OpenAITranscriber
from app.infrastructure.handler.openai_handler import OpenAIHandler
from app.infrastructure.domain_service.jina_embedder import JinaEmbedder
from app.config import supabase_config


class StoreConversationRequest(BaseModel):
    pass


profile_router = APIRouter(prefix="/profiles")
conversation_router = APIRouter(prefix="/conversations")

openai_client = OpenAI()
openai_handler = OpenAIHandler(openai_client)

supabase_client = create_client(
    supabase_config.supabase_url,
    supabase_config.supabase_key,
)

conversation_audio_repository = SupabaseConversationAudioRepository(supabase_client)
# transcriber = OpenAITranscriber(openai_handler)
embedder = JinaEmbedder()
store_conversation_usecase = StoreConversationAudio(conversation_audio_repository)


@profile_router.get("/{user_id}")
async def get_profiles(user_id: str) -> JSONResponse:
    dummy = UserProfile(
        name="テストユーザー",
        age=28,
        hobbies=["読書", "旅行", "料理"],
        gender="男性",
        favorite_foods=["ラーメン", "寿司", "カレー"],
        personality="明るく社交的",
        self_introduction="こんにちは！テストユーザーです。新しい出会いと経験を大切にしています。よろしくお願いします。",
    )
    return JSONResponse(content=dummy.model_dump())


@conversation_router.get("/")
async def get_conversations(
    user_id: str,
) -> JSONResponse:
    from uuid import uuid4
    from datetime import datetime
    from app.domain.conversation.object.conversation import ConversationQuery

    dummy = ConversationQuery(
        conversation_id=str(uuid4()),
        title="テストタイトル",
        overview="テストオーバービュー",
        full_transcript="テストテキスト",
        # tags=["テストタグ1", "テストタグ2"],
        created_at=datetime.now(),
    )
    conversations = [dummy, dummy, dummy]
    return JSONResponse(content={"conversations": [c.model_dump() for c in conversations]})

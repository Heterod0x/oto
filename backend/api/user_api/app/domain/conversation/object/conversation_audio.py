from uuid import uuid4

from pydantic import BaseModel, Field


class ConversationAudio(BaseModel):
    user_id: str
    conversation_id: str = Field(default_factory=lambda: str(uuid4()))
    audio_data: bytes

from datetime import datetime
import uuid
from pydantic import BaseModel, Field, field_serializer

type ConversationId = str


class ConversationMetadata(BaseModel):
    record_start_at: datetime = Field(default_factory=datetime.now)  # TODO
    record_end_at: datetime = Field(default_factory=datetime.now)  # TODO
    duration: int = Field(default=0)  # TODO


class Conversation(BaseModel):
    conversation_id: ConversationId = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    tags: list[str]
    metadata: ConversationMetadata
    raw_voice_data: bytes
    # embedding: list[float]
    text_data: str


class ConversationQuery(BaseModel):
    conversation_id: ConversationId
    title: str
    text_data: str
    tags: list[str]
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime) -> str:
        return created_at.isoformat()

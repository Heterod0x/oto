from datetime import datetime
from typing import Optional
from enum import Enum
from sqlmodel import SQLModel, Field
import uuid


class ProcessingStatus(str, Enum):
    """Status of audio file processing"""

    NOT_STARTED = "not_started"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class SentimentType(str, Enum):
    """Sentiment types for analysis"""

    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class Conversation(SQLModel, table=True):
    """Conversation analysis table"""

    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    user_id: str = Field(index=True)
    status: ProcessingStatus = Field(default=ProcessingStatus.NOT_STARTED)
    inner_status: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_name: str
    file_path: str
    mime_type: str

    available_duration: Optional[str] = None
    language: Optional[str] = None
    situation: Optional[str] = None
    place: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    points: int = 0

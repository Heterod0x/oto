from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class ConversationJob(SQLModel, table=True):
    """Job table"""

    conversation_id: str = Field(primary_key=True)
    job_type: str = Field(primary_key=True)

    user_id: str = Field(index=True)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    flow_run_id: str


class PrefectJobStatus(BaseModel):
    status: str
    started_at: Optional[datetime] = None
    estimated_run_time_in_seconds: Optional[float] = None

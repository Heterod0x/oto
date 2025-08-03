from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid
from pydantic import BaseModel


class PointTransaction(SQLModel, table=True):
    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    amount: int = 0  # can be positive or negative

    conversation_id: Optional[str] = Field(index=True)


class Point(SQLModel, table=True):
    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    points: int = 0


class ClaimRequest(BaseModel):
    tx_base64: str

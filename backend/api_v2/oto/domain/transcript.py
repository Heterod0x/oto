from datetime import datetime
from pydantic import BaseModel, RootModel
from sqlmodel import SQLModel, Field


class Caption(BaseModel):
    timecode: str
    speaker: str
    caption: str


class Captions(RootModel[list[Caption]]):
    pass


class Transcript(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    captions_dump: str  # json dump of captions


class TranscriptResponse(BaseModel):
    id: str = Field(primary_key=True)
    created_at: datetime
    updated_at: datetime
    captions: Captions

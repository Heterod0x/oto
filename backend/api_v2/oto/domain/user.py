from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    """User profile table"""

    id: str = Field(primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    name: Optional[str] = None
    age: Optional[int] = None
    nationality: Optional[str] = None
    first_language: Optional[str] = None
    second_languages: Optional[str] = None
    interests: Optional[str] = None
    preferred_topics: Optional[str] = None

    def to_update_user(self) -> "UpdateUser":
        return UpdateUser(
            name=self.name,
            age=self.age,
            nationality=self.nationality,
            first_language=self.first_language,
            second_languages=self.second_languages,
            interests=self.interests,
            preferred_topics=self.preferred_topics,
        )


class UpdateUser(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    nationality: Optional[str] = None
    first_language: Optional[str] = None
    second_languages: Optional[str] = None
    interests: Optional[str] = None
    preferred_topics: Optional[str] = None

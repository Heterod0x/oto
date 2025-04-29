from typing import Optional

from pydantic import BaseModel


class UserProfile(BaseModel):
    # name: str
    age: int
    gender: str
    interests: Optional[list[str]] = None
    favorite_foods: Optional[list[str]] = None
    personality: str
    self_introduction: str

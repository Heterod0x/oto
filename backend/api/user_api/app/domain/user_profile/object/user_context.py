from pydantic import BaseModel
from enum import Enum


class UserContextTag(Enum):
    GENDER = "gender"
    AGE = "age"
    INTERESTS = "interests"
    FAVORITE_FOODS = "favorite_foods"
    PERSONALITY = "personality"


class UserContext(BaseModel):
    content: str
    tag: UserContextTag

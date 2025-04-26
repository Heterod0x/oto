from pydantic import BaseModel


class UserProfile(BaseModel):
    name: str
    age: int
    hobbies: list[str]
    gender: str
    favorite_foods: list[str]
    personality: str
    self_introduction: str

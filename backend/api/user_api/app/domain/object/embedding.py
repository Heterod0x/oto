from pydantic import BaseModel


class Embedding(BaseModel):
    values: list[float]

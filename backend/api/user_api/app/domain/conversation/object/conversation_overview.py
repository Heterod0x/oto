from pydantic import BaseModel


class ConversationOverview(BaseModel):
    title: str
    one_line_summary: str
    tags: list[str]

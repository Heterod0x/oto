from agno.agent import Agent
from app.agent.models.openai import openai_model
from app.agent.abstract_agent import AbstractAgent

from pydantic import BaseModel


class ConversationOverview(BaseModel):
    title: str
    one_line_summary: str
    tags: list[str]


class ConversationOverviewExtractor(AbstractAgent):
    def __init__(self):
        self.agent = Agent(
            model=openai_model,
            description="You extract the overview of a conversation from the transcript.",
            response_model=ConversationOverview,
        )

    def handle(self, transcript: str) -> ConversationOverview:
        return self.agent.run(transcript)

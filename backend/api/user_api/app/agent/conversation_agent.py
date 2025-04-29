from agno.agent import Agent

from app.agent.abstract_agent import AbstractAgent
from app.agent.models import default_model
from app.domain.conversation.object.conversation_overview import ConversationOverview


class ConversationOverviewExtractor(AbstractAgent):
    def __init__(self):
        self.agent = Agent(
            model=default_model,
            description="You extract the overview of a conversation from the transcript.",
            response_model=ConversationOverview,
        )

    def handle(self, transcript: str) -> ConversationOverview:
        response = self.agent.run(transcript)
        return response.content

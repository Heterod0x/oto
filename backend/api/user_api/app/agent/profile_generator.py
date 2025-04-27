from pathlib import Path

from agno.agent import Agent
from app.agent.abstract_agent import AbstractAgent
from app.agent.models.openai import openai_model
from app.domain.object.user_profile import UserProfile


class ProfileGenerator(AbstractAgent):
    def __init__(self):
        self.agent = Agent(
            model=openai_model,
            description="You generate a profile for a user based on their conversation.",
            response_model=UserProfile,
        )

    def store_ingredients(self, ingredients: list[str]) -> None:
        pass

    def generate_new(self):
        pass

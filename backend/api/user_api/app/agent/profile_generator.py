from agno.agent import Agent

from app.agent.abstract_agent import AbstractAgent
from app.agent.models.openai import openai_model
from app.domain.user_profile.object.user_context import UserContext
from app.domain.user_profile.object.user_profile import UserProfile


class ProfileGenerator(AbstractAgent):
    def __init__(self):
        self.agent = Agent(
            model=openai_model,
            instructions="抜き出した文章と考察をもとに、パーソナリティを出力してください。不明な情報はundefinedとしてください。",
            response_model=UserProfile,
        )

    def handle(self, contexts: list[UserContext]) -> UserProfile:
        response = self.agent.run(str(contexts))
        return response.content

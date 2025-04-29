from pydantic import BaseModel
from agno.agent import Agent
from app.agent.models import default_model
from agno.models.base import Model
from app.agent.abstract_agent import AbstractAgent


class ExtractedContent(BaseModel):
    content: str
    analysis_or_insights: str
    tag: str


class ExtractedContents(BaseModel):
    contents: list[ExtractedContent]


class ExtractorAgent(AbstractAgent):
    def __init__(
        self,
        target: str,
        schema: BaseModel,
        model: Model = default_model,
    ):
        instructions = """
        与えられたテキストから、{target}を以下の形式で把握するにあたって有用そうな文章と考察を、項目ごとに一つ以上抜き出してください

        ---

        {schema}
        """.format(
            target=target,
            schema=schema.model_json_schema(),
        )
        self._agent = Agent(
            model=model,
            instructions=instructions,
            response_model=ExtractedContents,
        )

    def handle(self, text: str) -> ExtractedContents:
        response = self._agent.run(text)
        return response.content  # type: ignore

from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from oto.domain.analysis import ConversationSummary
from functools import lru_cache


@lru_cache
def get_conversation_summary_service() -> "ConversationSummaryService":
    return ConversationSummaryService(get_vertexai())


class ConversationSummaryService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def get_summary(self, captions: Captions) -> ConversationSummary:
        messages = [
            Part.from_text(captions.model_dump_json()),
            self._prompt(),
        ]
        response = self.vertexai.model.generate_content(
            messages,
            generation_config=GenerationConfig(
                max_output_tokens=65535,
                response_mime_type="application/json",
                response_schema={
                    "type": "object",
                    "properties": {"summary": {"type": "string"}},
                    "required": ["summary"],
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        summary = ConversationSummary.model_validate_json(response.text)
        return summary

    def _prompt(self) -> str:
        return (
            """Please create an overall summary of this transcript under 100 words."""
        )

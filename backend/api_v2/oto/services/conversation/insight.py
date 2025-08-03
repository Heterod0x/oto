from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from oto.domain.analysis import ConversationInsight
from functools import lru_cache


@lru_cache
def get_conversation_insight_service() -> "ConversationInsightService":
    return ConversationInsightService(get_vertexai())


class ConversationInsightService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def get_insights(self, captions: Captions) -> ConversationInsight:
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
                    "properties": {
                        "suggestions": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "boring_score": {"type": "number"},
                        "density_score": {"type": "number"},
                        "clarity_score": {"type": "number"},
                        "engagement_score": {"type": "number"},
                        "interesting_score": {"type": "number"},
                    },
                    "required": [
                        "suggestions",
                        "boring_score",
                        "density_score",
                        "clarity_score",
                        "engagement_score",
                        "interesting_score",
                    ],
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        insights = ConversationInsight.model_validate_json(response.text)
        return insights

    def _prompt(self) -> str:
        return """Let's provide insights on this conversation. Please be honest and offer observations that will help the speaker.  
Scores should be given as percentages in decimal form (0–1)."""

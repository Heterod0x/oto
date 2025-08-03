from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from oto.domain.analysis import ConversationBreakdown
from functools import lru_cache


@lru_cache
def get_conversation_breakdown_service() -> "ConversationBreakdownService":
    return ConversationBreakdownService(get_vertexai())


class ConversationBreakdownService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def get_breakdown(self, captions: Captions) -> ConversationBreakdown:
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
                        "metadata": {
                            "type": "object",
                            "properties": {
                                "duration": {"type": "string"},
                                "language": {"type": "string"},
                                "situation": {"type": "string"},
                                "place": {"type": "string"},
                                "time": {"type": "string"},
                                "location": {"type": "string"},
                                "participants": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                },
                            },
                            "required": [
                                "duration",
                                "language",
                                "situation",
                                "place",
                                "time",
                                "location",
                                "participants",
                            ],
                        },
                        "sentiment": {
                            "type": "object",
                            "properties": {
                                "positive": {"type": "number"},
                                "neutral": {"type": "number"},
                                "negative": {"type": "number"},
                            },
                            "required": ["positive", "neutral", "negative"],
                        },
                        "keywords": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "keyword": {"type": "string"},
                                    "importance_score": {"type": "number"},
                                },
                                "required": ["keyword", "importance_score"],
                            },
                        },
                    },
                    "required": [
                        "metadata",
                        "sentiment",
                        "keywords",
                    ],
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        breakdown = ConversationBreakdown.model_validate_json(response.text)
        return breakdown

    def _prompt(self) -> str:
        return """Please provide a breakdown of this conversation.
Metadata may be estimated (empty allowed).
Sentiment should be determined from the emotional tone of the dialogue and expressed as values between 0 and 1.
Keywords should identify notable terms and assign each an importance score."""

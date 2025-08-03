from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from oto.domain.analysis import ConversationHighlights
from functools import lru_cache


@lru_cache
def get_conversation_highlight_service() -> "ConversationHighlightService":
    return ConversationHighlightService(get_vertexai())


class ConversationHighlightService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def get_highlights(self, captions: Captions) -> ConversationHighlights:
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
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "summary": {"type": "string"},
                            "highlight": {"type": "string"},
                            "timecode_start_at": {"type": "string"},
                            "timecode_end_at": {"type": "string"},
                            "favorite": {"type": "boolean"},
                        },
                        "required": [
                            "summary",
                            "highlight",
                            "timecode_start_at",
                            "timecode_end_at",
                            "favorite",
                        ],
                    },
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        highlights = ConversationHighlights.model_validate_json(response.text)
        return highlights

    def _prompt(self) -> str:
        return """Please create highlights from this transcript, dividing it into appropriate sections.  
Then, for the part you find most interesting, set `"favorite": true` (at least one, but not too many—choose the most compelling segment overall).
"""

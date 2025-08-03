from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from oto.domain.transcript import Captions
from oto.domain.analysis import ConversationHighlights
from oto.domain.user import UpdateUser
from functools import lru_cache


@lru_cache
def get_edit_profile_service() -> "EditProfileService":
    return EditProfileService(get_vertexai())


class EditProfileService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def edit_profile(
        self, captions: Captions, current_profile: UpdateUser
    ) -> UpdateUser:
        messages = [
            "Last conversation:",
            Part.from_text(captions.model_dump_json()),
            "Current profile:",
            Part.from_text(current_profile.model_dump_json()),
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
                        "name": {"type": "string"},
                        "age": {"type": "number"},
                        "nationality": {"type": "string"},
                        "first_language": {"type": "string"},
                        "second_languages": {"type": "string"},
                        "interests": {"type": "string"},
                        "preferred_topics": {"type": "string"},
                    },
                    "required": [
                        "name",
                        "age",
                        "nationality",
                        "first_language",
                        "second_languages",
                        "interests",
                        "preferred_topics",
                    ],
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        new_profile = UpdateUser.model_validate_json(response.text)
        return new_profile

    def _prompt(self) -> str:
        return """This user had a conversation recently. Please edit the profile based on the conversation.
You can keep the profile as is if there is no new information in the conversation. You may rsepect existing information in the profile as the user may have updated them.
`interests` and `preferred_topics` are comma separated list of strings.
If you want to keep the item none, set empty string. No `none` or `null` are allowed.
"""

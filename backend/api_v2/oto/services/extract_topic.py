from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from vertexai.language_models import TextEmbeddingInput
from oto.domain.transcript import Captions
from oto.domain.analysis import TopicDataList
from functools import lru_cache


@lru_cache
def get_extract_topic_service() -> "ExtractTopicService":
    return ExtractTopicService(get_vertexai())


class ExtractTopicService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai

    def extract_topics(self, captions: Captions) -> TopicDataList:
        messages = [
            Part.from_text(
                "```" + captions.model_dump_json() + "\n```\n\n" + self._prompt()
            ),
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
                            "topic": {"type": "string"},
                            "words": {"type": "array", "items": {"type": "string"}},
                            "related_conversations": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "timecode": {"type": "string"},
                                        "speaker": {"type": "string"},
                                        "caption": {"type": "string"},
                                    },
                                    "required": ["timecode", "speaker", "caption"],
                                },
                            },
                            "sentiment": {"type": "number"},
                        },
                        "required": [
                            "topic",
                            "words",
                            "related_conversations",
                            "sentiment",
                        ],
                    },
                },
            ),
        )

        topics = TopicDataList.model_validate_json(response.text)

        inputs = []
        for topic in topics.root:
            inputs.append(
                TextEmbeddingInput(text=" ".join(topic.words), task_type="CLUSTERING")
            )
        embeddings = self.vertexai.embed.get_embeddings(
            inputs, output_dimensionality=64
        )
        for topic, embedding in zip(topics.root, embeddings):
            topic.embedding = embedding.values

        self.vertexai.notify_response(response, self.vertexai.model)

        return topics

    def _prompt(self) -> str:
        return """From this transcript, please extract each topic of interest, the related words and conversation snippets, and assign an associated sentiment score on a scale from -1 (negative) to 1 (positive). Clip only the relevant portions of the dialogue with their timestamps. If the relevant parts are far apart, you may split them into separate elements in the array; if they form a continuous exchange, group them together.
Write each topic as a sentence that clearly conveys the overall idea.
All the contents must be written in English, including the topic, the words, and the related conversations.

The number of topics should be fewer than 30. You need to make it concise.
"""

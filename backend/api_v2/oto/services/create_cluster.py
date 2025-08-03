import hdbscan
import numpy as np

from vertexai.generative_models import Part, GenerationConfig

from oto.infra.vertexai import VertexAI, get_vertexai
from oto.domain.analysis import TopicData, TopicDataList, Topic
from functools import lru_cache
from oto.infra.database import create_db_session
from sqlmodel import select
from oto.domain.trend import TrendsAndMicroTrends


@lru_cache
def get_create_cluster_service() -> "CreateClusterService":
    return CreateClusterService(get_vertexai())


class CreateClusterService:
    def __init__(self, vertexai: VertexAI):
        self.vertexai = vertexai
        self.MAX_TOPICS = 1000
        self.MAX_TOPICS_PER_CLUSTER = 10
        self.HDBSCAN_MIN_CLUSTER_SIZE = 2
        self.HDBSCAN_MIN_SAMPLES = 1

    def create_trends(self) -> TrendsAndMicroTrends:
        topics = self._create_cluster()
        prompt = self._create_cluster_prompt(topics)

        messages = [
            self._prompt(),
            Part.from_text(prompt),
        ]
        response = self.vertexai.model.generate_content(
            messages,
            generation_config=GenerationConfig(
                max_output_tokens=65535,
                response_mime_type="application/json",
                response_schema={
                    "type": "object",
                    "properties": {
                        "trends": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "description": {"type": "string"},
                                    "volume": {"type": "number"},
                                    "overall_positive_sentiment": {"type": "number"},
                                    "overall_negative_sentiment": {"type": "number"},
                                    "cluster_id": {"type": "number"},
                                },
                                "required": [
                                    "title",
                                    "description",
                                    "volume",
                                    "overall_positive_sentiment",
                                    "overall_negative_sentiment",
                                    "cluster_id",
                                ],
                            },
                        },
                        "micro_trends": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "description": {"type": "string"},
                                    "volume": {"type": "number"},
                                    "overall_positive_sentiment": {"type": "number"},
                                    "overall_negative_sentiment": {"type": "number"},
                                },
                                "required": [
                                    "title",
                                    "description",
                                    "volume",
                                    "overall_positive_sentiment",
                                    "overall_negative_sentiment",
                                ],
                            },
                        },
                    },
                    "required": ["trends", "micro_trends"],
                },
            ),
        )

        self.vertexai.notify_response(response, self.vertexai.model)

        return TrendsAndMicroTrends.model_validate_json(response.text)

    def _create_cluster_prompt(self, topics: dict[int, list[TopicData]]) -> str:
        txt = ""
        for label, topic_list in topics.items():
            txt += f"# Cluster-{label}\n"
            i = 0
            for topic in topic_list:
                if i > self.MAX_TOPICS_PER_CLUSTER:
                    break
                txt += f"- Topic: {topic.topic}\n"
                txt += f"Words: {', '.join(topic.words)}\n"
                txt += f"Sentiment: {topic.sentiment}\n\n"
            txt += "\n"
        return txt

    def _create_cluster(self) -> dict[int, list[TopicData]]:
        with create_db_session() as session:
            list_of_topics = session.exec(select(Topic).limit(self.MAX_TOPICS)).all()
            topics: list[TopicData] = []
            for topic in list_of_topics:
                data_list = TopicDataList.model_validate_json(topic.data_dump)
                topics.extend(data_list.root)
            embeddings = np.array([topic.embedding for topic in topics])
            clusterer = hdbscan.HDBSCAN(
                min_cluster_size=self.HDBSCAN_MIN_CLUSTER_SIZE,
                min_samples=self.HDBSCAN_MIN_SAMPLES,
            )
            cluster_labels = clusterer.fit_predict(embeddings)
            dic: dict[int, list[TopicData]] = {}
            for topic, label in zip(topics, cluster_labels):
                if label == -1:
                    continue
                if label not in dic:
                    dic[label] = []
                dic[label].append(topic)
            return dic

    def _prompt(self) -> str:
        return """Please analyze the following cluster list and generate the required data based on this cluster list and information:
* Sentiment is represented on a scale from –1 to 1.
* overall_positive_sentiment and overall_negative_sentiment should each be represented as values from 0 to 1.
* Micro Trends title should be under 5 words.
* Description should be general and not too specific. 
* Don't include anything that leads to private information in any field. keep things general.
"""

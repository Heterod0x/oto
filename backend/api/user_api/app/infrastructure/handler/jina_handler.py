from enum import Enum

import requests

from app.config import jina_config


class EmbedType(Enum):
    PASSAGE = "passage"
    QUERY = "query"


class JinaEmbedddingClient:
    def __init__(self, embed_endpoint: str, api_key: str):
        self._embed_endpoint = embed_endpoint
        self._embeddings_model = jina_config.model_name
        self._task = {EmbedType.PASSAGE: "retrieval.passage", EmbedType.QUERY: "retrieval.query"}
        self._late_chunking = True
        self._headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }

    def embed_query(self, query: str, dimensions: int) -> list[float]:
        """Jina APIから埋め込みベクトルを取得する"""
        return self._embed(query, dimensions, EmbedType.QUERY)

    def embed_content_text(self, content_text: str, dimensions: int) -> list[float]:
        """Jina APIから埋め込みベクトルを取得する"""
        return self._embed(content_text, dimensions, EmbedType.PASSAGE)

    def _embed(self, input: str, dimensions: int, embed_type: EmbedType) -> list[float]:
        data = {
            "input": input,
            "model": self._embeddings_model,
            "dimensions": dimensions,
            "task": self._task[embed_type],
            "late_chunking": self._late_chunking,
        }
        response = requests.post(self._embed_endpoint, headers=self._headers, json=data)
        return response.json()["data"][0]["embedding"]


jina_embed_client = JinaEmbedddingClient(embed_endpoint=jina_config.embed_endpoint, api_key=jina_config.jina_api_key)

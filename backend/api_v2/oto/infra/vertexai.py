import json
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationResponse
from vertexai.language_models import TextEmbeddingModel, TextEmbeddingInput
from google.oauth2 import service_account
from functools import lru_cache

from oto.environment import get_settings


@lru_cache
def get_vertexai() -> "VertexAI":
    settings = get_settings()
    return VertexAI(
        credentials_path=settings.google_cloud_credential_path,
        region=settings.google_cloud_region,
    )


class Tokens:
    def __init__(
        self,
        prompt_tokens: int,
        completion_tokens: int,
        thoughts_tokens: int,
        cache_tokens: int,
    ):
        self.prompt_tokens = prompt_tokens
        self.completion_tokens = completion_tokens
        self.thoughts_tokens = thoughts_tokens
        self.cache_tokens = cache_tokens


class VertexAI:
    def __init__(self, credentials_path: str, region: str):
        self.credentials = service_account.Credentials.from_service_account_file(
            credentials_path
        )
        vertexai.init(
            project=self.credentials.project_id,
            location=region,
            credentials=self.credentials,
        )
        self.model = GenerativeModel("gemini-2.5-flash")
        self.model_large = GenerativeModel("gemini-2.5-pro")
        self.embed = TextEmbeddingModel.from_pretrained(
            "text-multilingual-embedding-002"
        )

    def notify_response(self, response: GenerationResponse, model: GenerativeModel):
        print(
            {
                "model": model._model_name,
                "prompt_tokens": response.usage_metadata.prompt_token_count,
                "completion_tokens": response.usage_metadata.candidates_token_count,
                "thoughts_tokens": response.usage_metadata.thoughts_token_count,
                "cache_tokens": response.usage_metadata.cached_content_token_count,
            }
        )

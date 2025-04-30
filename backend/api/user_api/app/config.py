from pydantic_settings import BaseSettings


class LLMConfig(BaseSettings):
    default_provider: str = "google"


class SupabaseConfig(BaseSettings):
    supabase_url: str
    supabase_key: str


class JinaConfig(BaseSettings):
    jina_api_key: str
    embed_endpoint: str = "https://api.jina.ai/v1/embeddings"
    model_name: str = "jina-embeddings-v3"


llm_config = LLMConfig()
jina_config = JinaConfig()
supabase_config = SupabaseConfig()

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    google_cloud_credential_path: str
    google_cloud_bucket_name: str
    google_cloud_region: str
    prefect_api_url: str
    prefect_api_key: str
    fireworks_api_key: str
    privy_app_id: str
    privy_secret: str
    database_url: str
    maximum_conversations_limit: int
    sieve_api_key: str
    openai_api_key: str
    solana_keypair: str
    solana_rpc_url: str


@lru_cache
def get_settings() -> Settings:
    return Settings()

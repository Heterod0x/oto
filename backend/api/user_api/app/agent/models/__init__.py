from app.agent.models.gemini import gemini_model
from app.agent.models.openai import openai_model
from app.config import llm_config

mapping = {
    "google": gemini_model,
    "openai": openai_model,
}

default_model = mapping[llm_config.default_provider]

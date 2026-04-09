from app.config import settings
from app.providers.base import LLMProvider
from app.providers.ollama import OllamaProvider


def get_provider() -> LLMProvider:
    return OllamaProvider(
        base_url=settings.ollama_base_url,
        model=settings.ollama_model,
        temperature=settings.llm_temperature,
        max_tokens=settings.llm_max_tokens,
    )

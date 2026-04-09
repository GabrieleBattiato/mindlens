from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./mindlens.db"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3:8b"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 8192
    prompts_dir: Path = Path(__file__).parent.parent / "prompts"
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_prefix="CBD_")


settings = Settings()

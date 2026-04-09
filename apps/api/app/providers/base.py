from typing import Protocol


class LLMProvider(Protocol):
    async def analyze(self, system_prompt: str, user_prompt: str) -> str:
        """Send prompts to model, return raw string. Parsing happens in service layer."""
        ...

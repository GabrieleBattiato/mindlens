import httpx

from app.exceptions import LLMProviderError


class OllamaProvider:
    def __init__(
        self,
        base_url: str,
        model: str,
        temperature: float,
        max_tokens: int,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self._client = httpx.AsyncClient(timeout=300.0)

    async def close(self) -> None:
        await self._client.aclose()

    async def analyze(self, system_prompt: str, user_prompt: str) -> str:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "format": "json",
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
            },
        }

        try:
            resp = await self._client.post(f"{self.base_url}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"]
        except httpx.HTTPStatusError as exc:
            raise LLMProviderError(
                f"Ollama returned {exc.response.status_code}: {exc.response.text}"
            ) from exc
        except httpx.RequestError as exc:
            raise LLMProviderError(
                f"Failed to connect to Ollama at {self.base_url}: {exc}"
            ) from exc
        except (KeyError, TypeError) as exc:
            raise LLMProviderError(
                f"Unexpected Ollama response format: {exc}"
            ) from exc

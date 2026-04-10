import httpx
from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from app.config import settings
from app.providers import get_provider

router = APIRouter(prefix="/api/settings", tags=["settings"])


class ProviderInfo(BaseModel):
    provider: str
    model: str
    temperature: float
    max_tokens: int
    ollama_base_url: str
    ollama_model: str


class ProviderUpdate(BaseModel):
    model: str | None = None
    ollama_base_url: str | None = Field(None, pattern=r"^https?://[^\s<>\"']+$")


@router.get("", response_model=ProviderInfo)
async def get_settings():
    return ProviderInfo(
        provider="ollama",
        model=settings.ollama_model,
        temperature=settings.llm_temperature,
        max_tokens=settings.llm_max_tokens,
        ollama_base_url=settings.ollama_base_url,
        ollama_model=settings.ollama_model,
    )


@router.get("/health")
async def check_health():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.ollama_base_url}/api/tags")
            resp.raise_for_status()
            data = resp.json()
            available = [m["name"] for m in data.get("models", [])]
            model_ok = settings.ollama_model in available
            return {
                "ok": model_ok,
                "model": settings.ollama_model,
                "ollama_reachable": True,
                "model_available": model_ok,
                "available_models": available,
                "error": None if model_ok else "model_not_found",
            }
    except httpx.RequestError:
        return {
            "ok": False,
            "model": settings.ollama_model,
            "ollama_reachable": False,
            "model_available": False,
            "available_models": [],
            "error": "ollama_unreachable",
        }
    except Exception:
        return {
            "ok": False,
            "model": settings.ollama_model,
            "ollama_reachable": False,
            "model_available": False,
            "available_models": [],
            "error": "unknown",
        }


@router.put("", response_model=ProviderInfo)
async def update_settings(data: ProviderUpdate, request: Request):
    if data.model:
        settings.ollama_model = data.model
    if data.ollama_base_url:
        settings.ollama_base_url = data.ollama_base_url

    # Hot-swap the provider
    old_provider = request.app.state.provider
    if hasattr(old_provider, "close"):
        await old_provider.close()

    request.app.state.provider = get_provider()

    return await get_settings()

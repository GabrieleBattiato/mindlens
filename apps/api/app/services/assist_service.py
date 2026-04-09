import json
import logging

from pydantic import ValidationError

from app.providers.base import LLMProvider
from app.schemas.assist import (
    AssistRequest,
    AssistResponse,
    AssistTip,
)
from app.services.prompt_builder import prompt_builder

logger = logging.getLogger(__name__)


async def generate_assist(
    data: AssistRequest,
    provider: LLMProvider,
) -> AssistResponse:
    system_prompt = prompt_builder.build_assist_system_prompt(data.step)
    user_prompt = prompt_builder.build_assist_user_prompt(
        activating_event=data.activating_event,
        belief=data.belief,
        consequence=data.consequence,
        disputation=data.disputation,
    )

    raw = await provider.analyze(system_prompt, user_prompt)

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.warning("Assist JSON decode error: %s", exc)
        raise ValueError("LLM returned invalid JSON") from exc

    try:
        result = AssistTip.model_validate(parsed)
        return AssistResponse(step=data.step, tip=result.tip)
    except ValidationError as exc:
        logger.warning("Assist validation error: %s", exc)
        raise ValueError("LLM output does not match expected schema") from exc

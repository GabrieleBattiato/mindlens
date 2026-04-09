import json
import logging
from datetime import datetime, timezone

from pydantic import ValidationError
from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import AnalysisNotFoundError
from app.models.analysis import Analysis
from app.providers.base import LLMProvider
from app.schemas.analysis import (
    AnalysisCreate,
    AnalysisCreateFreeMode,
    AnalysisCreateGuidedMode,
)
from app.schemas.llm_response import LLMAnalysisResponse
from app.services.prompt_builder import prompt_builder

logger = logging.getLogger(__name__)

SORT_COLUMNS = {
    "created_at": Analysis.created_at,
    "updated_at": Analysis.updated_at,
    "status": Analysis.status,
}


async def create_analysis(
    db: AsyncSession,
    data: AnalysisCreate,
    provider: LLMProvider,
) -> Analysis:
    """Create an analysis record, run LLM analysis, and return the result."""

    # Build the Analysis model from the discriminated union input
    if isinstance(data, AnalysisCreateFreeMode):
        analysis = Analysis(
            input_mode="free",
            raw_input=data.raw_input,
            status="processing",
        )
    else:
        # Guided mode: concatenate fields into raw_input for storage
        raw_input = (
            f"Situation: {data.situation}\n"
            f"Thoughts: {data.thoughts}\n"
            f"Emotions: {data.emotions}\n"
            f"Intensity: {data.intensity}/10\n"
            f"Behaviors: {data.behaviors or 'Not specified'}"
        )
        analysis = Analysis(
            input_mode="guided",
            raw_input=raw_input,
            guided_situation=data.situation,
            guided_thoughts=data.thoughts,
            guided_emotions=data.emotions,
            guided_intensity=data.intensity,
            guided_behaviors=data.behaviors,
            status="processing",
        )

    db.add(analysis)
    await db.flush()  # get the id assigned

    # Build prompts
    system_prompt = prompt_builder.build_system_prompt(strict=False)
    if isinstance(data, AnalysisCreateFreeMode):
        user_prompt = prompt_builder.build_user_prompt(
            mode="free",
            raw_input=data.raw_input,
        )
    else:
        user_prompt = prompt_builder.build_user_prompt(
            mode="guided",
            raw_input=analysis.raw_input,
            situation=data.situation,
            thoughts=data.thoughts,
            emotions=data.emotions,
            intensity=data.intensity,
            behaviors=data.behaviors,
        )

    # Attempt LLM call + parse
    result = await _call_and_parse(provider, system_prompt, user_prompt)

    if result is None:
        # Retry with strict prompt
        logger.info("First attempt failed for analysis %s, retrying with strict prompt", analysis.id)
        result = await _retry_strict(provider, user_prompt)

    if result is None:
        analysis.status = "failed"
        analysis.error_message = "LLM returned invalid output after retry"
        analysis.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(analysis)
        return analysis

    analysis.result_json = result.model_dump_json()
    analysis.status = "completed"
    analysis.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(analysis)
    return analysis


async def _call_and_parse(
    provider: LLMProvider,
    system_prompt: str,
    user_prompt: str,
) -> LLMAnalysisResponse | None:
    """Call the LLM and parse the response. Returns None on failure."""
    try:
        raw = await provider.analyze(system_prompt, user_prompt)
    except Exception as exc:
        logger.error("LLM provider error: %s", exc)
        return None

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.warning("JSON decode error: %s", exc)
        return None

    try:
        return LLMAnalysisResponse.model_validate(parsed)
    except ValidationError as exc:
        logger.warning("Pydantic validation error: %s", exc)
        return None


async def _retry_strict(
    provider: LLMProvider,
    original_user_prompt: str,
) -> LLMAnalysisResponse | None:
    """Retry with strict system prompt and error context appended."""
    strict_system = prompt_builder.build_system_prompt(strict=True)
    retry_user = (
        original_user_prompt
        + "\n\n[RETRY] Your previous response could not be parsed. "
        "Return ONLY valid JSON matching the required schema, with no extra text."
    )
    return await _call_and_parse(provider, strict_system, retry_user)


async def retry_analysis(
    db: AsyncSession,
    analysis_id: str,
    provider: LLMProvider,
) -> Analysis:
    """Reset a failed analysis and re-run it with the original input."""
    analysis = await get_analysis(db, analysis_id)

    analysis.status = "processing"
    analysis.result_json = None
    analysis.error_message = None
    analysis.updated_at = datetime.now(timezone.utc)
    await db.flush()

    system_prompt = prompt_builder.build_system_prompt(strict=False)
    if analysis.input_mode == "free":
        user_prompt = prompt_builder.build_user_prompt(
            mode="free",
            raw_input=analysis.raw_input,
        )
    else:
        user_prompt = prompt_builder.build_user_prompt(
            mode="guided",
            raw_input=analysis.raw_input,
            situation=analysis.guided_situation or "",
            thoughts=analysis.guided_thoughts or "",
            emotions=analysis.guided_emotions or "",
            intensity=analysis.guided_intensity or 5,
            behaviors=analysis.guided_behaviors,
        )

    result = await _call_and_parse(provider, system_prompt, user_prompt)

    if result is None:
        result = await _retry_strict(provider, user_prompt)

    if result is None:
        analysis.status = "failed"
        analysis.error_message = "LLM returned invalid output after retry"
    else:
        analysis.result_json = result.model_dump_json()
        analysis.status = "completed"

    analysis.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(analysis)
    return analysis


async def get_analysis(db: AsyncSession, analysis_id: str) -> Analysis:
    """Get a single analysis by id."""
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    analysis = result.scalar_one_or_none()
    if analysis is None:
        raise AnalysisNotFoundError(analysis_id)
    return analysis


async def list_analyses(
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
    status: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> list[Analysis]:
    """List analyses with optional filtering and sorting."""
    stmt = select(Analysis)

    if status is not None:
        stmt = stmt.where(Analysis.status == status)

    column = SORT_COLUMNS.get(sort_by, Analysis.created_at)
    order_fn = desc if sort_order == "desc" else asc
    stmt = stmt.order_by(order_fn(column))

    stmt = stmt.offset(offset).limit(limit)

    result = await db.execute(stmt)
    return list(result.scalars().all())


async def delete_analysis(db: AsyncSession, analysis_id: str) -> None:
    """Delete an analysis by id."""
    analysis = await get_analysis(db, analysis_id)
    await db.delete(analysis)
    await db.commit()

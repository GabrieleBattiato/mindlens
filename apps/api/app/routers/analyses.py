import json

from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.analysis import Analysis
from app.providers.base import LLMProvider
from app.schemas.analysis import AnalysisCreate, AnalysisResponse
from app.services.analysis_service import (
    create_analysis,
    delete_analysis,
    get_analysis,
    list_analyses,
    retry_analysis,
    run_analysis,
)

router = APIRouter(prefix="/api/analyses", tags=["analyses"])


def get_provider(request: Request) -> LLMProvider:
    return request.app.state.provider


def _to_response(analysis: Analysis) -> AnalysisResponse:
    """Convert an Analysis ORM object to an AnalysisResponse, parsing result_json."""
    result = None
    if analysis.result_json is not None:
        result = (
            json.loads(analysis.result_json)
            if isinstance(analysis.result_json, str)
            else analysis.result_json
        )

    return AnalysisResponse(
        id=analysis.id,
        created_at=analysis.created_at,
        updated_at=analysis.updated_at,
        input_mode=analysis.input_mode,
        raw_input=analysis.raw_input,
        guided_situation=analysis.guided_situation,
        guided_thoughts=analysis.guided_thoughts,
        guided_emotions=analysis.guided_emotions,
        guided_intensity=analysis.guided_intensity,
        guided_behaviors=analysis.guided_behaviors,
        status=analysis.status,
        result_json=result,
        error_message=analysis.error_message,
        model_used=analysis.model_used,
        duration_seconds=analysis.duration_seconds,
        locale=analysis.locale,
    )


@router.post("", response_model=AnalysisResponse)
async def create_analysis_endpoint(
    data: AnalysisCreate,
    background_tasks: BackgroundTasks,
    provider: LLMProvider = Depends(get_provider),
    db: AsyncSession = Depends(get_db),
):
    analysis = await create_analysis(db, data, provider)
    background_tasks.add_task(run_analysis, analysis.id, provider)
    return _to_response(analysis)


@router.get("", response_model=list[AnalysisResponse])
async def list_analyses_endpoint(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
):
    analyses = await list_analyses(
        db,
        offset=offset,
        limit=limit,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return [_to_response(a) for a in analyses]


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_endpoint(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
):
    analysis = await get_analysis(db, analysis_id)
    return _to_response(analysis)


@router.post("/{analysis_id}/retry", response_model=AnalysisResponse)
async def retry_analysis_endpoint(
    analysis_id: str,
    background_tasks: BackgroundTasks,
    provider: LLMProvider = Depends(get_provider),
    db: AsyncSession = Depends(get_db),
):
    analysis = await retry_analysis(db, analysis_id, provider)
    background_tasks.add_task(run_analysis, analysis.id, provider)
    return _to_response(analysis)


@router.post("/{analysis_id}/cancel", response_model=AnalysisResponse)
async def cancel_analysis_endpoint(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
):
    analysis = await get_analysis(db, analysis_id)
    if analysis.status in ("processing", "pending"):
        analysis.status = "cancelled"
        await db.commit()
        await db.refresh(analysis)
    return _to_response(analysis)


@router.delete("/{analysis_id}", status_code=204)
async def delete_analysis_endpoint(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
):
    await delete_analysis(db, analysis_id)

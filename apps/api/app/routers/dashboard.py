import json
from collections import Counter

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.analysis import Analysis
from app.models.exercise import Exercise
from app.schemas.dashboard import DashboardSummary, PatternItem

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    # Count analyses by status
    total_analyses = await _count(db, Analysis)
    completed_analyses = await _count(db, Analysis, status="completed")
    failed_analyses = await _count(db, Analysis, status="failed")

    # Count exercises
    total_exercises = await _count(db, Exercise)

    # Get completed analyses to extract patterns
    stmt = (
        select(Analysis.result_json)
        .where(Analysis.status == "completed")
        .where(Analysis.result_json.isnot(None))
        .order_by(Analysis.created_at.desc())
        .limit(100)
    )
    result = await db.execute(stmt)
    result_jsons = result.scalars().all()

    distortion_counter: Counter[str] = Counter()
    emotion_counter: Counter[str] = Counter()
    recent_analyses_data: list[dict] = []

    for raw in result_jsons:
        try:
            parsed = json.loads(raw) if isinstance(raw, str) else raw
        except (json.JSONDecodeError, TypeError):
            continue

        # Extract distortions
        for d in parsed.get("cognitive_distortions", []):
            name = d.get("name") if isinstance(d, dict) else None
            if name:
                distortion_counter[name] += 1

        # Extract emotions
        for e in parsed.get("emotions", []):
            name = e.get("name") if isinstance(e, dict) else None
            if name:
                emotion_counter[name] += 1

    top_distortions = [
        PatternItem(name=name, occurrences=count)
        for name, count in distortion_counter.most_common(10)
    ]
    top_emotions = [
        PatternItem(name=name, occurrences=count)
        for name, count in emotion_counter.most_common(10)
    ]

    # Recent analyses (last 5, simplified)
    recent_stmt = (
        select(Analysis)
        .order_by(Analysis.created_at.desc())
        .limit(5)
    )
    recent_result = await db.execute(recent_stmt)
    for a in recent_result.scalars().all():
        recent_analyses_data.append({
            "id": a.id,
            "created_at": a.created_at.isoformat(),
            "input_mode": a.input_mode,
            "status": a.status,
            "summary": _extract_summary(a.result_json),
        })

    return DashboardSummary(
        total_analyses=total_analyses,
        completed_analyses=completed_analyses,
        failed_analyses=failed_analyses,
        total_exercises=total_exercises,
        top_distortions=top_distortions,
        top_emotions=top_emotions,
        recent_analyses=recent_analyses_data,
    )


async def _count(db: AsyncSession, model: type[Any], status: str | None = None) -> int:
    stmt = select(func.count(model.id))
    if status is not None:
        stmt = stmt.where(model.status == status)
    result = await db.execute(stmt)
    return result.scalar_one()


def _extract_summary(result_json: str | None) -> str | None:
    if result_json is None:
        return None
    try:
        parsed = json.loads(result_json) if isinstance(result_json, str) else result_json
        return parsed.get("summary")
    except (json.JSONDecodeError, TypeError):
        return None

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.assist import AssistRequest, AssistResponse
from app.schemas.exercise import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from app.services.assist_service import generate_assist
from app.services.exercise_service import (
    create_exercise,
    get_exercise,
    list_exercises,
    update_exercise,
)

router = APIRouter(prefix="/api/exercises", tags=["exercises"])


@router.post("", response_model=ExerciseResponse)
async def create_exercise_endpoint(
    data: ExerciseCreate,
    db: AsyncSession = Depends(get_db),
):
    exercise = await create_exercise(db, data)
    return exercise


@router.post("/assist", response_model=AssistResponse)
async def assist_exercise_endpoint(data: AssistRequest, request: Request):
    provider = request.app.state.provider
    return await generate_assist(data, provider)


@router.get("", response_model=list[ExerciseResponse])
async def list_exercises_endpoint(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    analysis_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    exercises = await list_exercises(db, offset=offset, limit=limit, analysis_id=analysis_id)
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise_endpoint(
    exercise_id: str,
    db: AsyncSession = Depends(get_db),
):
    exercise = await get_exercise(db, exercise_id)
    return exercise


@router.put("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise_endpoint(
    exercise_id: str,
    data: ExerciseUpdate,
    db: AsyncSession = Depends(get_db),
):
    exercise = await update_exercise(db, exercise_id, data)
    return exercise

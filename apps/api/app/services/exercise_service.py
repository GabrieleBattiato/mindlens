from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import ExerciseNotFoundError
from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate


async def create_exercise(db: AsyncSession, data: ExerciseCreate) -> Exercise:
    """Create a new ABCDE exercise."""
    exercise = Exercise(
        analysis_id=data.analysis_id,
        activating_event=data.activating_event,
        belief=data.belief,
        consequence=data.consequence,
        disputation=data.disputation,
        effective_new_belief=data.effective_new_belief,
        new_emotion=data.new_emotion,
        new_behavior=data.new_behavior,
        notes=data.notes,
    )
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    return exercise


async def get_exercise(db: AsyncSession, exercise_id: str) -> Exercise:
    """Get a single exercise by id."""
    result = await db.execute(select(Exercise).where(Exercise.id == exercise_id))
    exercise = result.scalar_one_or_none()
    if exercise is None:
        raise ExerciseNotFoundError(exercise_id)
    return exercise


async def update_exercise(
    db: AsyncSession,
    exercise_id: str,
    data: ExerciseUpdate,
) -> Exercise:
    """Update an existing exercise with only the provided fields."""
    exercise = await get_exercise(db, exercise_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exercise, field, value)

    await db.commit()
    await db.refresh(exercise)
    return exercise


async def list_exercises(
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
    analysis_id: str | None = None,
) -> list[Exercise]:
    """List exercises ordered by creation date (newest first)."""
    stmt = select(Exercise).order_by(Exercise.created_at.desc())
    if analysis_id is not None:
        stmt = stmt.where(Exercise.analysis_id == analysis_id)
    stmt = stmt.offset(offset).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

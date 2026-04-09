from datetime import datetime
from pydantic import BaseModel, Field


class ExerciseCreate(BaseModel):
    analysis_id: str | None = None
    activating_event: str = Field(min_length=5)
    belief: str = Field(min_length=5)
    consequence: str = Field(min_length=5)
    disputation: str | None = None
    effective_new_belief: str | None = None
    new_emotion: str | None = None
    new_behavior: str | None = None
    notes: str | None = None


class ExerciseUpdate(BaseModel):
    activating_event: str | None = None
    belief: str | None = None
    consequence: str | None = None
    disputation: str | None = None
    effective_new_belief: str | None = None
    new_emotion: str | None = None
    new_behavior: str | None = None
    notes: str | None = None
    status: str | None = None


class ExerciseResponse(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime | None = None
    analysis_id: str | None = None
    activating_event: str
    belief: str
    consequence: str
    disputation: str | None = None
    effective_new_belief: str | None = None
    new_emotion: str | None = None
    new_behavior: str | None = None
    notes: str | None = None
    status: str

    model_config = {"from_attributes": True}

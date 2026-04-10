from datetime import datetime
from pydantic import BaseModel, Field


class ExerciseCreate(BaseModel):
    analysis_id: str | None = None
    activating_event: str = Field(min_length=5, max_length=5000)
    belief: str = Field(min_length=5, max_length=5000)
    consequence: str = Field(min_length=5, max_length=5000)
    disputation: str | None = Field(None, max_length=5000)
    effective_new_belief: str | None = Field(None, max_length=5000)
    new_emotion: str | None = Field(None, max_length=2000)
    new_behavior: str | None = Field(None, max_length=2000)
    notes: str | None = Field(None, max_length=5000)


class ExerciseUpdate(BaseModel):
    activating_event: str | None = Field(None, max_length=5000)
    belief: str | None = Field(None, max_length=5000)
    consequence: str | None = Field(None, max_length=5000)
    disputation: str | None = Field(None, max_length=5000)
    effective_new_belief: str | None = Field(None, max_length=5000)
    new_emotion: str | None = Field(None, max_length=2000)
    new_behavior: str | None = Field(None, max_length=2000)
    notes: str | None = Field(None, max_length=5000)
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

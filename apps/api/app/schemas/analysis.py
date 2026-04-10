from typing import Annotated, Literal
from datetime import datetime
from pydantic import BaseModel, Field


class AnalysisCreateFreeMode(BaseModel):
    input_mode: Literal["free"] = "free"
    raw_input: str = Field(min_length=10, max_length=5000)
    locale: Literal["es", "en"] = "es"


class AnalysisCreateGuidedMode(BaseModel):
    input_mode: Literal["guided"] = "guided"
    situation: str = Field(min_length=5, max_length=5000)
    thoughts: str = Field(min_length=5, max_length=5000)
    emotions: str = Field(min_length=3, max_length=2000)
    intensity: int = Field(ge=1, le=10)
    behaviors: str | None = Field(None, max_length=2000)
    locale: Literal["es", "en"] = "es"


AnalysisCreate = Annotated[
    AnalysisCreateFreeMode | AnalysisCreateGuidedMode,
    Field(discriminator="input_mode")
]


class AnalysisResponse(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime | None = None
    input_mode: str
    raw_input: str
    guided_situation: str | None = None
    guided_thoughts: str | None = None
    guided_emotions: str | None = None
    guided_intensity: int | None = None
    guided_behaviors: str | None = None
    status: str
    result_json: dict | None = None  # parsed JSON, not string
    error_message: str | None = None
    model_used: str | None = None
    duration_seconds: float | None = None
    locale: str = "es"

    model_config = {"from_attributes": True}

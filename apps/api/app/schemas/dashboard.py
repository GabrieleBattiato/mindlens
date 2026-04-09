from pydantic import BaseModel


class PatternItem(BaseModel):
    name: str
    occurrences: int


class DashboardSummary(BaseModel):
    total_analyses: int
    completed_analyses: int
    failed_analyses: int
    total_exercises: int
    top_distortions: list[PatternItem]
    top_emotions: list[PatternItem]
    recent_analyses: list[dict]  # simplified analysis objects

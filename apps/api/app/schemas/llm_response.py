from enum import Enum
from pydantic import BaseModel, Field


class FactInterpretation(BaseModel):
    facts: list[str]
    interpretations: list[str]


class EmotionItem(BaseModel):
    name: str
    intensity: int = Field(ge=1, le=10)
    is_primary: bool = False


class ABCModel(BaseModel):
    activating_event: str
    belief: str
    consequence: str


class CognitiveDistortion(BaseModel):
    name: str
    evidence: str
    confidence: float = Field(ge=0.0, le=1.0)


class BeliefAnalysis(BaseModel):
    core_belief: str | None = None
    intermediate_rules: list[str] = []
    evidence_for: list[str] = []
    evidence_against: list[str] = []


class MaintenanceCycleType(str, Enum):
    AVOIDANCE = "avoidance"
    CHECKING = "checking"
    RUMINATION = "rumination"
    REASSURANCE_SEEKING = "reassurance_seeking"
    SAFETY_BEHAVIOR = "safety_behavior"


class MaintenanceCycle(BaseModel):
    cycle_type: MaintenanceCycleType
    description: str
    maintaining_factors: list[str]


class Reframe(BaseModel):
    alternative_thought: str
    reasoning: str


class CBTExercise(BaseModel):
    type: str
    title: str
    description: str
    steps: list[str]


class LLMAnalysisResponse(BaseModel):
    summary: str
    fact_vs_interpretation: FactInterpretation
    emotions: list[EmotionItem] = Field(min_length=1)
    abc_model: ABCModel
    cognitive_distortions: list[CognitiveDistortion]
    belief_analysis: BeliefAnalysis | None = None
    maintenance_cycle: MaintenanceCycle | None = None
    reframe: Reframe
    cbt_exercises: list[CBTExercise] = Field(min_length=1)
    pattern_hints: list[str] = []
    needs_clarification: bool = False
    clarification_questions: list[str] = []

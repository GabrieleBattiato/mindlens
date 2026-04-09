from typing import Literal

from pydantic import BaseModel, Field, model_validator


class AssistRequest(BaseModel):
    step: Literal["disputation", "new_belief"]
    activating_event: str = Field(min_length=5)
    belief: str = Field(min_length=5)
    consequence: str = Field(min_length=5)
    disputation: str | None = None

    @model_validator(mode="after")
    def check_disputation_for_new_belief(self):
        if self.step == "new_belief" and not self.disputation:
            raise ValueError("disputation is required when step is 'new_belief'")
        return self


class AssistTip(BaseModel):
    tip: str


class AssistResponse(BaseModel):
    step: str
    tip: str

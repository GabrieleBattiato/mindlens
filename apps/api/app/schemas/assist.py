from typing import Literal

from pydantic import BaseModel, Field, model_validator


class AssistRequest(BaseModel):
    step: Literal["disputation", "new_belief"]
    activating_event: str = Field(min_length=5, max_length=5000)
    belief: str = Field(min_length=5, max_length=5000)
    consequence: str = Field(min_length=5, max_length=5000)
    disputation: str | None = Field(None, max_length=5000)

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

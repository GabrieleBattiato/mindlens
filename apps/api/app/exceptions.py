from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AnalysisNotFoundError(Exception):
    def __init__(self, analysis_id: str):
        self.analysis_id = analysis_id
        super().__init__(f"Analysis {analysis_id} not found")


class ExerciseNotFoundError(Exception):
    def __init__(self, exercise_id: str):
        self.exercise_id = exercise_id
        super().__init__(f"Exercise {exercise_id} not found")


class LLMProviderError(Exception):
    def __init__(self, detail: str = "LLM provider error"):
        self.detail = detail
        super().__init__(detail)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AnalysisNotFoundError)
    async def analysis_not_found_handler(request: Request, exc: AnalysisNotFoundError):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(ExerciseNotFoundError)
    async def exercise_not_found_handler(request: Request, exc: ExerciseNotFoundError):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(LLMProviderError)
    async def llm_provider_error_handler(request: Request, exc: LLMProviderError):
        return JSONResponse(status_code=502, content={"detail": exc.detail})

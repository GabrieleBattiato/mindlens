from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.exceptions import register_exception_handlers
from app.providers import get_provider
from app.routers import analyses, dashboard, exercises, settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    provider = get_provider()
    app.state.provider = provider
    yield
    if hasattr(provider, "close"):
        await provider.close()


app = FastAPI(title="MindLens", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4001",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

register_exception_handlers(app)

app.include_router(analyses.router)
app.include_router(exercises.router)
app.include_router(dashboard.router)
app.include_router(settings.router)

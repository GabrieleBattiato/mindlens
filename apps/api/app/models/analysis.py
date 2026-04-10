from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    input_mode: Mapped[str] = mapped_column(String(10))
    raw_input: Mapped[str] = mapped_column(Text)
    guided_situation: Mapped[str | None] = mapped_column(Text, nullable=True)
    guided_thoughts: Mapped[str | None] = mapped_column(Text, nullable=True)
    guided_emotions: Mapped[str | None] = mapped_column(Text, nullable=True)
    guided_intensity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    guided_behaviors: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    result_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    model_used: Mapped[str | None] = mapped_column(String(100), nullable=True)
    duration_seconds: Mapped[float | None] = mapped_column(Float, nullable=True)

    exercises = relationship("Exercise", back_populates="analysis")

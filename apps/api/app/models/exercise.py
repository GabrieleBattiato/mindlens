from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    analysis_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("analyses.id"), nullable=True)
    activating_event: Mapped[str] = mapped_column(Text)
    belief: Mapped[str] = mapped_column(Text)
    consequence: Mapped[str] = mapped_column(Text)
    disputation: Mapped[str | None] = mapped_column(Text, nullable=True)
    effective_new_belief: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_emotion: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_behavior: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="in_progress")

    analysis = relationship("Analysis", back_populates="exercises")

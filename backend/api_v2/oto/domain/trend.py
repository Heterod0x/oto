from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid
from pydantic import BaseModel


class TrendData(BaseModel):
    title: str
    description: str
    volume: float
    overall_positive_sentiment: float
    overall_negative_sentiment: float
    cluster_id: int


class MicroTrendData(BaseModel):
    title: str
    description: str
    volume: float
    overall_positive_sentiment: float
    overall_negative_sentiment: float


class Trend(SQLModel, TrendData, table=True):
    """Topic table for trending topics"""

    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @classmethod
    def from_trend_data(cls, trend_data: TrendData) -> "Trend":
        return cls(
            **trend_data.model_dump(),
        )


class MicroTrend(SQLModel, MicroTrendData, table=True):
    """Micro trend table"""

    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @classmethod
    def from_micro_trend_data(cls, micro_trend_data: MicroTrendData) -> "MicroTrend":
        return cls(
            **micro_trend_data.model_dump(),
        )


class TrendsAndMicroTrends(BaseModel):
    trends: list[TrendData]
    micro_trends: list[MicroTrendData]

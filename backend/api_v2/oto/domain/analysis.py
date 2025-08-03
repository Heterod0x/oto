from pydantic import BaseModel, RootModel
from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional
from oto.domain.transcript import Caption


class ConversationHighlight(BaseModel):
    summary: str
    highlight: str
    timecode_start_at: str
    timecode_end_at: str
    favorite: bool


class ConversationHighlights(RootModel[list[ConversationHighlight]]):
    pass


class ConversationSummary(BaseModel):
    summary: str


class ConversationInsight(BaseModel):
    suggestions: list[str]
    boring_score: float
    density_score: float
    clarity_score: float
    engagement_score: float
    interesting_score: float


class ConversationMetadata(BaseModel):
    duration: str
    language: str
    situation: str
    place: str
    time: str
    location: str
    participants: list[str]


class ConversationSentiment(BaseModel):
    positive: float
    neutral: float
    negative: float


class ConversationKeyword(BaseModel):
    keyword: str
    importance_score: float


class ConversationBreakdown(BaseModel):
    metadata: ConversationMetadata
    sentiment: ConversationSentiment
    keywords: list[ConversationKeyword]


class ConversationAnalysisData(BaseModel):
    summary: ConversationSummary
    highlights: ConversationHighlights
    insights: ConversationInsight
    breakdown: ConversationBreakdown


class ConversationAnalysis(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    summary_dump: Optional[str] = None
    highlights_dump: Optional[str] = None
    insights_dump: Optional[str] = None
    breakdown_dump: Optional[str] = None

    @classmethod
    def from_conversation_data(cls, conversation_data: ConversationAnalysisData):
        return cls(
            summary_dump=conversation_data.summary.model_dump_json(),
            highlights_dump=conversation_data.highlights.model_dump_json(),
            insights_dump=conversation_data.insights.model_dump_json(),
            breakdown_dump=conversation_data.breakdown.model_dump_json(),
        )

    def to_conversation_data(self) -> ConversationAnalysisData:
        return ConversationAnalysisData(
            summary=ConversationSummary.model_validate_json(self.summary_dump),
            highlights=ConversationHighlights.model_validate_json(self.highlights_dump),
            insights=ConversationInsight.model_validate_json(self.insights_dump),
            breakdown=ConversationBreakdown.model_validate_json(self.breakdown_dump),
        )


class TopicData(BaseModel):
    topic: str
    words: list[str]
    related_conversations: list[Caption]
    sentiment: float
    embedding: Optional[list[float]] = None


class TopicDataList(RootModel[list[TopicData]]):
    pass


class Topic(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    data_dump: str

    @classmethod
    def from_topic_datas(cls, topic_datas: TopicDataList) -> "Topic":
        return cls(
            data_dump=topic_datas.model_dump_json(),
        )

    def to_topic_datas(self) -> TopicDataList:
        return TopicDataList.model_validate_json(self.data_dump)

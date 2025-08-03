from pydantic import BaseModel


class Word(BaseModel):
    word: str
    language: str
    probability: float
    hallucination_score: float
    start: float
    end: float
    speaker_id: str


class Segment(BaseModel):
    id: int
    seek: int
    text: str
    language: str
    tokens: list[int]
    start: float
    end: float
    audio_start: float
    audio_end: float
    temperature: float
    compression_ratio: float
    avg_logprob: float
    no_speech_prob: float
    no_speech: bool
    retry_count: int
    speaker_id: str
    words: list[Word]


class FireworksTranscriptionResponse(BaseModel):
    task: str
    language: str  # "," splittable
    text: str
    words: list[Word]
    segments: list[Segment]
    duration: float

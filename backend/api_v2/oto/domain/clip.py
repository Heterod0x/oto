from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import RootModel, BaseModel
import uuid


class ClipCaption(BaseModel):
    timecode_start: str
    timecode_end: str
    speaker: str
    caption: str


class ClipCaptions(RootModel[list[ClipCaption]]):
    pass


class ClipData(BaseModel):
    title: str
    description: str
    comment: str
    captions: ClipCaptions
    audio: Optional[bytes] = None


class ClipDatas(RootModel[list[ClipData]]):
    pass


class Clip(SQLModel, table=True):
    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()), primary_key=True
    )
    user_id: str = Field(index=True)
    conversation_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_name: str
    file_path: str
    mime_type: str

    comment_file_name: str
    comment_file_path: str
    comment_mime_type: str

    title: str
    description: str
    comment: str
    captions_dump: str

    def set_clip_data(self, clip_data: ClipData):
        clip_data = clip_data.model_copy(deep=True)
        # remove audio data to save memory
        clip_data.audio = None

        self.title = clip_data.title
        self.description = clip_data.description
        self.comment = clip_data.comment
        self.captions_dump = clip_data.captions.model_dump_json()

    def get_clip_data(self) -> ClipData:
        return ClipData(
            title=self.title,
            description=self.description,
            comment=self.comment,
            captions=ClipCaptions.model_validate_json(self.captions_dump),
        )


class Clips(RootModel[list[Clip]]):
    pass

from pydub import AudioSegment
from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig
from functools import lru_cache
from oto.environment import get_settings
from oto.domain.clip import ClipDatas, ClipCaptions
from typing import BinaryIO
from io import BytesIO
import pydub
from oto.infra.storage import get_storage


@lru_cache
def get_clip_construct_service() -> "ClipConstructService":
    settings = get_settings()
    return ClipConstructService(get_vertexai(), settings.google_cloud_bucket_name)


class ClipConstructService:
    def __init__(self, vertexai: VertexAI, bucket_name: str):
        self.vertexai = vertexai
        self.bucket_name = bucket_name

    def construct(self, audio_data: BinaryIO, clip_datas: ClipDatas) -> ClipDatas:
        audio_segment: AudioSegment = AudioSegment.from_file(audio_data)
        audio_duration = audio_segment.duration_seconds

        for clip_data in clip_datas.root:
            clip = AudioSegment.empty()
            contained_ranges: list[tuple[float, float]] = []
            for caption in clip_data.captions.root:
                start_time = self.timecode_to_seconds(caption.timecode_start)
                # include -1 seconds if not overlapping with other captions
                if not self.is_already_contained(start_time - 1, contained_ranges):
                    start_time = start_time - 1
                if start_time < 0:
                    start_time = 0
                end_time = self.timecode_to_seconds(caption.timecode_end)
                # include +1 seconds if not overlapping with other captions
                if not self.is_already_contained(end_time + 1, contained_ranges):
                    end_time = end_time + 1
                if end_time > audio_duration:
                    end_time = audio_duration

                contained_ranges.append((start_time, end_time))
                clip += audio_segment[start_time * 1000 : end_time * 1000]
            bytes_io = BytesIO()
            clip.export(bytes_io, format="wav")
            clip_data.audio = bytes_io.getvalue()
            bytes_io.close()

        return clip_datas

    def is_already_contained(
        self, target_time: float, contained_ranges: list[tuple[float, float]]
    ) -> bool:
        for contained_start, contained_end in contained_ranges:
            if target_time > contained_start and target_time < contained_end:
                return True
        return False

    def construct_with_captions(
        self, audio_data: BinaryIO, captions: ClipCaptions
    ) -> tuple[bytes, ClipCaptions]:
        captions = captions.model_copy(deep=True)
        audio_segment: AudioSegment = AudioSegment.from_file(audio_data)

        clip = AudioSegment.empty()
        for caption in captions.root:
            new_start_seconds = clip.duration_seconds
            start_time = self.timecode_to_seconds(caption.timecode_start)
            end_time = self.timecode_to_seconds(caption.timecode_end)
            clip += audio_segment[start_time * 1000 : end_time * 1000]
            new_end_seconds = clip.duration_seconds
            caption.timecode_start = self.seconds_to_timecode(new_start_seconds)
            caption.timecode_end = self.seconds_to_timecode(new_end_seconds)
            print(caption.timecode_start, caption.timecode_end)
        bytes_io = BytesIO()
        clip.export(bytes_io, format="wav")
        audio = bytes_io.getvalue()
        bytes_io.close()

        return audio, captions

    def seconds_to_timecode(self, seconds: float) -> str:
        # h, m, s, ms
        timecode = ""
        hours = int(seconds // 3600)
        seconds %= 3600
        minutes = int(seconds // 60)
        seconds %= 60
        timecode = f"{hours:02d}:{minutes:02d}:{seconds:06.3f}"
        return timecode

    def timecode_to_seconds(self, timecode: str) -> float:
        milliseconds = 0
        if "." in timecode:
            milliseconds = int(timecode.split(".")[1])
            timecode = timecode.split(".")[0]

        if timecode.count(":") == 1:
            minutes, seconds = timecode.split(":")
            return int(minutes) * 60 + int(seconds) + milliseconds / 1000
        elif timecode.count(":") == 2:
            hours, minutes, seconds = timecode.split(":")
            return (
                int(hours) * 3600
                + int(minutes) * 60
                + int(seconds)
                + milliseconds / 1000
            )
        else:
            raise ValueError(f"Invalid timecode: {timecode}")

import time
import requests
from pydub import AudioSegment
from functools import lru_cache
from oto.environment import get_settings
from io import BytesIO
# we dont use sieva sdk, because it is shitty sdk, so we use rest api


@lru_cache
def get_audio_enhancer_service() -> "AudioEnhancerService":
    settings = get_settings()
    return AudioEnhancerService(settings.sieve_api_key)


class AudioEnhancerService:
    def __init__(self, sieve_api_key: str):
        self.sieve_api_key = sieve_api_key

    def enhance_audio(self, signed_url: str, output_format: str = "opus") -> bytes:
        job_id = self._create_job(signed_url)
        start_time = time.time()
        while start_time + 120 > time.time():
            time.sleep(3)
            job = self._get_job(job_id)
            status = job["status"]
            if status == "processing" or status == "queued" or status == "started":
                continue
            elif status == "error":
                raise Exception(job["error"])
            elif status == "finished":
                download_url = job["outputs"][0]["data"]["url"]
                response = requests.get(download_url)
                bytes = response.content
                seg: AudioSegment = AudioSegment.from_file(BytesIO(bytes))
                bytes_io = BytesIO()
                seg.export(bytes_io, format=output_format)
                audio = bytes_io.getvalue()
                bytes_io.close()
                return audio
            else:
                raise Exception(f"Unknown job status: {status}")
        raise Exception(f"Job timed out: {job_id}")

    def convert_to_opus(self, bytes: bytes) -> bytes:
        seg: AudioSegment = AudioSegment.from_file(BytesIO(bytes))
        bytes_io = BytesIO()
        seg.export(bytes_io, format="opus")
        return bytes_io.getvalue()

    def _create_job(self, signed_url: str) -> str:
        response = requests.post(
            "https://mango.sievedata.com/v2/push",
            headers={
                "Content-Type": "application/json",
                "X-API-Key": self.sieve_api_key,
            },
            json={
                "function": "sieve/audio_enhancement",
                "inputs": {
                    "audio": {"url": signed_url},
                    "filter_type": "all",
                    "enhancement_steps": 64,
                },
            },
        )
        return response.json()["id"]

    def _get_job(self, job_id: str) -> dict:
        response = requests.get(
            f"https://mango.sievedata.com/v2/jobs/{job_id}",
            headers={
                "X-API-Key": self.sieve_api_key,
            },
        )
        return response.json()

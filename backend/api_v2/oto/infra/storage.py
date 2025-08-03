import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException
from google.cloud import storage
from datetime import timedelta
from functools import lru_cache
from oto.environment import get_settings


@lru_cache
def get_storage():
    settings = get_settings()
    return GoogleCloudStorage(
        bucket_name=settings.google_cloud_bucket_name,
        credentials_path=settings.google_cloud_credential_path,
    )


class GoogleCloudStorage:
    def __init__(self, bucket_name: str, credentials_path: str = None):
        self.bucket_name = bucket_name
        if credentials_path:
            self.client = storage.Client.from_service_account_json(credentials_path)
        else:
            self.client = storage.Client()

        self.bucket = self.client.bucket(self.bucket_name)

    def upload_file(self, file: UploadFile, folder_path: str) -> str:
        try:
            if "." not in file.filename:
                raise HTTPException(status_code=400, detail="File has no extension")

            ext = file.filename.split(".")[-1]
            blob_name = self._generate_unique_filename(ext, folder_path)

            blob = self.bucket.blob(blob_name)
            blob.upload_from_file(file.file)

            return blob_name
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    def upload_bytes(
        self, bytes: bytes, folder_path: str, ext: str, mime_type: str
    ) -> str:
        try:
            blob_name = self._generate_unique_filename(ext, folder_path)
            blob = self.bucket.blob(blob_name)
            blob.upload_from_string(bytes, content_type=mime_type)
            return blob_name
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    def delete_file(self, filename: str):
        try:
            blob = self.bucket.blob(filename)
            if not blob.exists():
                raise HTTPException(status_code=404, detail="File not found")

            blob.delete()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

    def generate_signed_url(self, filename: str) -> str:
        try:
            expiration_minutes = 60
            method = "GET"
            blob = self.bucket.blob(filename)
            if not blob.exists():
                raise HTTPException(status_code=404, detail="File not found")

            expiration = datetime.now() + timedelta(minutes=expiration_minutes)

            signed_url = blob.generate_signed_url(expiration=expiration, method=method)

            return signed_url

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Signed URL generation failed: {str(e)}"
            )

    def _generate_unique_filename(self, ext: str, folder_path: str = "") -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        filename = f"{timestamp}_{unique_id}.{ext}"

        if folder_path:
            filename = f"{folder_path.strip('/')}/{filename}"

        return filename

    def open_for_read(self, filename: str, chunk_kb: int = 1024):
        """
        returns a stream of the file
        """
        blob = self.bucket.blob(filename)
        if not blob.exists():
            raise HTTPException(status_code=404, detail="File not found")

        return blob.open("rb", chunk_size=chunk_kb * 1024)

from pydantic import BaseModel, Field
from enum import Enum

class FileType(str, Enum):
    JPEG = "image/jpeg"
    JPG = "image/jpg"
    PNG = "image/png"
    GIF = "image/gif"

class PresignedUrlRequest(BaseModel):
    file_name: str = Field(..., description="Name of the file to upload")
    file_type: FileType = Field(..., description="MIME type of the file")

class PresignedUrlResponse(BaseModel):
    upload_url: str = Field(..., description="URL to upload the file to")
    file_url: str = Field(..., description="URL where the file will be accessible")
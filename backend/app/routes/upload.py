from fastapi import APIRouter, Depends
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.upload import PresignedUrlRequest, PresignedUrlResponse
from app.services.upload import generate_presigned_upload_url

router = APIRouter(prefix="/api/uploads", tags=["File Uploads"])

@router.post("/presigned-url", response_model=PresignedUrlResponse)
def get_presigned_url(
    request: PresignedUrlRequest,
    current_user: User = Depends(get_current_user)
):
    return generate_presigned_upload_url(request)
import boto3
import uuid
from botocore.exceptions import ClientError
from app.config import settings
from fastapi import HTTPException, status
from app.schemas.upload import PresignedUrlRequest, PresignedUrlResponse

def generate_presigned_upload_url(request: PresignedUrlRequest) -> PresignedUrlResponse:
    """
    Generate a presigned URL for uploading a file to S3
    """
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        
        # Generate a unique file name to prevent overwriting
        file_extension = request.file_name.split('.')[-1]
        unique_filename = f"uploads/{uuid.uuid4()}.{file_extension}"
        
        # Generate the presigned URL for upload
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.AWS_S3_BUCKET_NAME,
                'Key': unique_filename,
                'ContentType': "image/jpg"
            },
            ExpiresIn=3600  # URL expires in 1 hour
        )
        
        # The URL where the file will be accessible after upload
        file_url = f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
        
        return PresignedUrlResponse(
            upload_url=presigned_url,
            file_url=file_url
        )
    
    except ClientError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating presigned URL: {str(e)}"
        )
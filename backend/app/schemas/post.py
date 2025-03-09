from pydantic import BaseModel, field_validator, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum
from app.schemas.error import ErrorDetail

class ErrorCode(str, Enum):
    """Error codes for validation failures"""
    EMPTY_FIELD = "empty_field"
    TOO_LONG = "too_long"
    NOT_FOUND = "not_found"
    PERMISSION_DENIED = "permission_denied"

class PostBase(BaseModel):
    title: str = Field(..., description="Blog post title")
    content: str = Field(..., description="Blog post content")
    image_url: Optional[str] = Field(None, description="URL to the post image")

class PostCreate(PostBase):
    @field_validator("title")
    def validate_title(cls, title: str) -> str:
        if not title.strip():
            raise ValueError(
                ErrorDetail(
                    field="title",
                    message="Title cannot be empty",
                    code=ErrorCode.EMPTY_FIELD
                ).model_dump()
            )
        elif len(title) > 100:
            raise ValueError(
                ErrorDetail(
                    field="title",
                    message="Title cannot exceed 100 characters",
                    code=ErrorCode.TOO_LONG
                ).model_dump()
            )
        return title.strip()

    @field_validator("content")
    def validate_content(cls, content: str) -> str:
        if not content.strip():
            raise ValueError(
                ErrorDetail(
                    field="content",
                    message="Content cannot be empty",
                    code=ErrorCode.EMPTY_FIELD
                ).model_dump()
            )
        return content.strip()

class PostUpdate(PostBase):
    title: Optional[str] = Field(None, description="Blog post title")
    content: Optional[str] = Field(None, description="Blog post content")
    image_url: Optional[str] = Field(None, description="URL to the post image")
    
    @field_validator("title")
    def validate_title(cls, title: Optional[str]) -> Optional[str]:
        if title is None:
            return None
        
        if not title.strip():
            raise ValueError(
                ErrorDetail(
                    field="title",
                    message="Title cannot be empty",
                    code=ErrorCode.EMPTY_FIELD
                ).model_dump()
            )
        elif len(title) > 100:
            raise ValueError(
                ErrorDetail(
                    field="title",
                    message="Title cannot exceed 100 characters",
                    code=ErrorCode.TOO_LONG
                ).model_dump()
            )
        return title.strip()
    
    @field_validator("content")
    def validate_content(cls, content: Optional[str]) -> Optional[str]:
        if content is None:
            return None
            
        if not content.strip():
            raise ValueError(
                ErrorDetail(
                    field="content",
                    message="Content cannot be empty",
                    code=ErrorCode.EMPTY_FIELD
                ).model_dump()
            )
        return content.strip()
    
    class Config:
        populate_by_name = True

class PostResponse(PostBase):
    id: int
    user_id: int
    author_username: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PostList(BaseModel):
    total: int = Field(..., description="Total number of posts")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Number of items per page")
    items: List[PostResponse] = Field(..., description="List of posts")
    pages: int = Field(..., description="Total number of pages")
    
    class Config:
        from_attributes = True
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    """Schema for detailed error information"""
    field: Optional[str] = None
    message: str
    code: str

class ErrorResponse(BaseModel):
    """Standardized error response schema"""
    status_code: int
    error_type: str
    message: str
    details: Optional[List[ErrorDetail]] = None
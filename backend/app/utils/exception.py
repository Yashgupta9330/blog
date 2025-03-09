from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from app.schemas.error import ErrorResponse, ErrorDetail

class AppException(HTTPException):
    """Base exception class for application-specific exceptions"""
    
    def __init__(
        self,
        status_code: int,
        error_type: str,
        message: str,
        details: Optional[List[ErrorDetail]] = None,
        headers: Optional[Dict[str, Any]] = None
    ):
        self.status_code = status_code
        self.error_type = error_type
        self.details = details
        
        error_response = ErrorResponse(
            status_code=status_code,
            error_type=error_type,
            message=message,
            details=details
        )
        
        super().__init__(
            status_code=status_code,
            detail=error_response.model_dump(),
            headers=headers
        )

class NotFoundException(AppException):
    """Exception raised when a resource is not found"""
    
    def __init__(self, resource: str, resource_id: Any = None):
        message = f"{resource} not found"
        if resource_id:
            message = f"{resource} with ID {resource_id} not found"
            
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_type="not_found",
            message=message,
            details=[
                ErrorDetail(
                    field=resource.lower(),
                    message=message,
                    code="not_found"
                )
            ]
        )

class UnauthorizedException(AppException):
    """Exception raised for authentication errors"""
    
    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_type="unauthorized",
            message=message,
            headers={"WWW-Authenticate": "Bearer"}
        )

class ForbiddenException(AppException):
    """Exception raised when a user doesn't have permission to access a resource"""
    
    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_type="forbidden",
            message=message,
            details=[
                ErrorDetail(
                    message=message,
                    code="permission_denied"
                )
            ]
        )

class BadRequestException(AppException):
    """Exception raised for invalid request data"""
    
    def __init__(self, message: str, details: Optional[List[ErrorDetail]] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_type="bad_request",
            message=message,
            details=details
        )

class ConflictException(AppException):
    """Exception raised when there's a conflict with the current state of the resource"""
    
    def __init__(self, message: str, field: str, code: str = "conflict"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            error_type="conflict",
            message=message,
            details=[
                ErrorDetail(
                    field=field,
                    message=message,
                    code=code
                )
            ]
        )
from pydantic import BaseModel, Field
from typing import Optional

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(..., description="Token type, usually 'bearer'")

class TokenData(BaseModel):
    username: Optional[str] = Field(None, description="Username from the token")
    user_id: Optional[int] = Field(None, description="User ID from the token")
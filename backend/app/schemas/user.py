from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserType(str, Enum):
    admin = "admin"
    staff = "staff"


class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    user_type: UserType


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None

from datetime import datetime

from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List, Dict,Any

from app.schema.user_schema import User

class SignInNew(BaseModel):
    user_name: str
    password: str

class SignIn(BaseModel):
    email__eq: str
    password: str


class SignUp(BaseModel):
    email: str
    password: str
    name: str
    username:str
    role_id: int


class Payload(BaseModel):
    id: int
    email: str
    name: str
    is_superuser: bool
    user_role :Optional[str] = None
    user_token:str
    is_active:bool
    accessible_modules :List[str]


class SignInResponse(BaseModel):
    access_token: str
    expiration: datetime
    user_info: Dict[str, Any]

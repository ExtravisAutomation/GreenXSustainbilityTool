from sqlalchemy import Column, String
from .base_model import BaseModel


class BlacklistedToken(BaseModel):
    __tablename__ = "blacklisted_token"

    token = Column(String, unique=True, index=True)
    email = Column(String, index=True)

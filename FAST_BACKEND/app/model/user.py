# # from sqlalchemy import Column, String, Boolean
# # from .base_model import BaseModel
# #
# # class User(BaseModel):
# #     __tablename__ = "user"
# #
# #     email = Column(String, unique=True, index=True)
# #     password = Column(String)
# #     user_token = Column(String, unique=True, index=True)
# #     name = Column(String, default=None, nullable=True)
# #     is_active = Column(Boolean, default=True)
# #     is_superuser = Column(Boolean, default=False)
#
#
# from sqlmodel import Field
#
# from .base_model import BaseModel
#
# from typing import Optional
#
#
# class User(BaseModel, table=True):
#     email: str = Field(unique=True)
#     password: Optional[str] = Field()
#     user_token: str = Field(unique=True)
#
#     name: str = Field(default=None, nullable=True)
#     is_active: bool = Field(default=True)
#     is_superuser: bool = Field(default=False)


from sqlalchemy import Column, String, Boolean
from .base_model import BaseModel


class User(BaseModel):
    __tablename__ = "user"

    email = Column(String, unique=True, index=True)
    password = Column(String)
    user_token = Column(String, unique=True, index=True)
    name = Column(String, default=None, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

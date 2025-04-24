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


from sqlalchemy import Column, String, Boolean,Integer,DateTime, ForeignKey,func
from .base_model import BaseModel
class Role(BaseModel):
    __tablename__ = "roles"


    role_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

# class User(BaseModel):
#     __tablename__ = "user"
#
#     email = Column(String, unique=True, index=True)
#     password = Column(String)
#     user_token = Column(String, unique=True, index=True)
#     name = Column(String, default=None, nullable=True)
#     is_active = Column(Boolean, default=True)
#     is_superuser = Column(Boolean, default=False)
#     role = Column(String, default='user')


class User(BaseModel):
    __tablename__ = "user"


    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    user_token = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False)
    is_superuser = Column(Boolean, nullable=False)
    role = Column(String(255), default='user')
    role_id = Column(Integer, ForeignKey('roles.id'))


class DashboardModule(BaseModel):
    __tablename__ = "dashboard_module"


    modules_name = Column(String(255), nullable=False)


class UserModulesAccess(BaseModel):
    __tablename__ = "user_modules_access"

    # id = Column(Integer, primary_key=True, autoincrement=True)
    module_id = Column(Integer, ForeignKey('dashboard_module.id'))
    user_id = Column(Integer, ForeignKey('user.id'))

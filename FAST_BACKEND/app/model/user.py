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
from sqlalchemy.orm import relationship

from sqlalchemy import Column, String, Boolean,Integer,DateTime, ForeignKey,func
from .base_model import BaseModel


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
class Role(BaseModel):
    __tablename__ = "roles"
    role_name = Column(String(255), nullable=False, unique=True)
    # one-to-many → users
    users = relationship("User", back_populates="role_obj", cascade="all, delete-orphan")

class User(BaseModel):
    __tablename__ = "user"                       # *** singular ***

    email        = Column(String(255), unique=True, nullable=False)
    password     = Column(String(255), nullable=False)
    user_token   = Column(String(255), unique=True, nullable=False)
    name         = Column(String(255))
    is_active    = Column(Boolean, nullable=False, default=True)
    is_superuser = Column(Boolean, nullable=False, default=False)

    role_id      = Column(Integer, ForeignKey("roles.id"))
    role_obj     = relationship("Role", back_populates="users")

    # one-to-many → user_modules_access
    module_accesses = relationship(
        "UserModulesAccess",
        back_populates="user"

    )

class DashboardModule(BaseModel):
    __tablename__ = "dashboard_module"

    modules_name = Column(String(255), nullable=False, unique=True)

    # one-to-many → user_modules_access
    user_accesses = relationship(
        "UserModulesAccess",
        back_populates="module"
    )

class UserModulesAccess(BaseModel):
    __tablename__ = "user_modules_access"

    module_id = Column(Integer, ForeignKey("dashboard_module.id"), nullable=False)
    user_id   = Column(Integer, ForeignKey("user.id"),               nullable=False)  # *** fixed ***

    module = relationship("DashboardModule", back_populates="user_accesses")
    user   = relationship("User",             back_populates="module_accesses")
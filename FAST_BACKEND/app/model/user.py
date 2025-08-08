from sqlalchemy.orm import relationship

from sqlalchemy import Column, String, Boolean,Integer,DateTime, ForeignKey,func
from .base_model import BaseModel


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
    name= Column(String(255))
    username         = Column(String(255))
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
# from app.model.base_model import BaseModel
# from sqlmodel import SQLModel, Field, Relationship
# # from sqlmodel.orm import Relationship
#
# class Site(BaseModel, table=True):
#     # id: int = Field(default=None, primary_key=True)
#     name: str = Field(default=None, nullable=False)
#     status: str = Field(default=None, nullable=True)
#     facility: str = Field(default=None, nullable=True)
#     region: str = Field(default=None, nullable=True)
#     rack = Relationship("Rack", back_populates="site")

from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.model.base_model import BaseModel, Base


class Site(BaseModel, Base):
    __tablename__ = "site"

    name = Column(String, nullable=False)
    status = Column(String, nullable=True)
    facility = Column(String, nullable=True)
    region = Column(String, nullable=True)

    rack = relationship("Rack", back_populates="site")

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
from app.model.base_model import BaseModel


class Site(BaseModel):
    __tablename__ = "site"

    site_name = Column(String, nullable=True)
    site_type = Column(String, nullable=True)
    region = Column(String, nullable=True)
    city = Column(String, nullable=True)
    Location = Column(String, nullable=True)
    status = Column(String, nullable=True)
    total_devices = Column(String, nullable=True)


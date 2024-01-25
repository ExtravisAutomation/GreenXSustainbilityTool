# from app.model.base_model import BaseModel
# from sqlmodel import SQLModel, Field, Relationship
# #from sqlmodel.orm import Relationship
#
# class Rack(BaseModel, table=True):
#     #id: int = Field(default=None, primary_key=True)
#     name: str = Field(default=None, nullable=False)
#     site_id: int = Field(foreign_key="site.id", nullable=False)
#     location: str = Field(default=None, nullable=True)
#     height: str = Field(default=None, nullable=True)
#     devices: str = Field(default=None, nullable=True)
#     space: str = Field(default=None, nullable=True)
#     power: str = Field(default=None, nullable=True)
#     role: str = Field(default=None, nullable=True)
#     site = Relationship("Site", back_populates="rack")
#
#
#     #site: "Site" = Field(default=None, foreign_key=("site.id", "Site.racks"))

from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, func, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.model.base_model import BaseModel, Base


class Rack(BaseModel, Base):
    __tablename__ = "rack"

    Rack_name = Column(String, nullable=True)
    site_id = Column(Integer, nullable=True)
    Manufacture_date = Column(datetime, nullable=True)
    location = Column(String, nullable=True)
    height = Column(String, nullable=True)
    devices = Column(String, nullable=True)
    space = Column(String, nullable=True)
    power = Column(String, nullable=True)
    role = Column(String, nullable=True)

    site = relationship("Site", back_populates="rack")

# from datetime import datetime
# from sqlalchemy import Column, DateTime, Integer, String, func, ForeignKey
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import relationship
# from app.model.base_model import BaseModel, Base
#
#
# class Location(BaseModel, Base):
#     __tablename__ = "location"
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, unique=True, index=True)
#     site_id = Column(Integer, ForeignKey("site.id"))
#     site = relationship("Site", back_populates="location")
#     rack_id = Column(Integer, ForeignKey("rack.id"))
#     rack = relationship("Rack", back_populates="location")
#     devices = Column(String(length=255))
#     space = Column(String(length=255))

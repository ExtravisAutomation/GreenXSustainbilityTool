from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Integer
from app.model.base_model import BaseModel
from typing import List
from sqlalchemy.orm import relationship
import datetime


class Reports(BaseModel):
    __tablename__ = 'Reports'

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_title = Column(String(300), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    report_type = Column(String(200), nullable=True)
    duration =  Column(String(500), nullable=False)
    path= Column(String(300), nullable=False)
    entered_on = Column(DateTime, nullable=True)
    Status = Column(Boolean, nullable=True)  # Assuming tinyint(1) is used as a boolean
    Message = Column(String(500), nullable=True)
    
    # Relationship
    site = relationship("Site", back_populates="reports")

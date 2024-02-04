from sqlalchemy import Column, String
from app.model.base_model import BaseModel
from typing import List


class Site(BaseModel):
    __tablename__ = "site"

    site_name = Column(String(255), nullable=True)
    site_type = Column(String(255), nullable=True)
    region = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    latitude = Column(String(255), nullable=True)
    longitude = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(String(255), nullable=True)




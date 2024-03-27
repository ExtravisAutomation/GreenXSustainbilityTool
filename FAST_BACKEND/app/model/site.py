from sqlalchemy import Column, String
from app.model.base_model import BaseModel
from typing import List
from sqlalchemy.orm import relationship


class Site(BaseModel):
    __tablename__ = "site"

    site_name = Column(String(255), nullable=True)
    site_type = Column(String(255), nullable=True)
    region = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    latitude = Column(String(255), nullable=True) # float
    longitude = Column(String(255), nullable=True) # float
    status = Column(String(255), nullable=True)
    total_devices = Column(String(255), nullable=True) # remove
    racks = relationship("Rack", back_populates="site")
    devices = relationship("APICControllers", back_populates="site")
    #racks = relationship("Rack", order_by="Rack.id", back_populates="site")

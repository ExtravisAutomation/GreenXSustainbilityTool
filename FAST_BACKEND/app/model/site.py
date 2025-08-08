from sqlalchemy import Column, String, Integer
from app.model.base_model import BaseModel
from typing import List
from sqlalchemy.orm import relationship


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
    racks = relationship("Rack", back_populates="site")
    devices = relationship("Devices", back_populates="site")
    #racks = relationship("Rack", order_by="Rack.id", back_populates="site")



class PasswordGroup(BaseModel):
    __tablename__ = "password_groups"
    password_group_name = Column(String, index=True, nullable=True)
    password_group_type = Column(String, index=True, nullable=True)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    devices = relationship("Devices", back_populates="password_group")
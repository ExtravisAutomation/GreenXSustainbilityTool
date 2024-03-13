from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.model.base_model import BaseModel  # Assuming BaseModel includes id and timestamp fields

class Rack(BaseModel):
    __tablename__ = "rack"

    rack_name = Column(String(255), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=False)
    manufacture_date = Column(Date, nullable=True)
    unit_position = Column(Integer, nullable=True)
    rack_model = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    Ru = Column(Integer, nullable=True)
    RFS = Column(String(255), nullable=True)
    Height = Column(Integer, nullable=True)
    Width = Column(Integer, nullable=True)
    Depth = Column(Integer, nullable=True)
    Tag_id = Column(String(255), nullable=True)
    floor = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(Integer, nullable=True)
    site = relationship("Site", back_populates="racks")
    devices = relationship("APICControllers", back_populates="rack")

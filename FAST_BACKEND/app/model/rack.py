from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.model.base_model import BaseModel


class Rack(BaseModel):
    __tablename__ = "rack"

    rack_name = Column(String(255), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullabe=False)
    manufacture_date = Column(Date, nullable=True)
    unit_position = Column(Integer, nullable=True)  # change to string
    rack_model = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)  # remove
    serial_number = Column(String(255), nullable=True)
    Ru = Column(Integer, nullable=True)  # change to no of ru
    RFS = Column(String(255), nullable=True)  # remove
    Height = Column(Integer, nullable=True)  # change to float
    Width = Column(Integer, nullable=True)  # change to float
    Depth = Column(Integer, nullable=True)  # change to float
    Tag_id = Column(String(255), nullable=True)
    floor = Column(Integer, nullable=True)  # string
    status = Column(String(255), nullable=True)
    total_devices = Column(Integer, nullable=True)  # remove
    site = relationship("Site", back_populates="racks")
    devices = relationship("APICControllers", back_populates="rack")

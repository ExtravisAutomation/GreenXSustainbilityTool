from sqlalchemy import Column, String, Integer, Date, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.model.base_model import BaseModel  # Assuming BaseModel includes id and timestamp fields

from app.model.base_model import Base


rack_building_association = Table(
    'rack_building',
    Base.metadata,
    Column('rack_id', Integer, ForeignKey('rack.id'), primary_key=True),
    Column('building_id', Integer, ForeignKey('building.id'), primary_key=True)
)



class Rack(BaseModel):
    __tablename__ = "rack"

    rack_name = Column(String(255), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=False)
    manufacture_date = Column(Date, nullable=True)
    #unit_position = Column(Integer, nullable=True)
    rack_model = Column(String(255), nullable=True)
    #pn_code = Column(String(255), nullable=True)
    #serial_number = Column(String(255), nullable=True)
    #Ru = Column(Integer, nullable=True)
    RFS = Column(String(255), nullable=True)
    Height = Column(Integer, nullable=True)
    Width = Column(Integer, nullable=True)
    Depth = Column(Integer, nullable=True)
    #Tag_id = Column(String(255), nullable=True)
    #floor = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)
    #total_devices = Column(Integer, nullable=True)
    site = relationship("Site", back_populates="racks")
    devices = relationship("Devices", back_populates="rack")
    buildings = relationship("Building", secondary=rack_building_association, back_populates="racks")



class Building(BaseModel):
    __tablename__ = 'building'
    building_name = Column(String(255), nullable=False)
    racks = relationship("Rack", secondary=rack_building_association, back_populates="buildings")


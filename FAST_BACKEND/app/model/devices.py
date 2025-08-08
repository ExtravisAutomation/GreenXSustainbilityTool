from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class Devices(BaseModel):
    __tablename__ = "devices"

    ip_address = Column(String(255), unique=False, index=True)
    device_name = Column(String(200), nullable=True)
    device_nature = Column(String(200), nullable=True)
    OnBoardingStatus = Column(Boolean, nullable=True, default=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    rack_unit = Column(Integer, nullable=True)
    credential_id = Column(Integer, nullable=True)
    password_group_id = Column(Integer, ForeignKey('password_groups.id'), nullable=True)
    node_id = Column(Integer, nullable=True)
    messages = Column(String(1000), nullable=True)
    collection_status=Column(Boolean, nullable=True, default=True)
    rack = relationship("Rack", back_populates="devices")
    site = relationship("Site", back_populates="devices")
    device_type_id = Column(Integer, ForeignKey('device_type.id'), nullable=True)  # Added device_type_id
    vendor_id = Column(Integer, ForeignKey('vendor.id'), nullable=True)

    password_group = relationship("PasswordGroup", back_populates="devices")
    vendor = relationship("Vendor", back_populates="devices")
    device_type_rel = relationship("DeviceType", back_populates="devices")
    # Relationship with DeviceType
class Vendor(BaseModel):
    __tablename__ = "vendor"
    vendor_name = Column(String(200), nullable=True)
    devices = relationship("Devices", back_populates="vendor")
    devices1 = relationship("DeviceType", back_populates="vendor")


class DeviceType(BaseModel):
    __tablename__ = "device_type"

    device_type = Column(String(255), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendor.id"), nullable=False)
    vendor = relationship("Vendor", back_populates="devices1")
    devices = relationship("Devices", back_populates="device_type_rel")

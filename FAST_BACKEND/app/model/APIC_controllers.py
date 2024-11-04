from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel
from .device_credentials import DeviceCredential  # Importing the DeviceCredential class


class APICControllers(BaseModel):
    __tablename__ = "Devices"

    id = Column(Integer, primary_key=True)
    ip_address = Column(String(255), unique=False, index=True)
    device_type = Column(String(200), nullable=True)
    device_name = Column(String(200), nullable=True)
    OnBoardingStatus = Column(Boolean, nullable=True, default=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    rack_unit = Column(Integer, nullable=True)
    credential_id = Column(Integer, nullable=True)
    password_group_id = Column(Integer, ForeignKey('password_groups.id'), nullable=True)
    node_id = Column(Integer, nullable=True)
    # messages = Column(String(1000), nullable=True)
    rack = relationship("Rack", back_populates="devices")
    site = relationship("Site", back_populates="devices")
    password_group = relationship("PasswordGroup", back_populates="devices")
    #deviceInventory = relationship("DeviceInventory", back_populates="apic_controller")

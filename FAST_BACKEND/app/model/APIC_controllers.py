from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel
from .device_credentials import DeviceCredential  # Importing the DeviceCredential class


class APICControllers(BaseModel):
    __tablename__ = "Devices"

    ip_address = Column(String(255), unique=False, index=True)
    device_type = Column(String(200), nullable=True)
    device_name = Column(String(200), nullable=True)
    OnBoardingStatus = Column(Boolean, nullable=True, default=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    credential_id = Column(Integer, ForeignKey('Device_Credential.id'), unique=True, nullable=True)
    password_group_id = Column(Integer, ForeignKey('password_groups.id'), nullable=True)

    # Correcting the relationship definition for credentials
    #credential = relationship("DeviceCredential", back_populates="device", uselist=False)
    #credential = relationship("DeviceCredential", back_populates="device", foreign_keys=[credential_id], uselist=False)

    rack = relationship("Rack", back_populates="devices")
    site = relationship("Site", back_populates="devices")
    #inventories = relationship("DeviceInventories", back_populates="device")

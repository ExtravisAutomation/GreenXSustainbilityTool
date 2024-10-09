from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class CSPCDevices(BaseModel):
    __tablename__ = "cspc_devices"

    vendor = Column(String(500), nullable=True)
    device_family = Column(String(500), nullable=True)
    model_name = Column(String(500), nullable=True)
    device_name = Column(String(500), nullable=True)
    device_type = Column(String(100), nullable=True)
    software_version = Column(String(100), nullable=True)

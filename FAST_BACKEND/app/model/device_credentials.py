from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class DeviceCredential(BaseModel):
    __tablename__ = 'Device_Credential'

    username = Column(String(100), nullable=True)
    password = Column(String(100), nullable=True)

    Device_id = Column(Integer, ForeignKey('Devices.id'), nullable=False)

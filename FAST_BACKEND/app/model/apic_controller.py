from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class APICController(BaseModel):
    __tablename__ = "apic_controllers"

    ip_address = Column(String(255), unique=False, index=True)
    fabric_nodes = relationship("FabricNode", back_populates="apic_controller")
    deviceInventory = relationship("DeviceInventory", back_populates="apic_controller")

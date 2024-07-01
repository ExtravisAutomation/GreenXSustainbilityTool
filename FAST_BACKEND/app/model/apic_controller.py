from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base_model import BaseModel


# class APICController(BaseModel):
#     __tablename__ = "apic_controllers"
#
#     ip_address = Column(String(255), unique=False, index=True)
#     fabric_nodes = relationship("FabricNode", back_populates="apic_controller")
#     deviceInventory = relationship("DeviceInventory", back_populates="apic_controller")

class APICController(Base):
    __tablename__ = 'apic_controllers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    ip_address = Column(String(255), nullable=False)
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer
from sqlalchemy.orm import relationship
from .base_model import BaseModel  # Ensure this import points to your BaseModel


class FabricNode(BaseModel):
    __tablename__ = "fabric_nodes"

    name = Column(String(600), nullable=True)
    role = Column(String(255), nullable=True)
    adStatus = Column(String(500), nullable=True)
    address = Column(String(500), nullable=True)
    model = Column(String(500), nullable=True)
    serial = Column(String(500), nullable=True)
    version = Column(String(500), nullable=True)
    pod = Column(Integer, nullable=True)
    node = Column(Integer, nullable=True)
    mod_ts = Column(DateTime, nullable=True)
    status = Column(String(255), nullable=True)
    vendor = Column(String(255), nullable=True)
    last_state_mod_ts = Column(DateTime, nullable=True)
    delayed_heartbeat = Column(String(255), nullable=True)
    fabric_status = Column(String(255), nullable=True)
    apic_controller_id = Column(Integer, ForeignKey('apic_controllers.id'))
    apic_controller = relationship("APICController", back_populates="fabric_nodes")

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from .base_model import BaseModel

class Device(BaseModel):
    __tablename__ = "devices"

    ipAddress = Column(String)
    hostname = Column(String)
    on_board_status = Column(Boolean)
    sw_Type = Column(String)
    Ru_Device = Column(String)
    criticality = Column(String)
    Virtual = Column(Boolean)
    device_type = Column(String)
    cisco_Domain = Column(String)
    Authentication = Column(String)
    vendor = Column(String)
    Operation_Status = Column(Boolean)
    Asset_Tag_Id = Column(Integer)
    #Rack_id = Column(Integer, ForeignKey("racks.id"), nullable=False, index=True)
    #site_id = Column(Integer, ForeignKey("sites.id"), nullable=False, index=True)

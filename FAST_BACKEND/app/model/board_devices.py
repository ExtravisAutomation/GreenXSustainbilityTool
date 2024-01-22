from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from .base_model import BaseModel

class BoardDevice(BaseModel):
    __tablename__ = "board_devices"

    id = Column(Integer, primary_key=True, index=True)
    board_name = Column(String)
    HW_EOS = Column(String)
    HW_EOL = Column(String)
    SW_EOS = Column(String)
    SW_EOL = Column(String)
    serial_no = Column(Integer)
    pn_number = Column(String)
    software_version = Column(String)
    hardware_version = Column(String)
    dismantle_date = Column(String)
    status = Column(Boolean)
    source = Column(String)
    #device_id = Column(Integer, ForeignKey("devices.id"), nullable=False, index=True)

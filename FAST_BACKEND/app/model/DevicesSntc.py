from sqlalchemy import Column, Integer, String, Date, TIMESTAMP
from .base_model import BaseModel

class DevicesSntc(BaseModel):
    __tablename__ = 'devices_sntc'
    model_name = Column(String(255))
    hw_eol_ad = Column(Date)
    hw_eos = Column(Date)
    sw_EoSWM = Column(Date)
    hw_EoRFA = Column(Date)
    sw_EoVSS = Column(Date)
    hw_EoSCR = Column(Date)
    hw_ldos = Column(Date)

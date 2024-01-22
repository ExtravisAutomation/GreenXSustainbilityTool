from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from datetime import datetime
from .base_model import BaseModel


class CommunicationRoom(BaseModel):
    __tablename__ = "communication_room"

    building = Column(String)
    cr_level = Column(String)
    cr_type = Column(String)
    cr_number = Column(Integer)
    adac_cr_number = Column(String)
    sals = Column(String)
    ad_pair = Column(String)
    remark = Column(String)
    entered_on = Column(DateTime(timezone=True), default=func.now())
    #site_id = Column(Integer, ForeignKey("sites.site_id"), nullable=False, index=True)

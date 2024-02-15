from typing import Optional

from pydantic import BaseModel


class DataTrafficNode(BaseModel):
    controller: str
    node: str
    bytesRateAvg: float

    class Config:
        orm_mode = True


class DataTrafficResponse(BaseModel):
    controller: str
    highest_node: Optional[str]
    bytesRateAvg: Optional[float]
    device_name: Optional[str]

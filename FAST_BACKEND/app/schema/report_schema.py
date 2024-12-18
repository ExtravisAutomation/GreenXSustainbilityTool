from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel


class ReportsBase(BaseModel):
    report_title: str
    ReportType: List[str] = []  
    site_id: int

class ReportCreate(ReportsBase):
    Duration: List[str] = []  


from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel


class ReportsBase(BaseModel):
    report_title: str
    ReportType: List[str] = []  # Updated to accept a list of strings
    site_id: int

class ReportCreate(ReportsBase):
    Duration: List[str] = []  # New field to handle duration


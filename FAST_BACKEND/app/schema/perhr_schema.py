from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel


class ApicControllerInput(BaseModel):
    apic_controller_ip: str

from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel


class hostnameInput(BaseModel):
    hostname: str

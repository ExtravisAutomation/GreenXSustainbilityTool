import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from random import random
from typing import Dict, List, Any, Optional
import pandas as pd
from fastapi import HTTPException, status
import traceback

from app.repository.perhr_repository import PerhrRepository
from app.schema.perhr_schema import ApicControllerInput
from app.schema.report_schema import ReportCreate
from app.schema.vcenter_schema import hostnameInput

class PerhrService:
    def __init__(self, perhr_repository: PerhrRepository):
        self.perhr_repository = perhr_repository
        
        pass
    
    
    def device_power_perhr(self, apic_ip_data: ApicControllerInput):
        device_power = self.perhr_repository.device_power_perhr(apic_ip_data)
        return device_power
    
    
    def device_traffic_perhr(self, apic_ip_data: ApicControllerInput):
        device_traffic = self.perhr_repository.device_traffic_perhr(apic_ip_data)
        return device_traffic
    
    
    
import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from random import random
from typing import Dict, List, Any, Optional
import pandas as pd
from fastapi import HTTPException, status
import traceback

from app.repository.vcenter_repository import VcenterRepository
from app.schema.report_schema import ReportCreate
from app.schema.vcenter_schema import hostnameInput

class VcenterService:
    def __init__(self, vcenter_repository: VcenterRepository):
        self.vcenter_repository = vcenter_repository
        # super().__init__(site_repository)
        pass
    
        
    def get_host_details(self):
        return self.vcenter_repository.get_host_details()
    
    
    def get_all_vms(self):
        return self.vcenter_repository.get_all_vms()
    
    
    def get_hourly_storage(self, hostname_data: hostnameInput):
        return self.vcenter_repository.get_hourly_storage(hostname_data)
    
    
    def get_usages(self, hostname_data: hostnameInput):
        return self.vcenter_repository.get_usages(hostname_data)
    
    
    def get_vms_details(self, hostname_data: hostnameInput):
        return self.vcenter_repository.get_vms_details(hostname_data)
    
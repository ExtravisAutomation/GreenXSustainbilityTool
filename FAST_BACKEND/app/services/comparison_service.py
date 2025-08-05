import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
from random import random
from typing import Dict, List, Any, Optional

from starlette.responses import JSONResponse
import pandas as pd
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.comparison_repository import ComparisonRepository

from app.schema.admin_schema import RoleDetails,DashboardModuleDetails,UserUpdate

from app.repository.dataquery_repository import DataQueryRepository
from app.repository.site_repository import SiteRepository
from app.schema.ai_schema import *
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    filename="admin.log",
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class ComparisonService:
    def __init__(self, comparison_repository: ComparisonRepository,
                 dataquery_repository: DataQueryRepository,
                 site_repository:SiteRepository):
        self.comparison_repository = comparison_repository
        self.dataquery_repository = dataquery_repository
        self.site_repository=site_repository

    def get_comparison_response(self, filterdata):

        # Validate site_id and fetch device IPs
        if not filterdata.site_id:
            return {"error": "Site ID is required."}

        devices = self.site_repository.get_devices_by_site_id(filterdata.site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]
        print(device_ips)

        if not device_ips:
            return {"message": f"No devices found for site during {filterdata.duration}"}

        if filterdata.duration:
            # Fetch metrics
            metrics = self.dataquery_repository.get_cumulative_power_traffic_data(
                device_ips, filterdata.duration
            )
            data=self.comparison_repository.get_comparison_response(metrics,filterdata)
            print(data)
            return data
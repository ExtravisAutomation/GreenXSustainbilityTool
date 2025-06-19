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
from app.repository.admin_repository import AdminPanelRepository

from app.schema.admin_schema import RoleDetails,RoleCreate

from app.repository.influxdb_repository import InfluxDBRepository

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

class AdminPanelService:
    def __init__(self, admin_repository: AdminPanelRepository, influxdb_repository: InfluxDBRepository):
        self.admin_repository = admin_repository
        self.influxdb_repository = influxdb_repository
    def add_role(self, role_data) -> RoleDetails:
        site = self.admin_repository.add_role(role_data)
        return RoleDetails(**site.__dict__)



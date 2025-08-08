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

from app.schema.admin_schema import RoleDetails,DashboardModuleDetails,UserUpdate

from app.repository.influxdb_repository import InfluxDBRepository


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

    def add_user_access(self, user_data) :
         return   self.admin_repository.add_user_access(user_data)

    def update_user_access(self, user_data) :
        return self.admin_repository.update_user_access(user_data)
    def delete_user_access(self, user_id: int) -> str:
        self.admin_repository.delete_user_access(user_id)
        return {"message": " User deleted successfully"}
    def update_role(self,id:int,update_data):
        return self.admin_repository.update_role(id, update_data)

    def get_role(self):
        return self.admin_repository.get_role()
    def get_all_users_with_modules(self):
        return self.admin_repository.get_all_users_with_modules()

    def delete_role(self, role_id: int) -> str:
        self.admin_repository.delete_role(role_id)
        return {"message": " Role deleted successfully"}

    def add_module(self, module_data) -> DashboardModuleDetails:
        site = self.admin_repository.add_module(module_data)
        return DashboardModuleDetails(**site.__dict__)

    def update_module(self, id: int, update_data):
        return self.admin_repository.update_module(id, update_data)

    def get_module(self):
        return self.admin_repository.get_module()

    def delete_module(self, module_id: int) -> str:
        self.admin_repository.delete_module(module_id)
        return {"message": " Module deleted successfully"}

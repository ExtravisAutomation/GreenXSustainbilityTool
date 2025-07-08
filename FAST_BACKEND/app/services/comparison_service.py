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
    def __init__(self, comparison_repository: ComparisonRepository, DataQueryRepository: DataQueryRepository):
        self.comparison_repository = comparison_repository
        self.DataQueryRepository = DataQueryRepository

    def delete_module(self, module_id: int) -> str:
        self.comparison_repository.delete_module(module_id)
        return {"message": " Module deleted successfully"}
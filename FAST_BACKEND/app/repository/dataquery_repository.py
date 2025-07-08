import math
import multiprocessing
import random
import calendar
import sys
import traceback
from calendar import calendar
from functools import partial
from http.client import HTTPException

import numpy as np
from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable, List, Union, Tuple, Any

from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from app.core.config import configs
from datetime import datetime, timedelta, timezone
import pandas as pd
import asyncio
from prophet import Prophet

class DataQueryRepository:
    def __init__(self, client: InfluxDBClient, bucket: str, org: str, token: str = None):
        self.client = client
        self.bucket = bucket
        self.org = org
        self.token = token
        self.query_api1 = self.client.query_api()

    # def get_energy_efficiency_metrics_with_filter(self, device_ips: List[str], start_date: datetime,
    #                                               end_date: datetime, duration_str: str) -> List[dict]:

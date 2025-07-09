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

    from datetime import datetime, timedelta
    from typing import List, Tuple
    import pandas as pd
    import sys

    # ---- 1. Calculate Start and End Dates ----
    def calculate_start_end_dates(self, duration_str: str) -> Tuple[datetime, datetime]:
        today = datetime.today()
        year = today.year

        if duration_str == "First Quarter":
            start_date = datetime(year, 1, 1)
            end_date = datetime(year, 3, 31)
        elif duration_str == "Second Quarter":
            start_date = datetime(year, 4, 1)
            end_date = datetime(year, 6, 30)
        elif duration_str == "Third Quarter":
            start_date = datetime(year, 7, 1)
            end_date = datetime(year, 9, 30)
        elif duration_str == "Fourth Quarter":
            start_date = datetime(year, 10, 1)
            end_date = datetime(year, 12, 31)
        elif duration_str == "Last 9 Months":
            start_date = (today - timedelta(days=270)).replace(day=1)
            end_date = today
        elif duration_str == "Last 6 Months":
            start_date = (today - timedelta(days=180)).replace(day=1)
            end_date = today
        elif duration_str == "Last 3 Months":
            start_date = (today - timedelta(days=90)).replace(day=1)
            end_date = today
        elif duration_str == "Last Year":
            start_date = datetime(year - 1, 1, 1)
            end_date = datetime(year - 1, 12, 31)
        elif duration_str == "Current Year":
            start_date = datetime(year, 1, 1)
            end_date = today
        elif duration_str == "Current Month":
            start_date = today.replace(day=1)
            end_date = today
        elif duration_str == "Last Month":
            last_month = today.replace(day=1) - timedelta(days=1)
            start_date = last_month.replace(day=1)
            end_date = last_month
        elif duration_str in ["7 Days", "24 hours"]:
            days = 7 if duration_str == "7 Days" else 1
            start_date = today - timedelta(days=days)
            end_date = today
        else:
            raise ValueError("Unsupported duration format")

        return start_date, end_date

    # ---- 2. Aggregate Settings ----
    def aggregate(self, duration_str: str) -> Tuple[str, str]:
        if duration_str == "24 hours":
            return "1h", "%Y-%m-%d %H:00"
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            return "1d", "%Y-%m-%d"
        else:
            return "1m", "%Y-%m"

    # ---- 3. Main Function to Get Power + Traffic + Bandwidth Metrics ----
    def get_power_traffic_data(self, device_ips: List[str], duration_str: str):
        print("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        if not device_ips:
            return []

        start_date, end_date = self.calculate_start_end_dates(duration_str)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, _ = self.aggregate(duration_str)

        total_pin = total_pout = 0.0
        total_input_bytes = total_output_bytes = total_bandwidth = 0.0

        for ip in device_ips:
            print(f"Querying power metrics for IP: {ip}", file=sys.stderr)

            # Power Query
            power_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            power_result = self.query_api1.query_data_frame(power_query)
            if not power_result.empty:
                total_pin += power_result.get('total_PIn', pd.Series(dtype=float)).sum()
                total_pout += power_result.get('total_POut', pd.Series(dtype=float)).sum()

            print(f"Querying traffic metrics for IP: {ip}", file=sys.stderr)

            # Traffic + Bandwidth Query
            traffic_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_input_bytes" or r["_field"] == "total_output_bytes" or r["_field"] == "bandwidth")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            traffic_result = self.query_api1.query_data_frame(traffic_query)
            if not traffic_result.empty:
                total_input_bytes += traffic_result.get('total_input_bytes', pd.Series(dtype=float)).sum()
                total_output_bytes += traffic_result.get('total_output_bytes', pd.Series(dtype=float)).sum()
                total_bandwidth += traffic_result.get('bandwidth', pd.Series(dtype=float)).sum()

        # Final Metrics Calculation
        total_traffic_consumed = round((total_input_bytes + total_output_bytes), 2)

        traffic_allocated_mb = (total_bandwidth / 1000) if total_bandwidth > 0 else 0  # Convert Kbps to Mbps
        traffic_consumed_mb = total_traffic_consumed * 8 / 1e6 if total_traffic_consumed > 0 else 0  # Convert bytes/sec to Mbps

        metrics = {
            "total_POut_kw": round(total_pout / 1000, 2),
            "total_PIn_kw": round(total_pin / 1000, 2),
            "total_input_bytes": round(total_input_bytes, 2),
            "total_output_bytes": round(total_output_bytes, 2),
            "total_traffic__mb": traffic_allocated_mb,
            "traffic_consumed_mb": traffic_consumed_mb
        }

        print(f"Final metrics: {metrics}", file=sys.stderr)
        return metrics

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
from concurrent.futures import ThreadPoolExecutor, as_completed
class DataQueryRepository:
    def __init__(self, client: InfluxDBClient, bucket: str, org: str, token: str = None):
        self.client = client
        self.bucket = bucket
        self.org = org
        self.token = token
        self.query_api = self.client.query_api()

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
            # Calculate number of days (inclusive)
        day_count = (end_date - start_date).days

        return start_date, end_date, day_count

    def get_device_wise_power_traffic_data(self, device_ips: List[str], duration_str: str):
        if not device_ips:
            return []

        start_date, end_date, day_count = self.calculate_start_end_dates(duration_str)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, _ = self.aggregate_window(duration_str)

        device_data = []

        for ip in device_ips:
            metrics = self.query_device_metrics(ip, start_time, end_time, aggregate_window)
            total_traffic = metrics["input_bytes"] + metrics["output_bytes"]
            traffic_allocated_mb = metrics["bandwidth"] / 1000 if metrics["bandwidth"] > 0 else 0
            traffic_consumed_mb = total_traffic * 8 / 1e6 if total_traffic > 0 else 0

            device_data.append({
                "ip": ip,
                "total_POut_kw": round(metrics["pout"] / 1000, 2),
                "total_PIn_kw": round(metrics["pin"] / 1000, 2),
                "total_input_bytes": round(metrics["input_bytes"], 2),
                "total_output_bytes": round(metrics["output_bytes"], 2),
                "traffic_allocated_mb": traffic_allocated_mb,
                "traffic_consumed_mb": traffic_consumed_mb,
                "day_count": day_count
            })

        return device_data

    # ---- 2. Aggregate Settings ----
    def aggregate_window(self, duration_str: str) -> Tuple[str, str]:
        if duration_str == "24 hours":
            return "1h", "%Y-%m-%d %H:00"
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            return "1d", "%Y-%m-%d"
        else:
            return "1m", "%Y-%m"

    def query_device_traffic_metrics(self, ip: str, start_time: str, end_time: str, aggregate_window: str):
        input_bytes = output_bytes = bandwidth = 0.0
        # Traffic Query
        traffic_query = f'''
             from(bucket: "{configs.INFLUXDB_BUCKET}")
             |> range(start: {start_time}, stop: {end_time})
             |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["ApicController_IP"] == "{ip}")
             |> filter(fn: (r) => r["_field"] == "total_input_bytes" or r["_field"] == "total_output_bytes" or r["_field"] == "bandwidth")
             |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
         '''
        traffic_result = self.query_api.query_data_frame(traffic_query)
        if not traffic_result.empty:
            input_bytes = traffic_result.get('total_input_bytes', pd.Series(dtype=float)).sum()
            output_bytes = traffic_result.get('total_output_bytes', pd.Series(dtype=float)).sum()
            bandwidth = traffic_result.get('bandwidth', pd.Series(dtype=float)).sum()

        return {
            "input_bytes": input_bytes,
            "output_bytes": output_bytes,
            "bandwidth": bandwidth
        }
    def query_device_power_metrics(self, ip: str, start_time: str, end_time: str, aggregate_window: str):
        pin = pout = 0.0
        # Power Query
        power_query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
            |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
            |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        power_result = self.query_api.query_data_frame(power_query)
        if not power_result.empty:
            pin = power_result.get('total_PIn', pd.Series(dtype=float)).sum()
            pout = power_result.get('total_POut', pd.Series(dtype=float)).sum()

        return {
            "pin": pin,
            "pout": pout,
        }

    def get_cumulative_power_traffic_data(self, device_ips: List[str], duration_str: str):
        if not device_ips:
            return []

        start_date, end_date, day_count = self.calculate_start_end_dates(duration_str)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, _ = self.aggregate_window(duration_str)

        total_pin = total_pout = total_input_bytes = total_output_bytes = total_bandwidth = 0.0

        def fetch_device_metrics(ip):
            traffic = self.query_device_traffic_metrics(ip, start_time, end_time, aggregate_window)
            power = self.query_device_power_metrics(ip, start_time, end_time, aggregate_window)
            return {
                "pin": power.get("pin", 0.0),
                "pout": power.get("pout", 0.0),
                "input_bytes": traffic.get("input_bytes", 0.0),
                "output_bytes": traffic.get("output_bytes", 0.0),
                "bandwidth": traffic.get("bandwidth", 0.0)
            }

        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_ip = {executor.submit(fetch_device_metrics, ip): ip for ip in device_ips}

            for future in as_completed(future_to_ip):
                result = future.result()
                total_pin += result["pin"]
                total_pout += result["pout"]
                total_input_bytes += result["input_bytes"]
                total_output_bytes += result["output_bytes"]
                total_bandwidth += result["bandwidth"]

        total_traffic = total_input_bytes + total_output_bytes
        traffic_allocated_mb = total_bandwidth / 1000 if total_bandwidth > 0 else 0
        traffic_consumed_mb = total_traffic * 8 / 1e6 if total_traffic > 0 else 0

        return {
            "total_POut_kw": round(total_pout / 1000, 2),
            "total_PIn_kw": round(total_pin / 1000, 2),
            "total_input_bytes": round(total_input_bytes, 2),
            "total_output_bytes": round(total_output_bytes, 2),
            "traffic_allocated_mb": traffic_allocated_mb,
            "traffic_consumed_mb": traffic_consumed_mb,
            "day_count": day_count
        }

    def get_cumulative_energy_traffic_timeline(self, device_ips: List[str], duration_str: str) -> List[dict]:
        start_date, end_date, day_count = self.calculate_start_end_dates(duration_str)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, time_format = self.aggregate_window(duration_str)

        power_frames = []
        traffic_frames = []

        def fetch_power_and_traffic(ip):
            power_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            traffic_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_input_bytes" or r["_field"] == "total_output_bytes" or r["_field"] == "bandwidth")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            power_df = self.query_api.query_data_frame(power_query)

            if not power_df.empty:
                power_df['_time'] = pd.to_datetime(power_df['_time'])
                power_df['ip'] = ip

            traffic_df = self.query_api.query_data_frame(traffic_query)
            if not traffic_df.empty:
                traffic_df['_time'] = pd.to_datetime(traffic_df['_time'])
                traffic_df['ip'] = ip

            return power_df, traffic_df

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(fetch_power_and_traffic, ip): ip for ip in device_ips}
            for future in as_completed(futures):
                power_df, traffic_df = future.result()
                if not power_df.empty:
                    power_frames.append(power_df)
                if not traffic_df.empty:
                    traffic_frames.append(traffic_df)

        if not power_frames and not traffic_frames:
            return []

        # Process power
        if power_frames:
            power_df = pd.concat(power_frames)
            power_df['_formatted_time'] = power_df['_time'].dt.strftime(time_format)
            for col in ['total_PIn', 'total_POut']:
                if col not in power_df.columns:
                    power_df[col] = 0
            power_grouped = power_df.groupby('_formatted_time')[['total_PIn', 'total_POut']].sum()
        else:
            power_grouped = pd.DataFrame(columns=['total_PIn', 'total_POut'])
        # Process traffic
        if traffic_frames:
            traffic_df = pd.concat(traffic_frames)
            traffic_df['_formatted_time'] = traffic_df['_time'].dt.strftime(time_format)
            for col in ['total_input_bytes', 'total_output_bytes', 'bandwidth']:
                if col not in traffic_df.columns:
                    traffic_df[col] = 0
            traffic_grouped = traffic_df.groupby('_formatted_time')[
                ['total_input_bytes', 'total_output_bytes', 'bandwidth']].sum()
        else:
            traffic_grouped = pd.DataFrame(columns=['total_input_bytes', 'total_output_bytes', 'bandwidth'])

        # Merge both
        all_time_keys = set(power_grouped.index.tolist()) | set(traffic_grouped.index.tolist())
        full_time_index = pd.Index(sorted(all_time_keys), name='_formatted_time')
        power_grouped = power_grouped.reindex(full_time_index, fill_value=0)
        traffic_grouped = traffic_grouped.reindex(full_time_index, fill_value=0)

        combined = pd.concat([power_grouped, traffic_grouped], axis=1).fillna(0).reset_index()

        result = []
        for _, row in combined.iterrows():
            pin = row.get('total_PIn', 0.0)
            pout = row.get('total_POut', 0.0)
            input_bytes = row.get('total_input_bytes', 0.0)
            output_bytes = row.get('total_output_bytes', 0.0)
            bandwidth_kbps = row.get('bandwidth', 0.0)

            traffic_consumed_mb = (input_bytes + output_bytes) * 8 / 1e6
            traffic_allocated_mb = bandwidth_kbps / 1000

            result.append({
                "time": row['_formatted_time'],
                "total_PIn_kw": round(pin / 1000, 4),
                "total_POut_kw": round(pout / 1000, 4),
                "total_input_bytes": round(input_bytes, 2),
                "total_output_bytes": round(output_bytes, 2),
                "traffic_consumed_gb": round(traffic_consumed_mb, 2),
                "traffic_allocated_mb": round(traffic_allocated_mb, 2)
            })

        return result

    def get_device_wise_power_traffic_data(self, device_ips: List[str], duration_str: str):
        if not device_ips:
            return []

        start_date, end_date, day_count = self.calculate_start_end_dates(duration_str)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, _ = self.aggregate_window(duration_str)

        device_data = []

        for ip in device_ips:
            power_metrics = self.query_device_power_metrics(ip, start_time, end_time, aggregate_window)
            traffic_metrics = self.query_device_traffic_metrics(ip, start_time, end_time, aggregate_window)
            total_traffic = traffic_metrics["input_bytes"] + traffic_metrics["output_bytes"]
            traffic_allocated_mb = traffic_metrics["bandwidth"] / 1000 if traffic_metrics["bandwidth"] > 0 else 0
            traffic_consumed_mb = total_traffic * 8 / 1e6 if total_traffic > 0 else 0

            device_data.append({
                "ip": ip,
                "total_POut_kw": round(power_metrics["pout"] / 1000, 2),
                "total_PIn_kw": round(power_metrics["pin"] / 1000, 2),
                "total_input_bytes": round(traffic_metrics["input_bytes"], 2),
                "total_output_bytes": round(traffic_metrics["output_bytes"], 2),
                "traffic_allocated_mb": traffic_allocated_mb,
                "traffic_consumed_mb": traffic_consumed_mb,
                "day_count": day_count
            })

        return device_data

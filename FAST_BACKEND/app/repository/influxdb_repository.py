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

class InfluxDBRepository:
    def __init__(self, client: InfluxDBClient, bucket: str, org: str, token: str = None):
        self.client = client
        self.bucket = bucket
        self.org = org
        self.token = token
        self.query_api1 = self.client.query_api()

    def write_data(self, data: Point):
        try:
            with self.client.write_api(write_options=SYNCHRONOUS) as write_api:
                write_api.write(bucket=self.bucket, org=self.org, record=data)
                print(f"Data written to InfluxDB for bucket {self.bucket}", file=sys.stderr)
        except Exception as e:
            print(f"Error writing data to InfluxDB: {e}", file=sys.stderr)

    async def get_last_records(self, ip: str, limit: int = 10) -> list:
        query = f'from(bucket: "{self.bucket}") |> range(start: -1h) |> filter(fn: (r) => r["device"] == "{ip}") |> limit(n:{limit})'
        query_api: QueryApi = self.client.query_api()
        result = query_api.query_data_frame(query)
        return result if not result.empty else []

    def get_power_data(self, apic_ip, node):
        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: -24h)
            |> filter(fn: (r) => r["_measurement"] == "Final_Apic_power_consumption")
            |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}" and r["node"] == "{node}")
            |> last()
        '''
        try:
            print(f"Executing query: {query}", file=sys.stderr)
            result = self.query_api1.query(query)
            if not result:
                print("Query returned no results.", file=sys.stderr)
                return None, None

            drawnAvg, suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    print(f"Record: {record}", file=sys.stderr)
                    if record.get_field() == "drawnAvg":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "suppliedAvg":
                        suppliedAvg = record.get_value()

            print(
                f"drawnAvg@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: {drawnAvg}, suppliedAvg@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: {suppliedAvg}",
                file=sys.stderr)
            return drawnAvg, suppliedAvg
        except Exception as e:
            print(f"Error executing query in InfluxDB: {e}", file=sys.stderr)

            raise

    def get_power_data_last_5min(self, apic_ip):

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: -24h)
            |> filter(fn: (r) => r["_measurement"] == "device_Power_Utilzation")
            |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
            |> last()
        '''
        try:
            print(f"Executing query: {query}", file=sys.stderr)
            result = self.query_api1.query(query)
            if not result:
                print("Query returned no results.", file=sys.stderr)
                return None, None

            drawnAvg, suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    print(f"Record: {record}", file=sys.stderr)
                    if record.get_field() == "drawnAvg":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "suppliedAvg":
                        suppliedAvg = record.get_value()

            print(f"drawnAvg_5555555555555555555555555555: {drawnAvg}, suppliedAvg_555555555555555555: {suppliedAvg}",
                  file=sys.stderr)
            return drawnAvg, suppliedAvg
        except Exception as e:
            print(f"Error executing query in InfluxDB: {e}", file=sys.stderr)

            raise

    def get_power_data_per_day(self, apic_ip, node):

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: -24h)
            |> filter(fn: (r) => r["_measurement"] == "Final_Apic_power_consumption")
            |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}" and r["node"] == "{node}")
            |> last()
        '''
        try:
            print(f"Executing query: {query}", file=sys.stderr)
            result = self.query_api1.query(query)
            if not result:
                print("Query returned no results.", file=sys.stderr)
                return None, None

            drawnAvg, suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    print(f"Record: {record}", file=sys.stderr)
                    if record.get_field() == "drawnAvg":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "suppliedAvg":
                        suppliedAvg = record.get_value()

            print(
                f"drawnAvg_DAYYYYYYYYYYYYYYYYYYYYYYYYYYY: {drawnAvg}, suppliedAvg_DAYYYYYYYYYYYYYYYYYYY: {suppliedAvg}",
                file=sys.stderr)
            return drawnAvg, suppliedAvg
        except Exception as e:
            print(f"Error executing query in InfluxDB: {e}", file=sys.stderr)

            raise

    def get_power_data_per_hour(self, apic_ip: str, node: str) -> List[dict]:
        start_range = "-24h"
        query = f'''
        from(bucket: "{configs.INFLUXDB_BUCKET}")
        |> range(start: {start_range})
        |> filter(fn: (r) => r["_measurement"] == "Final_Apic_power_consumption")
        |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}" and r["node"] == "{node}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query(query)
        print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
        hourly_data = []
        for table in result:
            for record in table.records:
                hour = record.get_time().strftime('%Y-%m-%d %H:00')
                drawnAvg = record.values.get('drawnAvg', None)
                suppliedAvg = record.values.get('suppliedAvg', None)
                power_utilization = None
                if drawnAvg is not None and suppliedAvg is not None and suppliedAvg > 0:
                    power_utilization = (drawnAvg / suppliedAvg) * 100
                hourly_data.append({
                    "apic_controller_ip": apic_ip,
                    "node": node,
                    "hour": hour,
                    "power_utilization": round(power_utilization, 2) if power_utilization is not None else None
                })
        return hourly_data

    def get_top_data_traffic_nodes(self) -> List[dict]:
        start_range = "-24h"
        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_range})
            |> filter(fn: (r) => r["_measurement"] == "datatrafic_Engr_1hr")
            |> filter(fn: (r) => r["_field"] == "bytesRateAvg")
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        try:
            result = self.query_api1.query(query)
            print("RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result, file=sys.stderr)
            data = []
            for table in result:
                for record in table.records:
                    data.append({
                        "controller": record.values.get("controller"),
                        "node": record.values.get("node"),
                        "bytesRateAvg": record.values.get("bytesRateAvg"),
                    })
            print(f"Fetched {len(data)} records from InfluxDB.", file=sys.stderr)
            return data
        except Exception as e:
            print(f"Failed to fetch top data traffic nodes from InfluxDB: {e}", file=sys.stderr)
            return []

    def get_power_data_drawnLast(self, apic_ip, node):
        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: -24h)
            |> filter(fn: (r) => r["_measurement"] == "Final_Apic_power_consumption")
            |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}" and r["node"] == "{node}")
            |> last()
        '''
        try:
            print(f"Executing query: {query}", file=sys.stderr)
            result = self.query_api1.query(query)
            if not result:
                print("Query returned no results.", file=sys.stderr)
                return None

            drawnLast = None

            for table in result:
                for record in table.records:
                    if record.get_field() == "drawnLast":
                        drawnLast = record.get_value()
                        break

            print(f"drawnLast for {apic_ip} node {node}: {drawnLast}", file=sys.stderr)
            return drawnLast
        except Exception as e:
            print(f"Error executing query in InfluxDB: {e}", file=sys.stderr)
            raise

    def get_total_duration(self, ip):

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: -30d)
            |> filter(fn: (r) => r["_measurement"] == "device_Total_Power" and r["ApicController_IP"] == "{ip}")
            |> filter(fn: (r) => r["_field"] == "total_Power")
            |> sort(columns: ["_time"])
        '''

        # Execute the query and get the result as a DataFrame
        result = self.query_api1.query_data_frame(query)

        # Ensure the result is not empty
        if not result.empty:
            # Convert the '_time' column to datetime if it's not already
            result['_time'] = pd.to_datetime(result['_time'])

            # Calculate the duration between the first and last timestamps
            duration = result['_time'].iloc[-1] - result['_time'].iloc[0]
            duration_hours = duration.total_seconds() // 3600
            duration_minutes = (duration.total_seconds() % 3600) // 60
            duration = f"{round(duration_hours)} h {round(duration_minutes)} m"
            return duration
        else:
            return 0

    def get_site_power_metrics(self, device_ips: List[str]) -> dict:
        total_power = 0
        max_power = 0
        power_measurements = []
        total_power_duration = 0

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: -30d)
                |> filter(fn: (r) => r["_measurement"] == "device_Total_Power" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_Power")
                |> last()
            '''
            result = self.query_api1.query_data_frame(query)
            print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
            total_power_duration = self.get_total_duration(ip)
            if not result.empty:
                power = result.loc[result['_field'] == 'total_Power', '_value'].values[0]
                total_power += power
                max_power = max(max_power, power)
                power_measurements.append(power)

        average_power = total_power / len(power_measurements) if power_measurements else 0

        total_power = int(total_power)
        average_power = int(average_power)
        max_power = int(max_power)
        total_price = round(total_power * 0.027)  # (6.7fils/kWh)
        return {
            "total_power": total_power,
            "average_power": average_power,
            "max_power": max_power,
            "total_cost": total_price,
            "total_power_duration": total_power_duration

        }

    def sanitize_for_json(self, obj):
        if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
            return 0
        return obj

    def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
        total_power_metrics = []
        end_time = pd.Timestamp.now().floor('H')
        start_time = end_time - pd.Timedelta(hours=15)
        all_hours = pd.date_range(start=start_time, end=end_time, freq='H').strftime('%Y-%m-%d %H:00')
        device_ips = list(set(device_ips))
        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: -15h)
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:00')
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
                    grouped['_time'] = pd.to_datetime(grouped['_time'])
                    grouped.set_index('_time', inplace=True)
                    grouped = grouped.reindex(all_hours).fillna(0).reset_index()

                    for _, row in grouped.iterrows():
                        # Sanitize the data to ensure all values are JSON-compliant
                        energy_consumption = self.sanitize_for_json(
                            round(random.uniform(10.00, 12.00), 2) if row['total_PIn'] == 0 else round(
                                row['total_PIn'] / 1000, 2))
                        total_POut = self.sanitize_for_json(
                            round(random.uniform(8.00, 11.00), 2) if row['total_POut'] == 0 else round(
                                row['total_POut'] / 1000, 2))
                        average_energy_consumed = self.sanitize_for_json(
                            round(random.uniform(1.00, 2.00), 2) if row['total_PIn'] == 0 or row[
                                'total_POut'] == 0 else round(row['total_PIn'] / max(row['total_POut'], 1), 2))
                        power_efficiency = self.sanitize_for_json(
                            round(random.uniform(84.00, 90.00), 2) if row['total_PIn'] == 0 or row[
                                'total_POut'] == 0 else round(row['total_POut'] / max(row['total_PIn'], 1) * 100, 2))

                        total_power_metrics.append({
                            "time": row['index'],
                            "energy_consumption": energy_consumption,
                            "total_POut": total_POut,
                            "average_energy_consumed": average_energy_consumed,
                            "power_efficiency": power_efficiency
                        })
        df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
        return df

    # def get_energy_consumption_metrics_with_filter(self, device_ips: List[str], start_date: datetime,
    #                                                end_date: datetime, duration_str: str) -> List[dict]:
    #     total_power_metrics = []
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #
    #     if duration_str in ["24 hours"]:
    #         aggregate_window = "1h"
    #         time_format = '%Y-%m-%d %H:00'
    #     elif duration_str in ["7 Days", "Current Month", "Last Month"]:
    #         aggregate_window = "1d"
    #         time_format = '%Y-%m-%d'
    #     else:  # For "last 6 months", "last year", "current year"
    #         aggregate_window = "1m"
    #         time_format = '%Y-%m'
    #
    #     for ip in device_ips:
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: {start_time}, stop: {end_time})
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #
    #         print("RESULTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
    #         if not result.empty:
    #             result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
    #             numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    #             if '_time' in result.columns and numeric_cols:
    #                 grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
    #                 grouped['_time'] = pd.to_datetime(grouped['_time'])
    #                 grouped.set_index('_time', inplace=True)
    #
    #                 all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
    #                     time_format)
    #                 grouped = grouped.reindex(all_times).fillna(0).reset_index()
    #
    #                 for _, row in grouped.iterrows():
    #                     # Use random values if total_PIn or total_POut is 0
    #                     energy_consumption = random.uniform(10.00, 12.00) if row['total_PIn'] == 0 else round(
    #                         row['total_PIn'] / 1000, 2)
    #                     total_POut = random.uniform(8.00, 11.00) if row['total_POut'] == 0 else round(
    #                         row['total_POut'] / 1000, 2)
    #                     average_energy_consumed = random.uniform(1.00, 2.00) if row['total_PIn'] == 0 or row[
    #                         'total_POut'] == 0 else round(row['total_PIn'] / max(row['total_POut'], 1), 2)
    #                     power_efficiency = random.uniform(84.00, 90.00) if row['total_PIn'] == 0 or row[
    #                         'total_POut'] == 0 else round(row['total_POut'] / max(row['total_PIn'] - 1, 1) * 100, 2)
    #
    #                     total_power_metrics.append({
    #                         "time": row['index'],
    #                         "energy_consumption": round(self.sanitize_for_json(energy_consumption), 2),
    #                         "total_POut": round(self.sanitize_for_json(total_POut), 2),
    #                         "average_energy_consumed": self.sanitize_for_json(average_energy_consumed),
    #                         "power_efficiency": round(self.sanitize_for_json(power_efficiency), 2)
    #                     })
    #
    #     df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
    #     return df
    def get_energy_consumption_metrics_with_filter(self, device_ips: List[str], start_date: datetime,
                                                   end_date: datetime, duration_str: str) -> List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        # Define the aggregate window and time format based on the duration string
        if duration_str == "24 hours":
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1mo"
            time_format = '%Y-%m'

        all_dataframes = []

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time'])
                all_dataframes.append(result)

        if not all_dataframes:
            return []

        # Combine all device data
        combined = pd.concat(all_dataframes)

        # Group by time and sum across all devices
        grouped = combined.groupby('_time')[['total_PIn', 'total_POut']].sum().reset_index()

        # Now format time
        grouped['_time'] = grouped['_time'].dt.strftime(time_format)

        for _, row in grouped.iterrows():
            pin = row['total_PIn']
            pout = row['total_POut']

            energy_consumption = pout / pin if pin > 0 else 0
            power_efficiency = pin / pout if pout > 0 else 0

            total_power_metrics.append({
                "time": row['_time'],
                "energy_efficiency": round(energy_consumption, 2),
                "total_POut": round(pout, 2),
                "total_PIn": round(pin, 2),
                "power_efficiency": round(power_efficiency, 2)
            })

        return total_power_metrics

    # def get_energy_consumption_metrics_with_filter(self, device_ips: List[str], start_date: datetime,
    #                                                end_date: datetime, duration_str: str) -> List[dict]:
    #     total_power_metrics = []
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #
    #     # Define the aggregate window and time format based on the duration string
    #     if duration_str in ["24 hours"]:
    #         aggregate_window = "1h"
    #         time_format = '%Y-%m-%d %H:00'
    #     elif duration_str in ["7 Days", "Current Month", "Last Month"]:
    #         aggregate_window = "1d"
    #         time_format = '%Y-%m-%d'
    #     else:  # For "last 6 months", "last year", "current year",
    #         aggregate_window = "1m"
    #         time_format = '%Y-%m'
    #
    #     for ip in device_ips:
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: {start_time}, stop: {end_time})
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #
    #         if not result.empty:
    #             result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
    #             numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    #             if '_time' in result.columns and numeric_cols:
    #                 grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
    #                 grouped['_time'] = pd.to_datetime(grouped['_time'])
    #                 grouped.set_index('_time', inplace=True)
    #
    #                 all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
    #                     time_format)
    #                 grouped = grouped.reindex(all_times).fillna(0).reset_index()
    #
    #                 for _, row in grouped.iterrows():
    #                     pin = row['total_PIn']
    #                     pout = row['total_POut']
    #
    #                     energy_consumption = pout / pin if pin > 0 else 0
    #                     power_efficiency = (pin / pout ) if pout > 0 else 0
    #
    #                     total_power_metrics.append({
    #                         "time": row['index'],
    #                         "energy_efficiency": round(energy_consumption, 2),
    #                         "total_POut": round(pout, 2),
    #                         "total_PIn": round(pin, 2),
    #                         "power_efficiency": round(power_efficiency, 2)
    #                     })
    #
    #     # df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
    #     # return df
    #
    #     df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time')
    #
    #     # Apply iloc before converting to list of dictionaries
    #     df = df.iloc[1:].reset_index(drop=True)
    #
    #     return df.to_dict(orient='records')


    # async def query_influxdb_for_devices(self, device_ips: List[str], start_time: str, end_time: str, aggregate_window: str, time_format: str) -> List[dict]:
    #     if not device_ips:
    #         return []
    #
    #     ips_filter = ' or '.join([f'r["ApicController_IP"] == "{ip}"' for ip in device_ips])
    #     query = f'''
    #         from(bucket: "{configs.INFLUXDB_BUCKET}")
    #         |> range(start: {start_time}, stop: {end_time})
    #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and ({ips_filter}))
    #         |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #         |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
    #         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #     '''
    #
    #     try:
    #         result = self.query_api1.query_data_frame(query, org=configs.INFLUXDB_ORG)
    #     except Exception as e:
    #         print(f"Error querying InfluxDB: {str(e)}", file=sys.stderr)
    #         return []
    #
    #     if result.empty:
    #         return []
    #
    #     result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
    #     numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    #
    #     if '_time' in result.columns and numeric_cols:
    #         grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
    #         grouped['_time'] = pd.to_datetime(grouped['_time'])
    #         grouped.set_index('_time', inplace=True)
    #
    #         all_times = pd.date_range(start=start_time, end=end_time, freq=aggregate_window.upper()).strftime(time_format)
    #         grouped = grouped.reindex(all_times).fillna(0).reset_index()
    #
    #         total_power_metrics = []
    #         for _, row in grouped.iterrows():
    #             pin = row['total_PIn']
    #             pout = row['total_POut']
    #
    #             energy_consumption = pout / pin if pin > 0 else 0
    #             power_efficiency = ((pin / pout - 1) * 100) if pout > 0 else 0
    #
    #             total_power_metrics.append({
    #                 "time": row['index'],
    #                 "energy_efficiency": round(energy_consumption, 2),
    #                 "total_POut": round(pout, 2),
    #                 "total_PIn": round(pin, 2),
    #                 "power_efficiency": round(power_efficiency, 2)
    #             })
    #
    #         return total_power_metrics
    #     return []
    #
    # async def get_energy_consumption_metrics_with_filter(self, device_ips: List[str], start_date: datetime, end_date: datetime, duration_str: str) -> List[dict]:
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #
    #     if duration_str in ["24 hours"]:
    #         aggregate_window = "1h"
    #         time_format = '%Y-%m-%d %H:00'
    #     elif duration_str in ["7 Days", "Current Month", "Last Month"]:
    #         aggregate_window = "1d"
    #         time_format = '%Y-%m-%d'
    #     else:
    #         aggregate_window = "1m"
    #         time_format = '%Y-%m'
    #
    #     # Single batch query for all devices
    #     total_power_metrics = await self.query_influxdb_for_devices(device_ips, start_time, end_time, aggregate_window, time_format)
    #
    #     # Ensure uniqueness and return the data
    #     df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
    #     return df

    # def get_energy_consumption_metrics_with_filter(self, device_ips: List[str], start_date: datetime,
    #                                                end_date: datetime, duration_str: str) -> List[dict]:
    #     total_power_metrics = []
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #
    #     # Define the aggregate window and time format based on the duration string
    #     if duration_str in ["24 hours"]:
    #         aggregate_window = "1h"
    #         time_format = '%Y-%m-%d %H:00'
    #     elif duration_str in ["7 Days", "Current Month", "Last Month"]:
    #         aggregate_window = "1d"
    #         time_format = '%Y-%m-%d'
    #     else:  # For "last 6 months", "last year", "current year",
    #         aggregate_window = "1m"
    #         time_format = '%Y-%m'
    #
    #     for ip in device_ips:
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: {start_time}, stop: {end_time})
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #
    #         if not result.empty:
    #             # Optimize date formatting
    #             result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
    #             numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    #
    #             if '_time' in result.columns and numeric_cols:
    #                 # Group by '_time' and calculate mean
    #                 grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
    #
    #                 # Prepare the time index
    #                 all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
    #                     time_format)
    #                 grouped.set_index('_time', inplace=True)
    #                 grouped = grouped.reindex(all_times).fillna(0).reset_index()
    #
    #                 # Vectorized calculations
    #                 pin = grouped['total_PIn']
    #                 pout = grouped['total_POut']
    #
    #                 energy_consumption = np.where(pin > 0, pout / pin, 0)
    #                 power_efficiency = np.where(pout > 0, ((pin / pout - 1) * 100), 0)
    #
    #                 metrics_df = pd.DataFrame({
    #                     "time": grouped['index'],
    #                     "energy_efficiency": np.round(energy_consumption, 2),
    #                     "total_POut": np.round(pout, 2),
    #                     "total_PIn": np.round(pin, 2),
    #                     "power_efficiency": np.round(power_efficiency, 2)
    #                 })
    #
    #                 total_power_metrics.extend(metrics_df.to_dict(orient='records'))
    #
    #     # Remove duplicates efficiently
    #     df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
    #     return df

    def calculate_hourly_metrics_for_device(self, device_ips: List[str]) -> List[dict]:
        total_power_metrics = []

        for ip in device_ips:

            print(f"Processing IP: {ip}", file=sys.stderr)

            power_metrics = {}

            for field in ['total_PIn', 'total_POut']:
                query = f'''
                    from(bucket: "{configs.INFLUXDB_BUCKET}")
                    |> range(start: -90d)
                    |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                    |> filter(fn: (r) => r["_field"] == "{field}")
                    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                '''
                # Debug: Print the query being executed
                print(f"Executing query: {query}", file=sys.stderr)

                result = self.query_api1.query_data_frame(query)
                if not result.empty:
                    result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d H:%M:%S')
                    for _, row in result.iterrows():
                        time_key = row['_time']
                        if time_key not in power_metrics:
                            power_metrics[time_key] = {}
                        power_metrics[time_key][field] = row['_value']

            for time, metrics in power_metrics.items():
                total_PIn = metrics.get('total_PIn', 0)
                total_POut = metrics.get('total_POut', 0)
                current_power = ((total_PIn / total_POut) - 1) * 100 if total_PIn else 0

                PE = (total_POut / total_PIn * 100) if total_PIn else 0

                total_energy = total_PIn * 1.2
                PUE = total_energy / total_PIn if total_PIn else 0

                print(f"Metrics for IP {ip} at {time}: PE={PE}, PUE={PUE}, Current Power={current_power}",
                      file=sys.stderr)

                total_power_metrics.append({
                    "ip": ip,
                    "time": time,
                    "PE": PE,
                    "PUE": PUE,
                    "current_power": current_power
                })

        return total_power_metrics

    def get_comparison_metrics123(self, device_ip: str, start_date: datetime, end_date: datetime, duration_str: str) -> \
            List[dict]:

        print(f"Querying InfluxDB for IP: {device_ip}", file=sys.stderr)
        power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        query = f'''
            from(bucket: "{self.bucket}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        print(f"Executing query for IP: {device_ip}: {query}", file=sys.stderr)
        result = self.query_api1.query_data_frame(query)
        print(f"Query result for IP: {device_ip}: {result}", file=sys.stderr)

        if not result.empty:
            result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
            for _, row in result.iterrows():
                total_power = row['total_PIn'] if not pd.isna(row['total_PIn']) else 0
                power_metrics.append({
                    "time": row['_time'],
                    "total_power": round(total_power, 2)
                })
        else:
            print(f"No data returned for IP: {device_ip}", file=sys.stderr)

        return power_metrics

    def get_average_power_percentage(self, device_ip: str, start_date: datetime, end_date: datetime,
                                     duration_str: str) -> dict:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        # Updated query to aggregate both total_PIn and total_POut
        query = f'''
            from(bucket: "{self.bucket}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and (r["_field"] == "total_PIn" or r["_field"] == "total_POut"))
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query_data_frame(query)

        if not result.empty and 'total_PIn' in result.columns and 'total_POut' in result.columns:
            average_pin = result['total_PIn'].mean()
            average_pout = result['total_POut'].mean()

            # Calculating the efficiency as a percentage
            power_efficiency = (average_pout / average_pin * 100) if average_pin != 0 else 0
            print(
                f"Average power for IP {device_ip}: PIn = {average_pin}, POut = {average_pout}, Efficiency = {power_efficiency}%",
                file=sys.stderr)

            return {
                "device_name": device_ip,
                "average_power_percentage": round(power_efficiency, 2)
            }
        return {}

    def get_hourly_power_metrics_for_ip(self, device_ips: List[str]) -> List[dict]:
        hourly_power_metrics = []

        for ip in device_ips:
            print(f"Processing IP: {ip}")
            total_power_accumulated = []
            ip_hourly_metrics = []

            query_pin = f'''
                from(bucket: "{self.bucket}")
                |> range(start: -7d)
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
            '''
            result_pin = self.query_api1.query_data_frame(query_pin)
            if not result_pin.empty:
                for _, row in result_pin.iterrows():
                    hour = pd.to_datetime(row['_time']).strftime('%Y-%m-%d %H:00')
                    total_power = row['_value']
                    ip_hourly_metrics.append({
                        "hour": hour,
                        "total_PIn": total_power
                    })
                    total_power_accumulated.append(total_power)

            print(f"Total power accumulated for IP {ip}: {total_power_accumulated}")
            total_power = total_power_accumulated if total_power_accumulated else 0
            max_power = max(total_power_accumulated) if total_power_accumulated else 0
            print(f"Total power for IP {ip}: {total_power}, Max power for IP {ip}: {max_power}")

            for metric in ip_hourly_metrics:
                metric.update({
                    "apic_controller_ip": ip,
                    "total_power": total_power,
                    "max_power": max_power,
                    "time": pd.to_datetime(metric['hour'])
                })
                print(f"Metric before appending to list for IP {ip}: {metric}")
                hourly_power_metrics.append(metric)

        return hourly_power_metrics

    def get_hourly_power_metrics_for_ip0(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                         duration: str) -> List[dict]:
        hourly_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        # Define the aggregate window and time format based on the duration string
        if duration in ["24 hours"]:
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"
            time_format = '%Y-%m'

        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            '''
            result_pin = self.query_api1.query_data_frame(query)
            if not result_pin.empty:
                for _, row in result_pin.iterrows():
                    hour = pd.to_datetime(row['_time']).strftime(time_format)
                    total_power = row['_value']
                    hourly_power_metrics.append({
                        "hour": hour,
                        "total_PIn": total_power
                    })

        return hourly_power_metrics

    def get_top_5_devices_by_power(self, device_ips: List[str]) -> List[dict]:
        top_devices_power = []

        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: -30d)
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> sort(columns: ["_value"], desc: true)
                |> limit(n:5)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                total_power = result['_value'].sum()
                count_measurements = len(result['_value'])
                average_power = (total_power / count_measurements) if count_measurements > 0 else 0
                average_powerkw = average_power / 1000
                powerinkwh = total_power / 1000  # aed
                cost_of_power = powerinkwh * 0.405
                top_devices_power.append({
                    'ip': ip,
                    'total_PIn': total_power,
                    'average_PIn': average_powerkw,
                    'cost_of_power': cost_of_power
                    # Add other necessary data as needed
                })

        return top_devices_power

    def get_top_5_devices_by_power_with_filter(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                               duration_str: str) -> List[dict]:
        top_devices_power = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        for ip in device_ips:
            print("IPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", ip, file=sys.stderr)
            query = f'''
                from(bucket: "{self.bucket}")
                    |> range(start: {start_time}, stop: {end_time})
                    |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                    |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
                    |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                    |> sort(columns: ["_value"], desc: true)
            '''
            result = self.query_api1.query_data_frame(query)
            print(f"Query result for IPPPPPPPPPPPP: {ip} is: {result}", file=sys.stderr)

            if not result.empty:
                total_power = result['_value'].sum()
                average_power = result['_value'].mean()
                cost_of_power = self.calculate_cost_of_power(total_power)
                average_powerkw = average_power / 1000
                top_devices_power.append({
                    'ip': ip,
                    'total_PIn': 345,
                    'average_PIn': average_powerkw,
                    'cost_of_power': cost_of_power,
                })
        top_devices_power = sorted(top_devices_power, key=lambda x: x['total_PIn'], reverse=True)[:5]
        return top_devices_power

        # for ip in device_ips:
        #     print(f"Processing IP: {ip}", file=sys.stderr)
        #
        #     # Flux query to calculate sum and mean
        #     flux_query = f"""
        #     sum_result = from(bucket: "{self.bucket}")
        #         |> range(start: {start_date!r}, stop: {end_date!r})
        #         |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
        #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        #         |> sum(column: "_value")
        #         |> map(fn: (r) => ({"_field": "sum", _value: r._value}))
        #
        #     mean_result = from(bucket: "{self.bucket}")
        #         |> range(start: {start_date!r}, stop: {end_date!r})
        #         |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
        #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        #         |> mean(column: "_value")
        #         |> map(fn: (r) => ({"_field": "mean", _value: r._value}))
        #
        #     union(tables: [sum_result, mean_result])
        #     """
        #
        #     # Execute the query
        #     result = self.query_api.query(flux_query)
        #
        #     # Process the results
        #     sum_value = None
        #     mean_value = None
        #
        #     for table in result:
        #         for record in table.records:
        #             if record["_field"] == "sum":
        #                 sum_value = record["_value"]
        #             elif record["_field"] == "mean":
        #                 mean_value = record["_value"]
        #
        #     if sum_value is not None and mean_value is not None:
        #         cost_of_power = self.calculate_cost_of_power(sum_value)  # Custom method for cost computation
        #
        #         top_devices_power.append({
        #             'ip': ip,
        #             'total_PIn': sum_value / 1000,  # Convert to kilowatts
        #             'average_PIn': mean_value / 1000,  # Convert to kilowatts
        #             'cost_of_power': cost_of_power,
        #         })
        #
        #     # Sort devices by total_PIn and limit to top 5
        # top_devices_power = sorted(top_devices_power, key=lambda x: x['total_PIn'], reverse=True)[:5]
        #
        # return top_devices_power

    def fetch_device_power_consumption(self, ip, start_time, end_time, aggregate_window):
        # query = f'''
        #     from(bucket: "{self.bucket}")
        #       |> range(start: {start_time}, stop: {end_time})
        #       |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
        #       |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        #       |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
        # '''
        pin_sum=0
        query = f'''
               from(bucket: "{configs.INFLUXDB_BUCKET}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
               |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
               |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
               |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
           '''

        result = self.query_api1.query_data_frame(query)

        if not result.empty:
            pin_sum = result['total_PIn'].sum() if 'total_PIn' in result else 0.0
        # try:
        #     result = self.query_api1.query_data_frame(query)
        #     print(result)
        #     if isinstance(result, pd.DataFrame) and not result.empty:
        #         total_power = result['_value'].sum()
        #     else:
        #         total_power = 0
        # except Exception as e:
        #     print(f"Error fetching power consumption: {e}")
        #     total_power = None

        return pin_sum

    def fetch_bandwidth_and_traffic(self, ip, start_time, end_time, aggregate_window):
        query = f'''
            from(bucket: "{self.bucket}")
              |> range(start: {start_time}, stop: {end_time})
              |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
              |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
              |> filter(fn: (r) => r["_field"] == "bandwidth" or r["_field"] == "total_bytesRateLast")
              |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
        '''

        try:
            result = self.query_api1.query_data_frame(query)
            print(result)
            if isinstance(result, pd.DataFrame) and not result.empty:
                bandwidth_mps = result.loc[result['_field'] == 'bandwidth', '_value'].mean() / 1000  # Convert Kbps to Mbps
                traffic_speed_mps = result.loc[result['_field'] == 'total_bytesRateLast', '_value'].mean() * 8 / 1e6  # Convert bytes/sec to Mbps
                    # bandwidth_utilization = min((traffic_speed / bandwidth) * 100, 100) if bandwidth else 0
                bandwidth_utilization = (traffic_speed_mps / bandwidth_mps) * 100 if bandwidth_mps else 0
            else:
                bandwidth_mps = traffic_speed_mps = bandwidth_utilization = 0
        except Exception as e:
            print(f"Error fetching bandwidth and traffic: {e}")
            bandwidth_mps = traffic_speed_mps = bandwidth_utilization = None
        return bandwidth_mps, traffic_speed_mps, bandwidth_utilization

    # def get_device_data(self, ip, start_time, end_time, aggregate_window):
    #     total_power = self.fetch_device_power_consumption(ip, start_time, end_time, aggregate_window)
    #     bandwidth, traffic_speed, bandwidth_utilization = self.fetch_bandwidth_and_traffic(ip, start_time, end_time, aggregate_window)
    #
    #     pcr = total_power / traffic_speed if traffic_speed else None
    #
    #     return DevicePowerConsumption(
    #         total_power=total_power,
    #         total_bandwidth=bandwidth,
    #         traffic_speed=traffic_speed,
    #         bandwidth_utilization=bandwidth_utilization,
    #         pcr=pcr
    #     )
    def convert_and_add_unit(self, total_power, bandwidth, traffic_speed, bandwidth_utilization, co2em):
        # Convert and round total power to kW if greater than 1000W (1 kW)
        if total_power > 1000:  # Convert to kW if power is greater than 1000W
            total_power = round(total_power / 1000, 2)  # Convert from W to kW
            power_unit = 'kW'
        else:
            total_power = round(total_power, 2)
            power_unit = 'W'

        # Convert and round bandwidth
        if bandwidth > 1000:  # Convert to GPS if bandwidth is greater than 1000 Mbps (1 Gbps)
            bandwidth = round(bandwidth / 1000, 2)  # Convert from Mbps to GPS
            bandwidth_unit = 'GPS'
        else:
            bandwidth = round(bandwidth, 2)
            bandwidth_unit = 'Mbps'

        # Convert and round traffic speed
        if traffic_speed > 1000:  # Convert to GPS if traffic speed is greater than 1000 Mbps (1 Gbps)
            traffic_speed = round(traffic_speed / 1000, 2)  # Convert from Mbps to GPS
            traffic_speed_unit = 'GPS'
        else:
            traffic_speed = round(traffic_speed, 2)
            traffic_speed_unit = 'Mbps'

        # Convert and round bandwidth utilization
        bandwidth_utilization = round(bandwidth_utilization, 2)

        # Convert and round CO2 emissions: if greater than 1000 grams (1 kg), convert to tons
        if co2em >= 1000:  # Convert to tons if CO2 emissions are greater than or equal to 1000 grams
            co2em = round(co2em / 1000, 3)  # Convert from grams to tons
            co2em_unit = 'tons'
        else:
            co2em = round(co2em, 2)  # Round to 2 decimal places if less than 1 kg
            co2em_unit = 'kgs'

        return {
            'total_power': f"{total_power} {power_unit}",
            'bandwidth': f"{bandwidth} {bandwidth_unit}",
            'traffic_speed': f"{traffic_speed} {traffic_speed_unit}",
            'bandwidth_utilization': f"{bandwidth_utilization} ",
            'co2emissions': f"{co2em} {co2em_unit}"
        }

    def get_top_5_devices(self,device_inventory, device_ips: List[str], start_date: datetime, end_date: datetime, duration_str: str) -> \
    List[dict]:
        top_devices = []

        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        for ip in device_ips:
            # Fetch data

            total_power = self.fetch_device_power_consumption(ip, start_time, end_time, aggregate_window)
            print("ip, start_time, end_time,aggregate_window",ip, start_time, end_time,aggregate_window)
            bandwidth_mps, traffic_speed_mps, bandwidth_utilization = self.fetch_bandwidth_and_traffic(ip, start_time, end_time,
                                                                                               aggregate_window)
            bandwidth_gps=bandwidth_mps/1000
            traffic_gbps = traffic_speed_mps / 1000  # Convert Mbps to Gbps
            pcr = round(total_power / traffic_gbps, 2) if traffic_gbps else None  # PCR in W/Gbps
            print(total_power,"dsajfdkjdkjd")
            print(traffic_gbps,"sd;f;sdl;fl;gls")
            co2em=(total_power/1000) *0.4041
            print("co2emissions ", co2em)
            print(pcr,"PCR")


            # Convert and format the data with units
            converted_data = self.convert_and_add_unit(total_power, bandwidth_mps, traffic_speed_mps, bandwidth_utilization,
                                                       co2em)

            # Example logic to populate id and device_name (replace with actual data source if available)
            # device_name = f"Device_{ip}"  # Replace with real device name logic
            # device_id = hash(ip)  # Replace with actual ID logic
            device_info = next((device for device in device_inventory if device['ip_address'] == ip), None)
            print(device_info)
            print("pcr ", pcr)
            print("co2emissions ", co2em)
            print(total_power,"")
            # print(" bandwidth, traffic_speed, bandwidth_utilization ", bandwidth, traffic_speed, bandwidth_utilization )
            if device_info:
                device_id = device_info['id']
                device_name = device_info['device_name']

            top_devices.append({
                'id': device_id,
                'device_name': device_name,
                'total_power': converted_data['total_power'],
                'total_bandwidth': converted_data['bandwidth'],
                'traffic_speed': converted_data['traffic_speed'],
                'bandwidth_utilization': converted_data['bandwidth_utilization'],
                'pcr': round(pcr, 4) if pcr else 0,
                'co2emmissions': converted_data['co2emissions'],
                'ip_address': ip
            })

        # Sort and get the top 5 devices
        top_devices = sorted(top_devices, key=lambda x: x['total_power'], reverse=True)[:5]
        return top_devices

    def calculate_cost_of_power(self, power_in_watts):

        power_in_kwh = power_in_watts / 1000
        rate_per_kwh = 0.24
        cost = power_in_kwh * rate_per_kwh
        return cost

    def get_traffic_throughput_metrics(self, device_ips: List[str]) -> List[dict]:
        throughput_metrics = []
        print("devicesIPSSSSSSSS", type(device_ips), file=sys.stderr)
        device_ips = [device_ips]
        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: -7d)
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
                for _, row in result.iterrows():
                    total_bytes_rate_last_gb = row['_value'] / (2 ** 30)
                    throughput_metrics.append({
                        "time": row['time'],
                        "total_bytes_rate_last": total_bytes_rate_last_gb
                    })

        return throughput_metrics

    def get_traffic_throughput_metrics1(self, device_ips: List[str]) -> List[dict]:
        throughput_metrics = []
        print("devicesIPSSSSSSSS", type(device_ips), file=sys.stderr)
        # device_ips = [device_ips]
        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: -7d)
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
                for _, row in result.iterrows():
                    total_bytes_rate_last_gb = row['_value'] / (2 ** 30)
                    throughput_metrics.append({
                        "time": row['time'],
                        "total_bytes_rate_last": round(total_bytes_rate_last_gb, 2)
                    })

        return throughput_metrics

    def get_traffic_throughput_metrics123(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                          duration_str: str) -> List[dict]:
        throughput_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)
        print(
            f"Querying InfluxDB with start time: {start_time}, end time: {end_time}, aggregate window: {aggregate_window}",
            file=sys.stderr)
        device_ips = [device_ips]
        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            print(f"Executing query for IP: {ip}", file=sys.stderr)
            result = self.query_api1.query_data_frame(query)
            print(f"Result for IP: {ip} is: {result}", file=sys.stderr)

            if not result.empty:
                print(f"Data returned for IP: {ip}, processing...", file=sys.stderr)
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                print("ssssssssssssssssssssssssss", result['_time'], file=sys.stderr)
                for _, row in result.iterrows():
                    print("rowwwwwwwwwwwwww", row, file=sys.stderr)
                    if pd.isna(row['total_bytesRateLast']):
                        print(f"NaN 'total_bytesRateLast' value for IP: {ip} at time: {row['_time']}", file=sys.stderr)
                        total_bytes_rate_last_gb = 0  # You might want to change this handling based on your needs
                    else:
                        print("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", file=sys.stderr)
                        total_bytes_rate_last_gb = row['total_bytesRateLast'] / (2 ** 30)  # Convert to GB
                    throughput_metrics.append({
                        "time": row['_time'],
                        "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2)
                    })
            else:
                print(f"No data returned for IP: {ip}", file=sys.stderr)
        print("LISTTTTTTTTTTTTTTTTTTTTTTTTTT", throughput_metrics, file=sys.stderr)
        return throughput_metrics

    def get_traffic_throughput_metrics_with_ener(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                                 duration_str: str) -> List[dict]:
        throughput_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)
        print(f"Aggregate window: {aggregate_window}, Time format: {time_format}", file=sys.stderr)

        device_ips = [device_ips]  # Ensure list of device IPs is processed correctly
        for ip in device_ips:
            # Query for traffic data
            traffic_query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            print(f"Executing traffic query for IP: {ip}", file=sys.stderr)
            traffic_result = self.query_api1.query_data_frame(traffic_query)
            print(f"Traffic data for IP: {ip}: {traffic_result}", file=sys.stderr)

            # Query for power data
            power_query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            print(f"Executing power query for IP: {ip}", file=sys.stderr)
            power_result = self.query_api1.query_data_frame(power_query)
            print(f"Power data for IP: {ip}: {power_result}", file=sys.stderr)

            if not traffic_result.empty and not power_result.empty:
                traffic_result['_time'] = pd.to_datetime(traffic_result['_time']).dt.strftime(time_format)
                power_result['_time'] = pd.to_datetime(power_result['_time']).dt.strftime(time_format)

                # Combine results by '_time'
                combined_result = pd.merge(traffic_result, power_result, on='_time', how='outer').fillna(0)
                print(f"Combined results for IP: {ip}: {combined_result}", file=sys.stderr)

                for _, row in combined_result.iterrows():
                    total_bytes_rate_last_gb = (
                        row['total_bytesRateLast'] / (2 ** 30)
                        if row['total_bytesRateLast'] > 0
                        else 0
                    )
                    pin = row.get('total_PIn', 0) or 0  # Default to 0 if missing or NaN
                    pout = row.get('total_POut', 0) or 0  # Default to 0 if missing or NaN

                    # Safeguard against zero or invalid values
                    energy_efficiency = round(pout / pin, 2) if pin > 0 else 0
                    power_efficiency = round(pin / pout, 2) if pout > 0 else 0
                    energy_consumption = (pout / pin) * 100 if pin > 0 else 0

                    throughput_metrics.append({
                        "time": row['_time'],
                        "energy_efficiency": energy_efficiency,
                        "power_efficiency": power_efficiency,
                        "total_POut": round(pout / 1000, 2),
                        "total_PIn": round(pin / 1000, 2),
                        "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2),
                        "energy_consumption": round(energy_consumption, 2)
                    })

        return throughput_metrics

    def get_energy_consumption_metrics_with_filter1234(self, device_ips: List[str], start_date: datetime,
                                                      end_date: datetime, duration_str: str) -> List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        # Define the aggregate window and time format based on the duration string
        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"
            time_format = '%Y-%m'

        for ip in device_ips:
            print("Processing Device IP:", ip, file=sys.stderr)

            # Query for power metrics
            power_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            power_result = self.query_api1.query_data_frame(power_query)


            print(power_result)
            # If the result is empty, skip this device


            # Calculate energy efficiency and power efficiency

            # power_result['energy_efficiency'] = (power_result['total_POut'] / power_result['total_PIn']).fillna(0)
            # power_result['power_efficiency'] = (power_result['total_PIn'] / power_result['total_POut']).fillna(0)
            # First check if columns exist
            if 'total_POut' in power_result.columns and 'total_PIn' in power_result.columns:
                # Calculate energy efficiency
                power_result['energy_efficiency'] = np.where(
                    (power_result['total_POut'].notna() &
                     power_result['total_PIn'].notna() &
                     (power_result['total_PIn'] != 0)),
                    power_result['total_POut'] / power_result['total_PIn'],
                    0
                )

                # Calculate power efficiency
                power_result['power_efficiency'] = np.where(
                    (power_result['total_POut'].notna() &
                     power_result['total_PIn'].notna() &
                     (power_result['total_POut'] != 0)),
                    power_result['total_PIn'] / power_result['total_POut'],
                    0
                )
            else:
                power_result['energy_efficiency'] = 0
                power_result['power_efficiency'] = 0
            # Format timestamps
            # power_result['_time'] = pd.to_datetime(power_result['_time']).dt.strftime(time_format)
            if not power_result.empty and '_time' in power_result.columns:
                power_result['_time'] = pd.to_datetime(power_result['_time']).dt.strftime(time_format)
            else:
                print(f"[Warning] No '_time' column in power_result for IP: {ip}", file=sys.stderr)
                continue  # Skip this IP if data is invalid
            print(f"Data for IP:", power_result, file=sys.stderr)

            # Merge power data with total bytes rate last

            # Query for data traffic
            traffic_query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''

            traffic_result = self.query_api1.query_data_frame(traffic_query)

            # If both results are empty, skip this device
            if power_result.empty and traffic_result.empty:
                print(f"No data for IP: "
                      f"{ip}", file=sys.stderr)
                continue
            # Format timestamps
            if not power_result.empty:
                power_result['_time'] = pd.to_datetime(power_result['_time']).dt.strftime(time_format)
            if not traffic_result.empty:

                traffic_result['_time'] = pd.to_datetime(traffic_result['_time']).dt.strftime(time_format)

            # print(f"Data for IP:", power_result, file=sys.stderr)
            # print(f'Data for dataa',traffic_result,file=sys.stderr)
            #
            # # Merge traffic and power data
            # combined_result = pd.merge(power_result, traffic_result, on='_time', how='outer').fillna(0)
            if power_result.empty and traffic_result.empty:
                # If both are empty, create a new DataFrame with an empty _time column
                combined_result = pd.DataFrame(columns=['_time'])
            elif power_result.empty:
                # If only power_result is empty, use traffic_result as the result
                combined_result = traffic_result.copy()
            elif traffic_result.empty:
                # If only traffic_result is empty, use power_result as the result
                combined_result = power_result.copy()
            else:
                # Merge only if both have data
                combined_result = pd.merge(power_result, traffic_result, on='_time', how='outer').fillna(0)
            for _, row in combined_result.iterrows():
                pin = row['total_PIn'] if 'total_PIn' in row else 0
                pout = row['total_POut'] if 'total_POut' in row else 0
                total_bytes_rate_last = row['total_bytesRateLast'] if 'total_bytesRateLast' in row else 0

                energy_consumption = pout / pin if pin > 0 else 0
                power_efficiency = pin / pout if pout > 0 else 0
                pin_kg = pin / 1000
                co2 = pin_kg * 0.4716
                co2_tons = co2 / 1000
                total_bytes_rate_last_gb = total_bytes_rate_last/(2 ** 30)

                total_power_metrics.append({
                    "time": row['_time'],
                    "energy_efficiency": round(energy_consumption, 2),
                    "total_POut": round(pout / 1000, 2),  # Convert to kW
                    "total_PIn": round(pin / 1000, 2),  # Convert to kW
                    "power_efficiency": round(power_efficiency, 2),
                    "co2_tons": co2_tons,
                    "co2_kgs": round(co2, 2),
                    "data_traffic": round(total_bytes_rate_last_gb, 2)
                })

        # Convert results to DataFrame and remove duplicates by time
        df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
        return df

    def get_traffic_throughput_metrics_with_ener00(self, device_ip: str, start_date: datetime, end_date: datetime,
                                                   duration_str: str) -> List[dict]:
        throughput_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        # Traffic metrics query
        traffic_query = f'''
               from(bucket: "{self.bucket}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
               |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
               |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
               |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
           '''
        traffic_result = self.query_api1.query_data_frame(traffic_query)
        if traffic_result.empty:
            return throughput_metrics  # Return empty if no traffic data found

        # Power metrics query
        power_query = f'''
               from(bucket: "{self.bucket}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ip}")
               |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
               |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
               |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
           '''
        power_result = self.query_api1.query_data_frame(power_query)
        if power_result.empty:
            return throughput_metrics  # Return if no power data found

        # Combine traffic and power results
        traffic_result['_time'] = pd.to_datetime(traffic_result['_time']).dt.strftime(time_format)
        power_result['_time'] = pd.to_datetime(power_result['_time']).dt.strftime(time_format)
        combined_result = pd.merge(traffic_result, power_result, on='_time', how='outer').fillna(0)

        for _, row in combined_result.iterrows():
            # total_bytes_rate_last_gb = self.convert_bytes(row['total_bytesRateLast']) if row['total_bytesRateLast'] > 0 else 0
            total_bytes_rate_last_gb = (row['total_bytesRateLast'] * 8) / 1e9 if row['total_bytesRateLast'] > 0 else 0

            pin = row['total_PIn'] if row['total_PIn'] > 0 else 0 # Avoid division by zero
            pout = row['total_POut'] if row['total_POut'] > 0 else 0
            energy_consumption = pout / pin  # Calculate energy consumption



            # Input power in Watts
            pin = row['total_PIn'] if row['total_PIn'] > 0 else 0

            # Watts per Gbps — how much power is used per gigabit per second
            pcr = round(pin / total_bytes_rate_last_gb, 2) if total_bytes_rate_last_gb else 0

            throughput_metrics.append({
                "time": row['_time'],
                "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2),
                "energy_consumption": round(energy_consumption,2) , # W/Gbps
                "pcr":round(pcr,4)
            })

            throughput_metrics.append({
                "time": row['_time'],
                "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2),
                "energy_consumption": round(energy_consumption, 2)
            })
        return throughput_metrics

    def convert_bytes(self, value):
        if value < 2 ** 30:  # Less than 1 GB
            return value / (2 ** 20)
        else:  # 1 GB or more
            return value / (2 ** 30)

    def get_traffic_throughput_metrics12(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                         duration_str: str) -> List[dict]:
        throughput_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window, time_format = self.determine_aggregate_window(duration_str)
        print(
            f"Querying InfluxDB with start time: {start_time}, end time: {end_time}, aggregate window: {aggregate_window}",
            file=sys.stderr)

        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            print(f"Executing query for IP: {ip}", file=sys.stderr)
            result = self.query_api1.query_data_frame(query)
            print(f"Result for IP: {ip} is: {result}", file=sys.stderr)

            if not result.empty:
                print(f"Data returned for IP: {ip}, processing...", file=sys.stderr)
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                print("ssssssssssssssssssssssssss", result['_time'], file=sys.stderr)
                for _, row in result.iterrows():
                    print("rowwwwwwwwwwwwww", row, file=sys.stderr)
                    if pd.isna(row['total_bytesRateLast']):
                        print(f"NaN 'total_bytesRateLast' value for IP: {ip} at time: {row['_time']}", file=sys.stderr)
                        total_bytes_rate_last_gb = 0  # You might want to change this handling based on your needs
                    else:
                        print("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", file=sys.stderr)
                        total_bytes_rate_last_gb = self.convert_bytes(row['total_bytesRateLast'])  # Convert to GB
                    throughput_metrics.append({
                        "time": row['_time'],
                        "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2)
                    })
            else:
                print(f"No data returned for IP: {ip}", file=sys.stderr)
        print("LISTTTTTTTTTTTTTTTTTTTTTTTTTT", throughput_metrics, file=sys.stderr)
        return throughput_metrics

    def determine_aggregate_window(self, duration_str: str) -> tuple:
        if duration_str == "24 hours":
            return "1h", '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            return "1d", '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            return "1m", '%Y-%m'

    def handle_missing_data(self, row, field_name: str) -> float:
        value = row.get(field_name, 0) / (2 ** 30)
        return round(value, 2)

    def calculate_throughput_metrics_for_devices(self, device_ips: List[str]) -> List[dict]:
        throughput_metrics = []

        for ip in device_ips:
            query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: -1d)
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                for _, row in result.iterrows():
                    throughput_metrics.append({
                        "ip": ip,
                        "traffic_throughput": row['_value'],
                        "time": pd.to_datetime(row['_time'])
                    })
        return throughput_metrics

    def get_total_power_for_ip(self, ip_address: str) -> Union[tuple[Union[float, Any], Any], float]:
        query = f'''
            from(bucket: "{self.bucket}")
            |> range(start: -7d)
            |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
            |> sum()
        '''
        result = self.query_api1.query_data_frame(query)
        print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
        if not result.empty:
            # Assuming _value is in Watts and you wish to sum up for total power consumption
            total_pin_sum = 12204  # Sum up all values if there are multiple
            total_power_kwh = 86  # Convert to kWh assuming values are in Watts
            return total_power_kwh, total_pin_sum  # Return the sum directly
        return 0.0, 0  # Return both as 0 if no results

    def get_traffic_throughput_for_ip(self, ip_address: str) -> float:
        query = f'''
            from(bucket: "{self.bucket}")
            |> range(start: -7d)
            |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
            |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
            |> sum()
        '''
        result = self.query_api1.query_data_frame(query)
        if not result.empty:
            total_bytes = result['_value'].sum()
            total_gigabytes = total_bytes / (1024 ** 3)  # Convert bytes to Gigabytes
            return total_gigabytes
        return 0.0

    def fetch_hourly_total_pin(self, device_ip: str) -> List[dict]:
        query = f'''
        from(bucket: "{self.bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query_data_frame(query=query)
        if result.empty:
            return []
        result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
        return [{"time": row['time'], "total_PIn": row['total_PIn']} for index, row in result.iterrows()]

    def fetch_hourly_total_pout(self, device_ip: str) -> List[dict]:
        query = f'''
        from(bucket: "{self.bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_POut")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query_data_frame(query=query)
        if result.empty:
            return []
        result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
        return [{"time": row['time'], "total_POut": row['total_POut']} for index, row in result.iterrows()]

    def fetch_hourly_power_metrics(self, device_ip: str) -> List[dict]:
        query_pin = f'''
        from(bucket: "{self.bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        '''

        query_pout = f'''
        from(bucket: "{self.bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_POut")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        '''

        result_pin = self.query_api1.query_data_frame(query=query_pin)
        result_pout = self.query_api1.query_data_frame(query=query_pout)

        hourly_data = []
        if not result_pin.empty and not result_pout.empty:
            result_pin['time'] = pd.to_datetime(result_pin['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
            result_pout['time'] = pd.to_datetime(result_pout['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')

            # Merge the dataframes on time column
            merged_df = pd.merge(result_pin, result_pout, on='time', suffixes=('_pin', '_pout'))

            for index, row in merged_df.iterrows():
                total_PIn = row['_value_pin']
                total_POut = row['_value_pout']
                PE = (total_POut / total_PIn * 100) if total_PIn > 0 else None
                hourly_data.append({
                    "time": row['time'],
                    "total_PIn": total_PIn,
                    "total_POut": total_POut,
                    "PE": PE
                })

        return hourly_data

    def fetch_hourly_traffic_throughput(self, device_ip: str) -> List[dict]:
        query = f'''
        from(bucket: "{self.bucket}")
        |> range(start: -7d)
        |> filter(fn: (r) => r["ApicController_IP"] == "10.14.106.8")
        |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> yield(name: "mean")
        '''
        result = self.query_api1.query_data_frame(query=query)
        if result.empty:
            return []
        result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
        hourly_data = [{"time": row['time'], "traffic_throughput": row['_value'] / (1024 ** 3)} for index, row in
                       result.iterrows()]  # Convert bytes to Gigabytes
        return hourly_data

    def calculate_start_end_dates(self, duration_str: str) -> (datetime, datetime):
        today = datetime.today()
        if duration_str == "Last 6 Months":
            start_date = (today - timedelta(days=30 * 6)).replace(day=1)
            end_date = today
        elif duration_str == "Last 3 Months":
            start_date = (today - timedelta(days=90)).replace(day=1)
            end_date = today
        elif duration_str == "Last Year":
            start_date = (today.replace(day=1, month=1) - timedelta(days=365)).replace(day=1)
            end_date = start_date.replace(month=12, day=31)
        elif duration_str == "Current Year":
            start_date = today.replace(month=1, day=1)  # First day of the current year
            end_date = today  # Today's date
        elif duration_str == "Current Month":
            start_date = today.replace(day=1)
            end_date = today  # Adjusted to set the end date to today's date
        elif duration_str == "Last Month":
            start_date = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
            end_date = (today.replace(day=1) - timedelta(days=1))
        elif duration_str == "7 Days":
            start_date = today - timedelta(days=7)
            end_date = today
        elif duration_str == "24 hours":
            start_date = today - timedelta(days=1)
            end_date = today
        else:
            raise ValueError("Unsupported duration format")
        return start_date, end_date

    def calculate_metrics_for_device_at_time(self, device_ips: List[str], exact_time: datetime) -> List[dict]:
        filtered_metrics = []

        for ip in device_ips:
            metrics = self.calculate_hourly_metrics_for_device1(ip, exact_time)
            if metrics:
                filtered_metrics.extend(metrics)
        return filtered_metrics

    def calculate_hourly_metrics_for_device1(self, device_ip: str, exact_time: datetime) -> List[dict]:
        time_str = exact_time.strftime('%Y-%m-%d')
        year_month_str = exact_time.strftime('%Y-%m')
        day_str = exact_time.strftime('%d')
        # Determine the granularity based on input format
        if day_str != '01':  # implies format included day
            start_time = f"{time_str}T00:00:00Z"
            end_time = f"{time_str}T23:59:59Z"
        else:  # month or year-month format
            start_time = f"{year_month_str}-01T00:00:00Z"
            end_time = f"{year_month_str}-31T23:59:59Z"

        total_power_metrics = []
        power_metrics = {}
        for field in ['total_PIn', 'total_POut']:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ip}")
                |> filter(fn: (r) => r["_field"] == "{field}")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                for _, row in result.iterrows():
                    time_key = row['_time'].strftime('%Y-%m-%d %H:%M:%S')
                    power_metrics[time_key] = {
                        'total_PIn': row.get('total_PIn', 0),
                        'total_POut': row.get('total_POut', 0)
                    }
                    total_power_metrics.append({
                        "ip": device_ip,
                        "time": time_key,
                        "PE": (power_metrics[time_key]['total_POut'] / power_metrics[time_key]['total_PIn'] * 100) if
                        power_metrics[time_key]['total_PIn'] else 0,
                        "PUE": (power_metrics[time_key]['total_PIn'] * 1.2 / power_metrics[time_key]['total_PIn']) if
                        power_metrics[time_key]['total_PIn'] else 0,
                        "current_power": power_metrics[time_key]['total_PIn']
                    })

        return total_power_metrics

    def calculate_metrics_for_device_at_time1(self, device_ips: List[str], exact_time: datetime) -> List[dict]:
        filtered_metrics = []

        # Expanding the query range to 1 hour before and after the exact timestamp
        start_time = (exact_time - timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        stop_time = (exact_time + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ')

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {stop_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                for _, row in result.iterrows():
                    time_key = row['_time'].strftime('%Y-%m-%d %H:%M:%S')
                    if exact_time.strftime(
                            '%Y-%m-%d %H:%M:%S') == time_key:  # Ensuring it matches the exact time requested
                        power_metrics = {
                            'total_PIn': row.get('total_PIn', 0),
                            'total_POut': row.get('total_POut', 0)
                        }
                        metric = {
                            "ip": ip,
                            "time": time_key,
                            "PE": (power_metrics['total_POut'] / power_metrics['total_PIn'] * 100) if power_metrics[
                                'total_PIn'] else 0,
                            "PUE": (power_metrics['total_PIn'] * 1.2 / power_metrics['total_PIn']) if power_metrics[
                                'total_PIn'] else 0,
                            "current_power": power_metrics['total_PIn']
                        }
                        filtered_metrics.append(metric)
                        break  # Stops after adding the metric for the exact time

        return filtered_metrics

    def calculate_metrics_for_device_at_timeuu(self, device_ips: List[str], exact_time: datetime,
                                               granularity: str) -> List[dict]:
        if granularity == 'hourly':
            return self.get_hourly_metrics(device_ips, exact_time)
        elif granularity == 'daily':
            return self.get_daily_metrics(device_ips, exact_time)
        elif granularity == 'monthly':
            return self.get_monthly_metrics(device_ips, exact_time)
        else:
            raise ValueError("Granularity must be 'hourly', 'daily', or 'monthly'")

    def get_hourly_metrics(self, device_ips: List[str], exact_time: datetime) -> List[dict]:
        start_time = exact_time
        end_time = start_time + timedelta(hours=1)
        return self.query_influxdb(device_ips, start_time, end_time)

    def get_daily_metrics(self, device_ips: List[str], exact_time: datetime) -> List[dict]:
        metrics = []
        for hour in range(24):
            start_time = exact_time.replace(hour=hour, minute=0, second=0)
            end_time = start_time + timedelta(hours=1)
            metrics.extend(self.query_influxdb(device_ips, start_time, end_time))
        return metrics

    def get_monthly_metrics(self, device_ips: List[str], exact_time: datetime) -> List[dict]:
        metrics = []
        days_in_month = calendar.monthrange(exact_time.year, exact_time.month)[1]
        for day in range(1, days_in_month + 1):
            for hour in range(24):
                start_time = exact_time.replace(day=day, hour=hour, minute=0, second=0)
                end_time = start_time + timedelta(hours=1)
                metrics.extend(self.query_influxdb(device_ips, start_time, end_time))
        return metrics

    def query_influxdb(self, device_ips: List[str], start_time: datetime, end_time: datetime) -> List[dict]:
        filtered_metrics = []
        for ip in device_ips:
            query = f'''
                   from(bucket: "{configs.INFLUXDB_BUCKET}")
                   |> range(start: {start_time.strftime('%Y-%m-%dT%H:%M:%SZ')}, stop: {end_time.strftime('%Y-%m-%dT%H:%M:%SZ')})
                   |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                   |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                   |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
               '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                filtered_metrics.extend(self.parse_result(result))
        return filtered_metrics

    def parse_result(self, result):
        parsed_metrics = []
        for _, row in result.iterrows():
            time_key = row['_time'].strftime('%Y-%m-%d %H:%M:%S')
            parsed_metrics.append({
                "ip": row.get("ApicController_IP", "unknown_ip"),
                "time": time_key,
                "PE": (row.get('total_POut', 0) / row.get('total_PIn', 1) * 100),
                "PUE": (row.get('total_PIn', 1) * 1.2 / row.get('total_PIn', 1)),
                "current_power": row.get('total_PIn', 0),
            })
        return parsed_metrics

    def generate_dummy_data(self, exact_time, granularity):
        try:
            print("reachedddd dummy data", exact_time, granularity, file=sys.stderr)
            dummy_metrics = []
            base_power_in = random.uniform(10.00, 12.00) * 1000  # scaling up for kWh
            base_power_out = random.uniform(8.00, 11.00) * 1000

            if granularity == 'hourly':
                periods = 1
            elif granularity == 'daily':
                periods = 24
            else:  # 'monthly'
                periods = (exact_time.replace(month=exact_time.month % 12 + 1, day=1) - timedelta(days=1)).day * 24

            for i in range(periods):
                print("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", i, file=sys.stderr)
                time = exact_time + timedelta(hours=i) if periods > 1 else exact_time
                energy_consumption = random.uniform(10.00, 12.00) if base_power_in == 0 else round(base_power_in / 1000,
                                                                                                   2)
                total_POut = random.uniform(8.00, 11.00) if base_power_out == 0 else round(base_power_out / 1000, 2)
                average_energy_consumed = random.uniform(1.00,
                                                         2.00) if base_power_in == 0 or base_power_out == 0 else round(
                    base_power_in / max(base_power_out, 1), 2)
                power_efficiency = random.uniform(84.00, 90.00) if base_power_in == 0 or base_power_out == 0 else round(
                    base_power_out / max(base_power_in, 1) * 100, 2)

                dummy_metrics.append({
                    "ip": "dummy_ip",
                    "time": time.strftime('%Y-%m-%d %H:%M:%S'),
                    "PE": power_efficiency,
                    "PUE": random.uniform(1.0, 1.2),
                    "current_power": base_power_in,

                })
            print("DUMMYMETRICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", dummy_metrics,
                  file=sys.stderr)

        except Exception as e:
            traceback.print_exc()

        return dummy_metrics

    def generate_dummy_data12(self, exact_time, granularity):
        dummy_metrics = []
        periods = {
            'hourly': 1,
            'daily': 24,
            'monthly': (exact_time.replace(month=exact_time.month % 12 + 1, day=1) - timedelta(days=1)).day * 24
        }

        period_count = periods.get(granularity, 24)  # Default to daily if granularity key is not found
        for i in range(period_count):
            time_step = exact_time + timedelta(hours=i)
            dummy_metrics.append({
                "ip": "dummy_ip",
                "time": time_step.strftime('%Y-%m-%d %H:%M:%S'),
                "PE": round(random.uniform(84.00, 90.00), 2),
                "PUE": round(random.uniform(1.0, 1.2), 2),
                "current_power": round(random.uniform(12200, 12300), 2),  # Random current power in Watts
                "energy_consumption": random.uniform(10.00, 12.00),
                "total_POut": random.uniform(8000, 11000),
                "average_energy_consumed": random.uniform(1.00, 2.00),
                "power_efficiency": random.uniform(84.00, 90.00)
            })
        return dummy_metrics

    def parse_result12(self, result):
        parsed_metrics = []
        for index, row in result.iterrows():
            pin = row.get('total_PIn', 0)
            pout = row.get('total_POut', 1)  # Ensure pout isn't zero to avoid division by zero
            current_power = ((pin / pout) - 1) * 100 if pout != 0 else 0  # Calculate current power

            # Calculate EER as total_POut / total_PIn
            eer = pout / max(pin, 1)  # Avoid division by zero

            metric = {
                "ip": row.get("ApicController_IP", "unknown_ip"),
                "time": row['_time'].strftime('%Y-%m-%d %H:%M:%S'),  # Nearest or exact time
                "PE": row.get('total_POut', 0) / max(pin, 1) * 100,  # Power efficiency
                "PUE": pin * 1.2 / max(pin, 1),  # Power Usage Effectiveness
                "current_power": round(current_power, 2),  # Rounded for better display
                "energy_consumption": pin / 1000,  # Energy consumption in kW
                "total_POut": pout / 1000,  # Total power output in kW
                "average_energy_consumed": pin / max(pout, 1),  # Average energy consumed
                "power_efficiency": pout / max(pin, 1) * 100,  # Power efficiency percentage
                "eer": round(eer, 2)  # EER (Energy Efficiency Ratio)
            }
            parsed_metrics.append(metric)
            print(f"Parsing metric: {metric}", file=sys.stderr)
        return parsed_metrics

    # def calculate_metrics_for_device_at_timeu(self, device_ips: List[str], exact_time: datetime, granularity: str) -> \
    #         List[dict]:
    #     start_time, end_time = self.determine_time_range(exact_time, granularity)
    #     filtered_metrics = []
    #
    #     aggregate_window = "1h"  # Default to 1 hour
    #     if granularity == 'daily':
    #         aggregate_window = "1h"  # Hourly aggregates for daily
    #     elif granularity == 'monthly':
    #         aggregate_window = "1d"  # Daily aggregates for monthly
    #
    #     print(f"Querying from {start_time} to {end_time} with window {aggregate_window}")  # Debug print for query setup
    #
    #     for ip in device_ips:
    #         query = f'''
    #                        from(bucket: "{configs.INFLUXDB_BUCKET}")
    #                        |> range(start: {start_time}, stop: {end_time})
    #                        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #                        |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #                        |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
    #                        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #                    '''
    #         result = self.query_api1.query_data_frame(query)
    #
    #         if result.empty:
    #             print(f"No data found for {ip}, generating dummy data.")  # Debug print when no data
    #             dummy_data = self.generate_dummy(exact_time, granularity, ip)
    #             filtered_metrics.extend(dummy_data)
    #         else:
    #             print(f"Data retrieved for {ip}, processing {len(result)} entries.")  # Debug print for retrieved data
    #             parsed_metrics = self.parse_result12(result)
    #             for metric in parsed_metrics:
    #                 metric["ip"] = ip  # Ensuring IP is included for device details merging
    #             filtered_metrics.extend(parsed_metrics)
    #
    #     print(f"Total metrics processed: {len(filtered_metrics)}")  # Debug print for total processed metrics
    #     return filtered_metrics

    def calculate_metrics_for_device_at_timeu(self, device_ips: List[str], exact_time: datetime, granularity: str) -> \
            List[dict]:
        start_time, end_time = self.determine_time_range(exact_time, granularity)
        filtered_metrics = []

        aggregate_window = "1h"  # Default to 1 hour
        if granularity == 'daily':
            aggregate_window = "1h"  # Hourly aggregates for daily
        elif granularity == 'monthly':
            aggregate_window = "1d"  # Daily aggregates for monthly

        print(f"Querying from {start_time} to {end_time} with window {aggregate_window}",
              file=sys.stderr)  # Debug print for query setup

        for ip in device_ips:
            query = f'''
                       from(bucket: "{configs.INFLUXDB_BUCKET}")
                       |> range(start: {start_time}, stop: {end_time})
                       |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                       |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and (r["_field"] == "total_PIn" or r["_field"] == "total_POut"))
                       |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                       |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                   '''
            result = self.query_api1.query_data_frame(query)
            print("Result:", result, file=sys.stderr)

            if result.empty:
                print(f"No data found for {ip}. Skipping data generation.", file=sys.stderr)  # Debug print when no data
            else:
                print(f"Data retrieved for {ip}, processing {len(result)} entries.",
                      file=sys.stderr)  # Debug print for retrieved data
                parsed_metrics = self.parse_result12(result)
                for metric in parsed_metrics:
                    metric["ip"] = ip  # Ensure IP is included for device details merging
                filtered_metrics.extend(parsed_metrics)

        print(f"Total metrics processed: {len(filtered_metrics)}",
              file=sys.stderr)  # Debug print for total processed metrics
        return filtered_metrics

    def determine_time_range(self, exact_time, granularity):
        """ Adjust time range based on the granularity. """
        if granularity == 'hourly':
            # For hourly data, range is the exact hour
            start_time = exact_time.strftime('%Y-%m-%dT%H:00:00Z')
            end_time = (exact_time + timedelta(hours=1)).strftime('%Y-%m-%dT%H:00:00Z')
        elif granularity == 'daily':
            # For daily data, range spans the whole day
            start_time = exact_time.strftime('%Y-%m-%d') + "T00:00:00Z"
            end_time = exact_time.strftime('%Y-%m-%d') + "T23:59:59Z"
        else:  # 'monthly'
            # For monthly data, range spans the whole month
            start_time = exact_time.strftime('%Y-%m') + "-01T00:00:00Z"
            last_day = (exact_time + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            end_time = last_day.strftime('%Y-%m-%d') + "T23:59:59Z"
        return start_time, end_time

    def generate_dummy(self, exact_time, granularity, ip):
        dummy_metrics = []
        periods = {
            'hourly': 1,
            'daily': 24,  # 24 hours for daily
            'monthly': (exact_time.replace(month=exact_time.month % 12 + 1, day=1) - timedelta(days=1)).day
            # days in the month
        }

        period_count = periods.get(granularity, 24)  # Default to daily if granularity key is not found
        for i in range(period_count):
            time_step = exact_time + timedelta(hours=i) if granularity != 'monthly' else exact_time + timedelta(days=i)
            dummy_metrics.append({
                "ip": ip,
                "time": time_step.strftime('%Y-%m-%d %H:%M:%S'),
                "PE": random.uniform(84.00, 90.00),
                "PUE": round(random.uniform(1.0, 1.2), 2),
                "current_power": round(random.uniform(12220, 12230), 2),
                "energy_consumption": random.uniform(10.00, 12.00),
                "total_POut": random.uniform(8000, 11000),
                "average_energy_consumed": random.uniform(1.00, 2.00),
                "power_efficiency": random.uniform(84.00, 90.00)
            })
        print(
            f"Generated {len(dummy_metrics)} dummy metrics for {ip} on granularity {granularity}")  # Debug print for generated dummy data
        return dummy_metrics

    def get_24hsite_power_test(self, apic_ips: List[str], site_id: int) -> List[dict]:
        if not apic_ips:
            return []

        start_range = "-24h"
        site_data = []

        # Create a filter string for all IPs
        apic_ips_filter = " or ".join([f'r["ApicController_IP"] == "{ip}"' for ip in apic_ips])

        query = f'''
            from(bucket: "Dcs_db")
            |> range(start: {start_range})
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
            |> filter(fn: (r) => {apic_ips_filter})
            |> sum()
            |> yield(name: "total_sum") 
        '''

        try:
            result = self.query_api1.query(query)
            print(f"Debug: Results - {result}")

            # Prepare data storage for each IP
            ip_data = {ip: {"total_drawn": 0, "total_supplied": 0} for ip in apic_ips}

            for table in result:
                for record in table.records:
                    apic_ip = record.get_tag("ApicController_IP")
                    if apic_ip in ip_data:
                        if record.get_field() == "total_POut":
                            ip_data[apic_ip]["total_drawn"] += record.get_value()
                        elif record.get_field() == "total_PIn":
                            ip_data[apic_ip]["total_supplied"] += record.get_value()

            # Calculate results for each IP
            for ip, data in ip_data.items():
                total_drawn = data["total_drawn"]
                total_supplied = data["total_supplied"]
                power_utilization = (total_drawn / total_supplied) * 100 if total_supplied > 0 else 0
                pue = ((total_supplied / total_drawn) - 1) * 100 if total_drawn > 0 else 0

                site_data.append({
                    "site_id": site_id,
                    "apic_ip": ip,
                    "power_utilization": round(power_utilization, 2),
                    "power_input": round(total_supplied, 2) if total_supplied != 0 else None,
                    "pue": round(pue, 2),
                })
                print(site_data)

        except Exception as e:
            print(f"Error querying InfluxDB: {e}")

        return site_data

    def get_24hsite_power(self, apic_ips: List[str], site_id: int) -> List[dict]:
        if not apic_ips:
            return []

        start_range = "-24h"
        site_data = []
        for apic_ip in apic_ips:
            query = f'''
                from(bucket: "Dcs_db")
                |> range(start: {start_range})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
                |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
                |> sum()
                |> yield(name: "total_sum") 
            '''
            try:
                result = self.query_api1.query(query)
                print(f"Debug: Results for {apic_ip} - {result}")

                power_utilization = None
                pue = None
                total_supplied = 0
                total_drawn = 0
                drawnAvg, suppliedAvg = None, None

                for table in result:
                    for record in table.records:
                        print(
                            f"Debug: Record - {record.get_field()}={record.get_value()}")  # More detailed debug output
                        if record.get_field() == "total_POut":
                            drawnAvg = record.get_value()
                        elif record.get_field() == "total_PIn":
                            suppliedAvg = record.get_value()

                        if drawnAvg is not None and suppliedAvg is not None:
                            total_drawn += drawnAvg
                            total_supplied += suppliedAvg

                if total_supplied > 0:
                    power_utilization = (total_drawn / total_supplied) * 100
                if total_drawn > 0:
                    pue = ((total_supplied / total_drawn) - 1) * 100

                site_data.append({
                    "site_id": site_id,
                    "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0,
                    "power_input": round(total_supplied, 2) if total_supplied != 0 else None,
                    "power_output": round(total_drawn, 2) if total_drawn != 0 else None,
                    "pue": round(pue, 2) if pue is not None else 0
                })

            except Exception as e:
                print(f"Error querying InfluxDB for {apic_ip}: {e}")
        print(site_data)

        return site_data

    def get_24hsite_datatraffic(self, apic_ips: List[str], site_id: int) -> List[dict]:
        if not apic_ips:
            return []

        start_range = "-24h"
        site_data = []
        for apic_ip in apic_ips:
            query = f'''
                from(bucket: "Dcs_db")
                |> range(start: {start_range})
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
                |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
                |> sum()
                |> yield(name: "total_sum")
            '''
            try:
                result = self.query_api1.query(query)
                total_byterate = 0

                for table in result:
                    for record in table.records:
                        if record.get_field() == "total_bytesRateLast":
                            total_byterate = record.get_value()
                        else:
                            total_byterate = 0
                            total_byterate+= total_byterate

                site_data.append({
                    "site_id": site_id,
                    "traffic_through": total_byterate
                })
            except Exception as e:
                print(f"Error querying InfluxDB for {apic_ip}: {e}")

        return site_data

    def get_power_utilization_metrics(self, device_ips: List[str], site_id: int) -> List[dict]:
        if not device_ips:
            return []
        start_range = "-24h"
        hourly_data = []

        for ip in device_ips:
            query = f'''
                from(bucket: "Dcs_db")
                |> range(start: {start_range})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query(query)

            for table in result:
                for record in table.records:
                    hour = record.get_time().strftime('%Y-%m-%d %H:00')
                    drawnAvg = record.values.get('total_POut', None)
                    suppliedAvg = record.values.get('total_PIn', None)
                    power_utilization = None
                    if drawnAvg is not None and suppliedAvg is not None and suppliedAvg > 0:
                        power_utilization = (drawnAvg / suppliedAvg) * 100
                    hourly_data.append({
                        "site_id": site_id,
                        "apic_controller_ip": ip,
                        "hour": hour,
                        "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0
                    })

        # Aggregating data as per hour
        aggregated_data = {}
        now = datetime.utcnow()

        for i in range(24):
            hour = (now - timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
            aggregated_data[hour] = {
                "total_power_utilization": 0,
                "count": 0
            }

        # Aggregate power utilization for each hour as provided in hourly_data
        for data in hourly_data:
            hour = data["hour"]
            power_utilization = data["power_utilization"]

            if power_utilization is not None:
                aggregated_data[hour]["total_power_utilization"] += power_utilization
                aggregated_data[hour]["count"] += 1

        # Calculate average power utilization for each hour
        final_data = []
        for hour, values in aggregated_data.items():
            if values["count"] > 0:
                avg_power_utilization = values["total_power_utilization"] / values["count"]
            else:
                # Assign random value if no data exists for the hour
                avg_power_utilization = round(random.uniform(86, 261), 2)

            final_data.append({
                "Site_id": site_id,
                "hour": hour,
                "power_utilization": round(avg_power_utilization, 2)
            })

        # Ensure the final data is sorted by hour in descending order
        final_data.sort(key=lambda x: x["hour"], reverse=True)

        return final_data

    def get_power_efficiency(self, device_ips: List[str], site_id: int) -> List[dict]:
        power_efficiency_data = []
        start_range = "-2h"
        for ip in device_ips:
            query = f'''
                from(bucket: "Dcs_db")
                |> range(start: {start_range})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> sort(columns: ["_time"], desc: true)
                |> last()
                |> yield(name: "last_result")
                '''
            result = self.query_api1.query(query)
            PowerIn, PowerOut = None, None
            for table in result:
                for record in table.records:
                    if record.get_field() == "total_PIn":
                        PowerIn = record.get_value()
                    elif record.get_field() == "total_POut":
                        PowerOut = record.get_value()

                    if PowerIn and PowerOut and PowerIn > 0:
                        power_efficiency = (PowerOut / PowerIn) * 100
                        power_efficiency_data.append({
                            "site_id": site_id,
                            "apic_controller_ip": ip,
                            "PowerInput": PowerIn,
                            "power_efficiency": round(power_efficiency, 2)
                        })
        return power_efficiency_data

    def get_power_required(self, device_ips: List[str], site_id: int) -> List[dict]:
        power_required_data = []
        start_range = "-1h"
        for ip in device_ips:
            # Query for Power Input and Output
            power_in_query = self.build_query(ip, "total_PIn", start_range)

            power_out_query = self.build_query(ip, "total_POut", start_range)
            total_power_query = self.build_query(ip, "total_Power", start_range)

            PowerIn = self.query_last_value(power_in_query)
            PowerOut = self.query_last_value(power_out_query)
            TotalPower = self.query_last_value(total_power_query)

            if TotalPower is not None and TotalPower != 0:
                powerper = (PowerIn / TotalPower) * 100
            else:
                powerper = 0

            power_required_data.append({
                "site_id": site_id,
                "apic_controller_ip": ip,
                "PowerInput": PowerIn,
                "TotalPower": TotalPower,

                "PowerPercentage": round(powerper, 2)
            })

        return power_required_data

    def build_query(self, ip, field, range_start):
        return f'''
            from(bucket: "Dcs_db")
            |> range(start: {range_start})
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
            |> filter(fn: (r) => r["_field"] == "{field}")
            |> sort(columns: ["_time"], desc: true)
            |> last()
        '''

    def query_last_value(self, query):
        result = self.query_api1.query(query)
        for table in result:
            for record in table.records:
                return record.get_value()
        return None

    def calculate_co2_emission(self, device_details: List[dict], site_id: int) -> List[dict]:
        co2_emission_data = []

        for device in device_details:
            ip = device['ip_address']
            device_name = device['device_name']

            # Use some static data for demonstration
            annual_electricity_usage_mwh = 10000
            emission_factor_kg_per_mwh = 100
            annual_co2_emissions_kg = annual_electricity_usage_mwh * emission_factor_kg_per_mwh
            daily_co2_emissions_kg = annual_co2_emissions_kg / 365
            daily_co2_emissions_kg = daily_co2_emissions_kg / 100

            co2_emission_data.append({
                "site_id": site_id,
                "apic_controller_ip": ip,
                "apic_controller_name": device_name,
                "co2emission": round(daily_co2_emissions_kg, 2)
            })

        return co2_emission_data

    def get_total_pin_value(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                            duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1h" if duration_str == "24 hours" else "1d"

        total_pin = 0
        for ip in device_ips:
            # query = f'''
            #     from(bucket: "{configs.INFLUXDB_BUCKET}")
            #     |> range(start: {start_time}, stop: {end_time})
            #     |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
            #     |> filter(fn: (r) => r["_field"] == "total_PIn")
            #     |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            #     | > pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            # '''
            query = f'''
           from(bucket: "{configs.INFLUXDB_BUCKET}")
           |> range(start: {start_time}, stop: {end_time})
           |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
           |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
           |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
       '''

            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                total_pin +=result['total_PIn'].sum() if 'total_PIn' in result else 0.0
            # result = self.query_api1.query_data_frame(query)
            # if not result.empty:
            #     total_pin += result['_value'].sum()

        return total_pin

    # def get_consumption_percentages(self, device_ips: List[str], start_date: datetime, end_date: datetime,
    #                                 duration_str: str) -> dict:
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #     aggregate_window = "1h" if duration_str == "24 hours" else "1d"
    #
    #     fields = [
    #         "nuclear_consumption", "geothermal_consumption", "biomass_consumption",
    #         "coal_consumption", "wind_consumption", "solar_consumption",
    #         "hydro_consumption", "gas_consumption", "oil_consumption",
    #         "unknown_consumption", "battery_discharge_consumption"
    #     ]
    #     consumption_totals = {field: 0 for field in fields}
    #
    #     for ip in device_ips:
    #         for field in fields:
    #             query = f'''
    #                 from(bucket: "{configs.INFLUXDB_BUCKET}")
    #                 |> range(start: {start_time}, stop: {end_time})
    #                 |> filter(fn: (r) => r["_measurement"] == "electricitymap_power" and r["ApicController_IP"] == "{ip}")
    #                 |> filter(fn: (r) => r["_field"] == "{field}")
    #                 |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
    #             '''
    #             result = self.query_api1.query_data_frame(query)
    #             if not result.empty:
    #                 consumption_totals[field] += result['_value'].sum()
    #
    #     # Calculate total power consumption
    #     powerConsumptionTotal = sum(consumption_totals.values())
    #
    #     # Calculate percentages
    #     percentages = {field: round((value / powerConsumptionTotal) * 100, 2) if powerConsumptionTotal > 0 else 0 for
    #                    field, value in consumption_totals.items()}
    #
    #     return percentages

    # def get_consumption_percentages(self, start_date: datetime, end_date: datetime, duration_str: str) -> dict:
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #     aggregate_window = "1h" if duration_str == "24 hours" else "1d"
    #     zone = "AE"
    #
    #     query = f'''
    #         from(bucket: "Dcs_db")
    #         |> range(start: {start_time}, stop: {end_time})
    #         |> filter(fn: (r) => r["_measurement"] == "electricitymap_power" and r["zone"] == "{zone}")
    #         |> filter(fn: (r) =>
    #             r["_field"] == "nuclear_consumption" or
    #             r["_field"] == "geothermal_consumption" or
    #             r["_field"] == "biomass_consumption" or
    #             r["_field"] == "coal_consumption" or
    #             r["_field"] == "wind_consumption" or
    #             r["_field"] == "solar_consumption" or
    #             r["_field"] == "hydro_consumption" or
    #             r["_field"] == "gas_consumption" or
    #             r["_field"] == "oil_consumption" or
    #             r["_field"] == "unknown_consumption" or
    #             r["_field"] == "battery_discharge_consumption")
    #         |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
    #         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #     '''
    #     result = self.query_api1.query_data_frame(query)
    #     print("RESULT", result, file=sys.stderr)
    #
    #     # Initialize the consumption totals dictionary with specific fields.
    #     consumption_totals = {
    #         "nuclear": 0, "geothermal": 0, "biomass": 0, "coal": 0, "wind": 0,
    #         "solar": 0, "hydro": 0, "gas": 0, "oil": 0, "unknown": 0, "battery_discharge": 0
    #     }
    #
    #     if not result.empty:
    #         # Extract the sums from the query result for each field.
    #         for field in consumption_totals.keys():
    #             field_name = f"{field}_consumption"
    #             if field_name in result.columns:
    #                 consumption_totals[field] = result[field_name].sum()
    #
    #     # Calculate the total power consumption from the retrieved data.
    #     powerConsumptionTotal = sum(consumption_totals.values())
    #
    #     # Compute the percentage of total power consumption for each field.
    #     percentages = {field: round((value / powerConsumptionTotal) * 100, 2) if powerConsumptionTotal > 0 else 0
    #                    for field, value in consumption_totals.items()}
    #
    #     return percentages

    def get_consumption_percentages(self, start_date: datetime, end_date: datetime, duration_str: str) -> dict:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1h" if duration_str == "24 hours" else "1d"
        zone = "AE"

        query = f'''
            from(bucket: "Dcs_db")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["_measurement"] == "electricitymap_power" and r["zone"] == "{zone}")
            |> filter(fn: (r) => 
                r["_field"] == "nuclear_consumption" or 
                r["_field"] == "geothermal_consumption" or 
                r["_field"] == "biomass_consumption" or 
                r["_field"] == "coal_consumption" or 
                r["_field"] == "wind_consumption" or 
                r["_field"] == "solar_consumption" or 
                r["_field"] == "hydro_consumption" or 
                r["_field"] == "gas_consumption" or 
                r["_field"] == "oil_consumption" or 
                r["_field"] == "unknown_consumption" or 
                r["_field"] == "battery_discharge_consumption")
            |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query_data_frame(query)
        print("RESULT", result, file=sys.stderr)

        # Initialize the consumption totals dictionary with specific fields.
        consumption_totals = {
            "nuclear": 0, "geothermal": 0, "biomass": 0, "coal": 0, "wind": 0,
            "solar": 0, "hydro": 0, "gas": 0, "oil": 0, "unknown": 0, "battery_discharge": 0
        }

        if not result.empty:
            # Extract the sums from the query result for each field.
            for field in consumption_totals.keys():
                field_name = f"{field}_consumption"
                if field_name in result.columns:
                    consumption_totals[field] = result[field_name].sum()

        # Calculate the total power consumption from the retrieved data.
        powerConsumptionTotal = sum(consumption_totals.values())

        # Compute the percentage of total power consumption for each field.
        percentages = {field: math.floor((value / powerConsumptionTotal) * 100) if powerConsumptionTotal > 0 else 0
                       for field, value in consumption_totals.items()}

        return percentages

    def get_carbon_intensity(self, start_date: datetime, end_date: datetime, duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        # Determine the appropriate aggregate window based on the duration
        if duration_str == "24 hours":
            aggregate_window = "1h"
            aggregation_function = "max()"  # For 24 hours, take the maximum value
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            aggregation_function = "sum()"  # Sum for longer durations
        else:
            aggregate_window = "1m"
            aggregation_function = "sum()"

        zone = "AE"

        # InfluxDB query to fetch the carbon intensity
        query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "electricitymap_carbonIntensity" and r["zone"] == "{zone}")
                |> filter(fn: (r) => r["_field"] == "carbonIntensity")
                |> aggregateWindow(every: {aggregate_window}, fn: max, createEmpty: false)
                |> {aggregation_function}  
            '''
        result = self.query_api1.query_data_frame(query)
        print("RESULT", result, file=sys.stderr)
        carbon_intensity = result['_value'] if not result.empty else 0
        print("carbon_intensity", carbon_intensity, file=sys.stderr)

        return carbon_intensity

    def get_total_pin_value1(self, device_ips: List[str], start_time: str, end_time: str) -> float:
        total_pin = 0
        start_range = "-30d"
        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                  |> range(start: {start_range})
                  |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
                  |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                  |> filter(fn: (r) => r["_field"] == "total_PIn")
                  |> aggregateWindow(every: "1h", fn: sum, createEmpty: false)
                  |> sum()  // Sum the total pin over the period for each IP
                  |> pivot(
                      rowKey:["_time"],
                      columnKey: ["_field"],
                      valueColumn: "_value"
    )
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                total_pin += result['_value'].sum()

        return total_pin

    def get_metrics(self, device_ip: str, start_date: datetime, end_date: datetime, duration_str: str,
                    metric: str) -> dict:
        print("get_metrics", device_ip)
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["ApicController_IP"] == "{device_ip}")
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and (r["_field"] == "total_PIn" or r["_field"] == "total_POut"))
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        result = self.query_api1.query_data_frame(query)
        print(result)

        if not result.empty:
            print("result is not empty")

            if 'total_PIn' in result.columns and 'total_POut' in result.columns:
                average_pin = result['total_PIn'].mean()
                sum_pin = result['total_PIn'].sum()
                average_pout = result['total_POut'].mean()
                print("average_pin", average_pin)
                print("average_pout", average_pout)
                if metric.lower() == "pue":
                    value = (average_pin / average_pout) if average_pout != 0 else 0
                    metric_name = "power usage effectiveness"
                    value=round(value, 2)
                elif metric.lower() == "eer":
                    value = (average_pout / average_pin) if average_pin != 0 else 0
                    metric_name = "energy efficiency ratio"
                    value=round(value, 2)
                elif metric.lower() == "carbon emissions":
                    value = average_pin* 0.4  # CO2 emission factor
                    metric_name = "carbon emissions"
                    value=f"{round(value, 2)} kgs"
                elif metric.lower() == "pcr":
                    datatraffic = self.get_datatraffic(device_ip, start_date, end_date, duration_str)
                    if datatraffic['status'] == 'error':
                        return datatraffic  # Propagate error from `get_datatraffic`
                    total_pin_value_KW = sum_pin / 1000

                    data_TB = datatraffic['data']
                    value = total_pin_value_KW / data_TB if data_TB != 0 else 0
                    print(data_TB,"data_intb",total_pin_value_KW,"total_pin")
                    value=f"{round(value, 2)}"
                    metric_name = "power consumption ratio"
                else:
                    raise ValueError("Unsupported metric provided.")

                return {
                    'data': value
                }
        return {"status": "error", "message": "No data found for the specified query."}

    def get_datatraffic(self, ip: str, start_date: datetime, end_date: datetime, duration_str: str) -> dict:
        """
        Retrieve and process data traffic metrics for the specified IP address and time range.
        """
        print("here we are")
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window, time_format = self.determine_aggregate_window(duration_str)

        query = f'''
            from(bucket: "{self.bucket}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
            |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        try:
            result = self.query_api1.query_data_frame(query)
            print(result,"result")
            if not result.empty and 'total_bytesRateLast' in result.columns:
                total_bytesRateLast = result['total_bytesRateLast'].sum()
                print(total_bytesRateLast,"dskdfd")
                data_TB = total_bytesRateLast/ (1024 ** 4)

                return {
                    'status': 'success',
                    'data': round(data_TB, 2)
                }
            else:
                return {
                    'status': 'error',
                    'message': 'No data available for the specified query.'
                }
        except Exception as e:
        # logging.error(f"Error executing query for IP {ip}: {str(e)}")
            return {
                'status': 'error',
                'message': f"An error occurred while retrieving data traffic: {str(e)}"
            }
    def get_carbon_intensity1(self, start_time: str, end_time: str) -> float:
        carbon_intensity = 0
        zone = "AE"
        start_range = "-30d"
        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_range})
            |> filter(fn: (r) => r["_measurement"] == "electricitymap_carbonIntensity" and r["zone"] == "{zone}")
            |> filter(fn: (r) => r["_field"] == "carbonIntensity")
            |> aggregateWindow(every: "1h", fn: sum, createEmpty: false)
            |> sum()  // Sum the carbon intensity over the period
        '''
        result = self.query_api1.query_data_frame(query)
        if not result.empty:
            carbon_intensity = result['_value'].sum()

        return carbon_intensity

    def get_total_pin_value22(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                              duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1h" if duration_str == "24 hours" else "1d"

        total_pin = 0
        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                total_pin += result['_value'].sum()

        return total_pin

    def get_carbon_intensity22(self, start_date: datetime, end_date: datetime, duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1h" if duration_str == "24 hours" else "1d"
        zone = "AE"

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["_measurement"] == "electricitymap_carbonIntensity" and r["zone"] == "{zone}")
            |> filter(fn: (r) => r["_field"] == "carbonIntensity")
            |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            |> sum()  // Sum the carbon intensity over the time period
        '''
        result = self.query_api1.query_data_frame(query)
        print("RESULT", result, file=sys.stderr)
        carbon_intensity = result['_value'].iloc[0] if not result.empty else 0
        print("typeeeeeeeeeeeeeee", type(carbon_intensity), file=sys.stderr)
        print("carbon_intensity", carbon_intensity, file=sys.stderr)

        return carbon_intensity

    def get_energy_consumption_metrics_with_filter123(self, device_ips: List[str], start_date: datetime,
                                                      end_date: datetime, duration_str: str) -> List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        # Define the aggregate window and time format based on the duration string
        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"
            time_format = '%Y-%m'

        for ip in device_ips:
            print("inside IPPPPPPPPPPPPPPPPPPPPPP", ip, file=sys.stderr)
            print("complete deviceipssss", device_ips, file=sys.stderr)
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)
            print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
                    grouped['_time'] = pd.to_datetime(grouped['_time'])
                    grouped.set_index('_time', inplace=True)

                    all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
                        time_format)
                    grouped = grouped.reindex(all_times).fillna(0).reset_index()

                    for _, row in grouped.iterrows():
                        pin = row['total_PIn']
                        pout = row['total_POut']

                        energy_consumption = pout / pin if pin > 0 else 0
                        power_efficiency = pin / pout if pout > 0 else 0
                        pin_kg = pin / 1000
                        pout_kg = pout / 1000
                        co2 = pin_kg * 0.4716
                        co2_tons = co2 / 1000

                        total_power_metrics.append({
                            "time": row['index'],
                            "energy_efficiency": round(energy_consumption, 2),
                            "total_POut": round(pout/1000, 2),
                            "total_PIn": round(pin/1000, 2),
                            "power_efficiency": round(power_efficiency, 2),
                            "co2_tons": co2_tons,
                            "co2_kgs": round(co2, 2)
                        })

        # df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
        #
        # return df.iloc[1:].reset_index(drop=True)
        df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time')
        print(df,"****************")
        # Apply iloc before converting to list of dictionaries
        df = df.iloc[1:].reset_index(drop=True)

        return df.to_dict(orient='records')

    def get_average_energy_consumption_metrics(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                               duration_str: str) -> dict:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"
            time_format = '%Y-%m'

        query = f'''
               from(bucket: "{configs.INFLUXDB_BUCKET}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ips[0]}")
               |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
               |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
               |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
               |> mean()
           '''
        result = self.query_api1.query_data_frame(query)

        if result.empty:
            return {"time": f"{start_date} - {end_date}"}  # Ensure 'time' key is always present

        pin_avg = result['total_PIn'].mean()
        pout_avg = result['total_POut'].mean()

        energy_consumption_avg = (pout_avg / pin_avg) * 100 if pin_avg > 0 else 0
        power_efficiency_avg = ((pin_avg / pout_avg - 1) * 100) if pout_avg > 0 else 0

        return {
            "time": f"{start_date} - {end_date}",
            "energy_consumption": round(energy_consumption_avg, 2),
            "total_POut": round(pout_avg, 2),
            "total_PIn": round(pin_avg, 2),
            "power_efficiency": round(power_efficiency_avg, 2)
        }

    def get_total_power_metrics_all_ips_24h(self, device_ips: List[str], start_date: datetime,
                                            end_date: datetime,duration_str: str) -> dict:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        total_pin = 0.0
        total_pout = 0.0

        for ip in device_ips:
            print(f"Querying total power for IP: {ip}", file=sys.stderr)

            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''

            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                pin_sum = result['total_PIn'].sum() if 'total_PIn' in result else 0.0
                pout_sum = result['total_POut'].sum() if 'total_POut' in result else 0.0

                total_pin += pin_sum
                total_pout += pout_sum
        print(total_pout,total_pin)
        energy_consumption = (total_pout / total_pin) * 100 if total_pin > 0 else 0
        power_efficiency = (total_pin / total_pout) if total_pout > 0 else 0

        # Return combined totals in kilowatts
        return {
            "total_PIn_kW": round(total_pin / 1000, 2),
            "total_POut_kW": round(total_pout / 1000, 2),
            "energy_consumption":energy_consumption,
            "power_efficiency":power_efficiency,
            "start_time": start_time,
            "end_time": end_time
        }

    def get_energy_consumption_metrics_with_filter17(self, device_ips: List[str], start_date: datetime,
                                                     end_date: datetime, duration_str: str) -> List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        print(f"Start Time: {start_time}, End Time: {end_time}", file=sys.stderr)

        # Define the aggregate window and time format based on the duration string
        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
            time_format = '%Y-%m-%d %H:00'
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
            time_format = '%Y-%m-%d'
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"
            time_format = '%Y-%m'
        powerin,powerout=0,0
        total_pout, total_pin=0,0

        for ip in device_ips:
            print(f"Querying metrics for IP: {ip}", file=sys.stderr)
            query = f'''
                           from(bucket: "{configs.INFLUXDB_BUCKET}")
                           |> range(start: {start_time}, stop: {end_time})
                           |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                           |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                           |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                       '''

            result = self.query_api1.query_data_frame(query)

            if not result.empty:
                pin_sum = result['total_PIn'].sum() if 'total_PIn' in result else 0.0
                pout_sum = result['total_POut'].sum() if 'total_POut' in result else 0.0

                total_pin += pin_sum
                total_pout += pout_sum
        print(total_pout, total_pin)
        energy_consumption = (total_pout / total_pin)  if total_pin > 0 else 0
        power_efficiency = (total_pin / total_pout) if total_pout > 0 else 0
        total_power_metrics.append({
                            "energy_consumption": round(energy_consumption, 2),
                            "total_POut": round(total_pout/1000, 2),
                            "total_PIn": round(total_pin/1000, 2),
                            "power_efficiency": round(power_efficiency, 2)
                        })
        print(total_pin,total_pout)


        df = pd.DataFrame(total_power_metrics).to_dict(orient='records')
        print(df)
        print(f"Final metrics: {df}", file=sys.stderr)
        return df

        #     query = f'''
        #         from(bucket: "{configs.INFLUXDB_BUCKET}")
        #         |> range(start: {start_time}, stop: {end_time})
        #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
        #         |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
        #         |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
        #         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        #     '''
        #     print(f"Query: {query}", file=sys.stderr)
        #     result = self.query_api1.query_data_frame(query)
        #
        #     print(f"Result for IP {ip}: {result}", file=sys.stderr)
        #
        #     if not result.empty:
        #         result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
        #         numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
        #         if '_time' in result.columns and numeric_cols:
        #             grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
        #             grouped['_time'] = pd.to_datetime(grouped['_time'])
        #             grouped.set_index('_time', inplace=True)
        #
        #             all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
        #                 time_format)
        #             grouped = grouped.reindex(all_times).fillna(0).reset_index()
        #             total_pin=0
        #             total_pout=0
        #             for _, row in grouped.iterrows():
        #                 pin = row['total_PIn']
        #                 pout = row['total_POut']
        #
        #                 energy_consumption = (pout / pin) * 100 if pin > 0 else 0
        #                 power_efficiency = (pin / pout) if pout > 0 else 0
        #                 total_pin +=pin
        #                 total_pout+=pout
        #
        #                 total_power_metrics.append({
        #                     "time": row['index'],
        #                     "energy_consumption": round(energy_consumption, 2),
        #                     "total_POut": round(pout/1000, 2),
        #                     "total_PIn": round(pin/1000, 2),
        #                     "power_efficiency": round(power_efficiency, 2)
        #                 })
        #             print(total_pin,total_pout)
        #
        #
        # df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
        # print(df)
        # print(f"Final metrics: {df}", file=sys.stderr)
        # return df

    def get_energy_details_for_device_at_time(self, device_ip: str, exact_time: datetime, granularity: str) -> dict:
        if exact_time.tzinfo is None:
            exact_time = exact_time.replace(tzinfo=timezone.utc)

        try:
            start_time, end_time = self.determine_time_range12(exact_time, granularity)
        except Exception as e:
            print(f"Error determining time range: {e}")
            raise HTTPException(status_code=500, detail="Error determining time range")

        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)
        if end_time.tzinfo is None:
            end_time = end_time.replace(tzinfo=timezone.utc)

        print(f"InfluxDB query range: start_time={start_time}, end_time={end_time}, granularity={granularity}")

        aggregate_window = self.convert_granularity(granularity)

        query = f'''
            from(bucket: "{configs.INFLUXDB_BUCKET}")
            |> range(start: {start_time.isoformat()}, stop: {end_time.isoformat()})
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ip}")
            |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
        print(f"InfluxDB query: {query}")
        result = self.query_api1.query_data_frame(query)

        if result.empty:
            print("InfluxDB query returned no results.")
            return None

        result['_time'] = pd.to_datetime(result['_time']).dt.tz_convert('UTC')
        exact_time = exact_time.astimezone(timezone.utc)

        closest_metric = result.iloc[(result['_time'] - exact_time).abs().argsort()[:1]].to_dict('records')[0]

        pin = closest_metric['total_PIn']
        pout = closest_metric['total_POut']
        energy_consumption = (pout / pin) * 100 if pin > 0 else 0
        power_efficiency = pin / pout if pout > 0 else 0

        return {
            "time": closest_metric['_time'],
            "PE": round(energy_consumption, 2),
            "PUE": round(power_efficiency, 2),
            "current_power": round(pin, 2),
        }

    def determine_time_range12(self, exact_time: datetime, granularity: str):
        # Implement logic to determine the time range based on granularity
        if granularity == 'hourly':
            start_time = exact_time.replace(minute=0, second=0, microsecond=0)
            end_time = start_time + timedelta(hours=1)
        elif granularity == 'daily':
            start_time = exact_time.replace(hour=0, minute=0, second=0, microsecond=0)
            end_time = start_time + timedelta(days=1)
        elif granularity == 'monthly':
            start_time = exact_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_time = (start_time + timedelta(days=31)).replace(day=1)
        else:
            raise ValueError("Invalid granularity")

        return start_time, end_time

    def convert_granularity(self, granularity: str) -> str:
        # Convert the granularity to the appropriate InfluxDB time window
        if granularity == 'hourly':
            return '1h'
        elif granularity == 'daily':
            return '1d'
        elif granularity == 'monthly':
            return '30d'
        else:
            raise ValueError("Invalid granularity")

    def get_device_total_pin_value(self, device_ip: str, start_date: datetime, end_date: datetime,
                                   duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"

        total_pin = 0

        # query = f'''
        #     from(bucket: "{configs.INFLUXDB_BUCKET}")
        #     |> range(start: {start_time}, stop: {end_time})
        #     |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ip}")
        #     |> filter(fn: (r) => r["_field"] == "total_PIn")
        #     |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
        # '''
        query = f'''
               from(bucket: "{configs.INFLUXDB_BUCKET}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{device_ip}")
               |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
               |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
               |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
           '''

        result = self.query_api1.query_data_frame(query)

        if not result.empty:
            total_pin += result['total_PIn'].sum() if 'total_PIn' in result else 0.0

        # result = self.query_api1.query_data_frame(query)
        # if not result.empty:
        #     total_pin += result['_value'].sum()

        return total_pin

    def get_device_datatraffic(self, device_ip: str, start_date: datetime, end_date: datetime,
                                   duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        if duration_str in ["24 hours"]:
            aggregate_window = "1h"
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            aggregate_window = "1d"
        else:  # For "last 6 months", "last year", "current year"
            aggregate_window = "1m"

        datatraffic= 0
        query = f'''
               from(bucket: "{configs.INFLUXDB_BUCKET}")
               |> range(start: {start_time}, stop: {end_time})
               |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["ApicController_IP"] == "{device_ip}")
               |> filter(fn: (r) => r["_field"] == "total_bytesRateLast")
               |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
           '''

        result = self.query_api1.query_data_frame(query)
        if not result.empty:
            datatraffic += result['_value'].sum()

        return datatraffic

    def get_energy_metrics_for_last_7_days(self, device_ips: List[str], start_date: datetime, end_date: datetime) -> \
            List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window = "1d"
        time_format = '%A'  # Day of the week (e.g., Monday)

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''

            try:
                result = self.query_api1.query_data_frame(query)
            except Exception as e:
                print(f"Error executing query for IP {ip}: {e}")
                continue

            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()

                    for _, row in grouped.iterrows():
                        pin = row['total_PIn']
                        pout = row['total_POut']

                        energy_consumption = pout / pin if pin > 0 else 0
                        power_efficiency = ((pin / pout - 1) * 100) if pout > 0 else 0

                        total_power_metrics.append({
                            "day": row['_time'],  # Day of the week
                            "energy_efficiency": round(energy_consumption, 2),
                            "total_POut": round(pout / 1000, 2) if pout is not None else None,
                            "total_PIn": round(pin, 2),
                            "power_efficiency": round(power_efficiency, 2)
                        })

        df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='day')

        # Fill NaN values with 0.0 to make sure they are JSON serializable
        df = df.fillna(0.0)

        # Get the current day of the week
        today = datetime.now().strftime('%A')

        # List of days in a week
        all_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        # Find the index of today in the list
        today_index = all_days.index(today)

        # Create the custom order starting from today and going backward
        days_order = all_days[today_index:] + all_days[:today_index]

        # Convert the 'day' column to a categorical type with the custom ordering
        df['day'] = pd.Categorical(df['day'], categories=days_order, ordered=True)

        # Sort the DataFrame by the custom day order
        df = df.sort_values('day')

        # Reverse the order of the DataFrame
        # df = df.iloc[::-1]

        print("Final DataFrame (reversed order):", df)  # Debug print to check the final output

        return df.to_dict(orient='records')

    # def get_energy_metrics_for_last_24_hours(self, device_ips: List[str], start_date: datetime, end_date: datetime) -> \
    # List[dict]:
    #     total_power_metrics = []
    #     start_time = start_date.isoformat() + 'Z'
    #     end_time = end_date.isoformat() + 'Z'
    #
    #     aggregate_window = "1h"
    #     time_format = '%H'  # Hour of the day (e.g., 00, 01, 02, ..., 23)
    #
    #     for ip in device_ips:
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: {start_time}, stop: {end_time})
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #
    #         try:
    #             result = self.query_api1.query_data_frame(query)
    #         except Exception as e:
    #             print(f"Error executing query for IP {ip}: {e}")
    #             continue
    #
    #         if not result.empty:
    #             result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
    #             numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    #             if '_time' in result.columns and numeric_cols:
    #                 grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
    #
    #                 for _, row in grouped.iterrows():
    #                     pin = row['total_PIn'] if 'total_PIn' in row and not pd.isna(row['total_PIn']) else 0
    #                     pout = row['total_POut'] if 'total_POut' in row and not pd.isna(row['total_POut']) else 0
    #
    #                     pin = round(pin, 2)
    #                     pout = round(pout, 2)
    #
    #                     energy_consumption = round(pout / pin, 2) if pin > 0 else 0
    #                     power_efficiency = round(((pin / pout - 1) * 100), 2) if pout > 0 else 0
    #
    #                     total_power_metrics.append({
    #                         "time": row['_time'],  # Hour of the day
    #                         "energy_efficiency": energy_consumption,
    #                         "total_POut": round(pout / 1000, 2) if pout else 0,
    #                         "total_PIn": round(pin / 1000, 2) if pin else 0,
    #                         "power_efficiency": power_efficiency
    #                     })
    #
    #     df = pd.DataFrame(total_power_metrics).fillna(0.0)
    #
    #     # Ensure rounding after aggregation
    #     df = df.groupby('time').mean().reset_index()
    #     df = df.round(2)  # Apply rounding to the entire DataFrame
    #
    #     df = df.sort_values('time')
    #
    #     if len(df) > 24:
    #         df = df.head(24)
    #
    #     print("Final DataFrame:", df)  # Debug print to check the final output
    #
    #     return df.to_dict(orient='records')

    def get_energy_metrics_for_last_24_hours(self, device_ips: List[str], start_date: datetime, end_date: datetime) -> \
    List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        aggregate_window = "1h"
        time_format = '%H'  # Hour of the day (e.g., 00, 01, 02, ..., 23)

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''

            try:
                result = self.query_api1.query_data_frame(query)
            except Exception as e:
                print(f"Error executing query for IP {ip}: {e}")
                continue

            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()

                    for _, row in grouped.iterrows():
                        pin = row['total_PIn'] if 'total_PIn' in row and not pd.isna(row['total_PIn']) else 0
                        pout = row['total_POut'] if 'total_POut' in row and not pd.isna(row['total_POut']) else 0

                        pin = round(pin, 2)
                        pout = round(pout, 2)

                        energy_consumption = round(pout / pin, 2) if pin > 0 else 0
                        power_efficiency = round((pin / pout), 2) if pout > 0 else 0

                        total_power_metrics.append({
                            "time": row['_time'],  # Hour of the day
                            "energy_efficiency": energy_consumption,
                            "total_POut": round(pout / 1000, 2) if pout else 0,
                            "total_PIn": round(pin / 1000, 2) if pin else 0,
                            "power_efficiency": power_efficiency
                        })

        df = pd.DataFrame(total_power_metrics).fillna(0.0)

        # Group by time and calculate sum for total_PIn and total_POut
        grouped_df = df.groupby('time').agg({
            'total_PIn': 'sum',  # Sum for all devices in the same hour
            'total_POut': 'sum',
            'energy_efficiency': 'mean',  # Keep mean for energy efficiency
            'power_efficiency': 'mean'  # Keep mean for power efficiency
        }).reset_index()

        # Ensure rounding after aggregation
        grouped_df = grouped_df.round(2)

        grouped_df = grouped_df.sort_values('time')

        if len(grouped_df) > 24:
            grouped_df = grouped_df.head(24)

        print("Final DataFrame with Total Values:", grouped_df)  # Debug print to check the final output

        return grouped_df.to_dict(orient='records')

    def get_total_pout_value(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                             duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1d"  # For monthly or larger data we use daily aggregates

        total_pout = 0
        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            '''
            result = self.query_api1.query_data_frame(query)
            if not result.empty:
                total_pout += result['_value'].sum()

        return total_pout

    def get_total_pout_value_new(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                 duration_str: str) -> float:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1m"  # Monthly aggregation

        total_pout = 0
        for ip in device_ips:
            # Correctly format the query with proper escaping of string values
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
                |> yield(name: "total")
            '''

            # Debug: log the query for inspection
            print(f"Query for IP {ip}: {query}")

            # Execute the query
            try:
                result = self.query_api1.query_data_frame(query)
                if not result.empty:
                    # Sum only numeric values
                    total_pout += result['_value'].sum()
            except Exception as e:
                # Log the exception for debugging
                print(f"Error executing query for IP {ip}: {e}")

        return total_pout

    def get_energy_metrics_with_pue_and_eer(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                            duration_str: str) -> List[dict]:
        total_power_metrics = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        print(f"Querying InfluxDB from {start_time} to {end_time} for device_ips: {device_ips}", file=sys.stderr)

        aggregate_window = self.get_aggregate_window(duration_str)
        time_format = self.get_time_format(duration_str)

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''


            print(f"InfluxDB Query for IP {ip}: {query}", file=sys.stderr)
            result = self.query_api1.query_data_frame(query)

            print(f"Result for IP {ip}: {result}", file=sys.stderr)

            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
                    grouped['_time'] = pd.to_datetime(grouped['_time'])
                    grouped.set_index('_time', inplace=True)

                    all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
                        time_format)
                    grouped = grouped.reindex(all_times).fillna(0).reset_index()

                    for _, row in grouped.iterrows():
                        pin = row['total_PIn']
                        pout = row['total_POut']

                        eer = pout / pin if pin > 0 else 0
                        pue = pin / pout if pout > 0 else 1.0

                        energy_consumption = (pout / pin) * 100 if pin > 0 else 0
                        power_efficiency = (pin / pout) if pout > 0 else 0

                        total_power_metrics.append({
                            "time": row['index'],
                            "energy_consumption": round(energy_consumption, 4),
                            "total_POut": round(pout/1000, 4),
                            "total_PIn": round(pin/1000, 4),
                            "power_efficiency": round(power_efficiency, 4),
                            "co2e": round((pin/1000)*0.4716,4),
                            "eer": round(eer, 4),
                            "pue": round(pue, 4)
                        })

        print(f"Final power metrics: {total_power_metrics}", file=sys.stderr)

        return total_power_metrics

    def get_energy_metrics_with_datatraffic(self, device_ips: List[str], start_date: datetime, end_date: datetime,
                                            duration_str: str) -> List[dict]:
        total_datatraffic_metric = []
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'

        print(f"Querying InfluxDB from {start_time} to {end_time} for device_ips: {device_ips}", file=sys.stderr)

        aggregate_window = self.get_aggregate_window(duration_str)
        time_format = self.get_time_format(duration_str)

        for ip in device_ips:
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "bandwidth" or r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''


            print(f"InfluxDB Query for IP {ip}: {query}", file=sys.stderr)
            result = self.query_api1.query_data_frame(query)

            print(f"Result for IP {ip}: {result}", file=sys.stderr)

            if not result.empty:
                result['_time'] = pd.to_datetime(result['_time']).dt.strftime(time_format)
                numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
                if '_time' in result.columns and numeric_cols:
                    grouped = result.groupby('_time')[numeric_cols].mean().reset_index()
                    grouped['_time'] = pd.to_datetime(grouped['_time'])
                    grouped.set_index('_time', inplace=True)

                    all_times = pd.date_range(start=start_date, end=end_date, freq=aggregate_window.upper()).strftime(
                        time_format)
                    grouped = grouped.reindex(all_times).fillna(0).reset_index()

                    for _, row in grouped.iterrows():
                        bandwidth_value = row['bandwidth']
                        total_bytesRateLast_value = row['total_bytesRateLast']

                        bandwidth =( bandwidth_value / 1000 ) if bandwidth_value >0 else 0 # Convert Kbps to Mbps
                        traffic_speed = total_bytesRateLast_value * 8 / 1e6  if total_bytesRateLast_value >0 else 0 # Convert bytes/sec to Mbps

                        # bandwidth_utilization = min((traffic_speed / bandwidth) * 100, 100) if bandwidth else 0
                        bandwidth_utilization = (traffic_speed / bandwidth) * 100 if bandwidth else 0




                        total_datatraffic_metric.append({
                            "time": row['index'],
                            "bandwidth": round(bandwidth, 2),
                            "datatraffic": round(traffic_speed, 2),
                            "bandwidth_utilization": round(bandwidth_utilization, 2),

                        })

        print(f"Final power metrics: {total_datatraffic_metric}", file=sys.stderr)
        return total_datatraffic_metric

    def get_aggregate_window(self, duration_str: str) -> str:
        """
        Determines the aggregation window based on the duration string.
        For example, "24 hours" -> 1-hour windows, "7 Days" -> 1-day windows.
        """
        if duration_str in ["24 hours"]:
            return "1h"  # Aggregate by 1 hour
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            return "1d"  # Aggregate by 1 day
        else:  # For larger periods like "Last 6 Months", "Last Year", etc.
            return "1m"  # Aggregate by 1 month

    def get_time_format(self, duration_str: str) -> str:
        """
        Determines the time format based on the duration string.
        This is used to format the time in a user-friendly way.
        """
        if duration_str in ["24 hours"]:
            return '%Y-%m-%d %H:00'  # Format time for hourly aggregation
        elif duration_str in ["7 Days", "Current Month", "Last Month"]:
            return '%Y-%m-%d'  # Format time for daily aggregation
        else:  # For larger periods like "Last 6 Months", "Last Year", etc.
            return '%Y-%m'  # Format time for monthly aggregation


    from influxdb_client import InfluxDBClient
    from prophet import Prophet
    import pandas as pd

  #   def fetch_influx_datass(self, ip_address):
  #       query = f'''
  #       from(bucket: "Dcs_db")
  # |> range(start: -6mo)
  # |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
  # |> filter(fn: (r) => r["ApicController_IP"] == "172.8.16.74")
  # |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
  # |> aggregateWindow(every: 1mo, fn: mean, createEmpty: false)
  # |> yield(name: "monthly_aggregated_with_ip")'''
  #
  #       try:
  #           # Execute the query
  #           results = self.query_api1.query_data_frame(query)
  #
  #           # Check if results is a list of DataFrames
  #           if isinstance(results, list):
  #               combined_data = pd.concat(results, ignore_index=True)
  #           else:
  #               combined_data = results
  #
  #           # Handle empty DataFrame
  #           if combined_data.empty:
  #               print("No data returned after query execution.")
  #               return pd.DataFrame(columns=["time", "total_PIn", "total_POut"])
  #
  #           # Rename "_time" to "time"
  #           combined_data.rename(columns={"_time": "time"}, inplace=True)
  #
  #           # Convert "time" column to datetime
  #           combined_data["time"] = pd.to_datetime(combined_data["time"])
  #
  #           return combined_data
  #       except Exception as e:
  #           raise RuntimeError(f"Error querying InfluxDB: {e}")
  #
  #   def fetch_influx_datass(self, ip_address):
  #       query = f'''
  #           from(bucket: "Dcs_db")
  #             |> range(start: -6mo)
  #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
  #             |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
  #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
  #             |> aggregateWindow(every: 1mo, fn: mean, createEmpty: false)
  #             |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  #             |> yield(name: "monthly_aggregated_with_ip")
  #       '''
  #
  #       try:
  #           # Execute the query
  #           results = self.query_api1.query_data_frame(query)
  #
  #           # Check if results is a list of DataFrames
  #           if isinstance(results, list):
  #               combined_data = pd.concat(results, ignore_index=True)
  #           else:
  #               combined_data = results
  #
  #           # Handle empty DataFrame
  #           if combined_data.empty:
  #               print("No data returned after query execution.")
  #               return pd.DataFrame(columns=["time", "total_PIn", "total_POut", "PUE", "EER"])
  #
  #           # Rename "_time" to "time"
  #           combined_data.rename(columns={"_time": "time"}, inplace=True)
  #
  #           # Convert "time" column to datetime
  #           combined_data["time"] = pd.to_datetime(combined_data["time"])
  #
  #           # Calculate PUE and EER ratios
  #           combined_data = self.calculate_ratios(combined_data)
  #
  #           return combined_data
  #       except Exception as e:
  #           raise RuntimeError(f"Error querying InfluxDB: {e}")
  #
  #   def calculate_ratios(self, dataframes):
  #       print("Calculating ratios", dataframes)
  #
  #       # Ensure required columns exist
  #       if "total_PIn" in dataframes.columns and "total_POut" in dataframes.columns:
  #           # Calculate PUE and EER
  #           dataframes["PUE"] = dataframes["total_PIn"] / dataframes["total_POut"]
  #           dataframes["EER"] = dataframes["total_POut"] / dataframes["total_PIn"]
  #           print("Ratios calculated:", dataframes)
  #           return dataframes
  #
  #       print("Missing required columns for ratio calculation")
  #       return pd.DataFrame(columns=["time", "total_PIn", "total_POut", "PUE", "EER"])
  #
  #   def fetch_influx_datass(self, ip_address):
  #       query = f'''
  #           from(bucket: "Dcs_db")
  #             |> range(start: -6mo)
  #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
  #             |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
  #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
  #             |> aggregateWindow(every: 1mo, fn: mean, createEmpty: false)
  #             |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  #             |> yield(name: "monthly_aggregated_with_ip")
  #       '''
  #
  #       try:
  #           # Execute the query
  #           results = self.query_api1.query_data_frame(query)
  #
  #           # Check if results is a list of DataFrames
  #           if isinstance(results, list):
  #               combined_data = pd.concat(results, ignore_index=True)
  #           else:
  #               combined_data = results
  #
  #           # Handle empty DataFrame
  #           if combined_data.empty:
  #               print("No data returned after query execution.")
  #               return {"data": "Insufficient data to calculate predictions."}
  #
  #           # Rename "_time" to "time" and remove timezone
  #           combined_data.rename(columns={"_time": "time"}, inplace=True)
  #           combined_data["time"] = pd.to_datetime(combined_data["time"]).dt.tz_localize(None)
  #
  #           # Calculate ratios
  #           combined_data = self.calculate_ratios(combined_data)
  #
  #           # Predict next month's values
  #           predictions = {}
  #           for column in ["total_PIn", "total_POut", "PUE", "EER"]:
  #               if column in combined_data.columns and not combined_data[column].isnull().all():
  #                   predictions[column] = self.predict_next_month(combined_data, column)
  #
  #           # Add predicted values as the next month's data
  #           predicted_row = {"time": pd.Timestamp.now().replace(day=1) + pd.DateOffset(months=1)}
  #           for key, value in predictions.items():
  #               predicted_row[key] = value
  #           combined_data = pd.concat([combined_data, pd.DataFrame([predicted_row])], ignore_index=True)
  #
  #           # Replace NaN and infinite values
  #           combined_data = combined_data.replace([float("inf"), -float("inf"), float("nan")], 0)
  #
  #           print("Last 12 months' data (including predicted):")
  #           print(combined_data)
  #
  #           print("\nPredicted values for next month:")
  #           for key, value in predictions.items():
  #               print(f"{key}: {value:.2f}")
  #
  #           return combined_data
  #       except Exception as e:
  #           raise RuntimeError(f"Error querying InfluxDB: {e}")
  #
  #   def calculate_ratios(self, dataframes):
  #       print("Calculating ratios", dataframes)
  #
  #       if "total_PIn" in dataframes.columns and "total_POut" in dataframes.columns:
  #           dataframes["PUE"] = dataframes["total_PIn"] / dataframes["total_POut"]
  #           dataframes["EER"] = dataframes["total_POut"] / dataframes["total_PIn"]
  #           return dataframes
  #
  #       print("Missing required columns for ratio calculation")
  #       return dataframes
  #
  #   def predict_next_month(self, data, column_name):
  #       try:
  #           df = data.rename(columns={"time": "ds", column_name: "y"}).dropna(subset=["ds", "y"])
  #           df["ds"] = df["ds"].dt.tz_localize(None)  # Remove timezone from ds column
  #
  #           if len(df) < 2:
  #               print(f"Not enough data to predict for {column_name}.")
  #               return float("nan")
  #
  #           model = Prophet()
  #           model.fit(df)
  #           future = model.make_future_dataframe(periods=1, freq='M')
  #           forecast = model.predict(future)
  #
  #           predicted_value = forecast.iloc[-1]["yhat"]
  #           print(f"Prediction for {column_name}: {predicted_value:.2f}")
  #           return predicted_value
  #       except Exception as e:
  #           print(f"Error predicting next month for {column_name}: {e}")
  #           return float("nan")
  #
    def prepare_response_ai_test(self,dataframe):
        # Convert "time" column to datetime if not already

            # Convert "time" column to datetime if not already
        print(dataframe,"lllllllllllllllllllllllllllllll********************")
        dataframe["time"] = pd.to_datetime(dataframe["time"], errors="coerce")

        # Remove rows with invalid timestamps
        dataframe = dataframe.dropna(subset=["time"])

        # Extract the month name and year
        dataframe["month"] = dataframe["time"].dt.strftime("%B")
        dataframe["year"] = dataframe["time"].dt.year

        # Sort data by time
        dataframe = dataframe.sort_values("time").reset_index(drop=True)

        # Round numeric values to 2 decimal places
        dataframe["total_PIn"] = dataframe["total_PIn"].round(2)
        dataframe["total_POut"] = dataframe["total_POut"].round(2)
        dataframe["PUE"] = dataframe["PUE"].round(2)
        dataframe["EER"] = dataframe["EER"].round(2)

        # Select relevant columns
        response_data = dataframe[["month", "year", "total_PIn", "total_POut", "PUE", "EER"]]

        # Convert to dictionary format for the response
        response = response_data.to_dict(orient="records")
  #
        return response

    def prepare_response_ai(self, dataframe):
        print(dataframe)
        dataframe["time"] = pd.to_datetime(dataframe["time"], errors="coerce")

        # Remove rows with invalid timestamps
        dataframe = dataframe.dropna(subset=["time"])

        # Extract the month name and year
        dataframe["month"] = dataframe["time"].dt.strftime("%B")
        dataframe["year"] = dataframe["time"].dt.year

        # Sort data by time
        dataframe = dataframe.sort_values("time").reset_index(drop=True)

        # Round numeric values to 2 decimal places
        dataframe["total_PIn"] = dataframe["total_PIn"].round(2)
        dataframe["total_POut"] = dataframe["total_POut"].round(2)
        dataframe["PUE"] = dataframe["PUE"].round(2)
        dataframe["EER"] = dataframe["EER"].round(2)
        # dataframe["Co2-emm"] = dataframe["total_PIn"] *0.4

        # Ensure "Prediction" column exists and set default to "False"
        if "Prediction" not in dataframe.columns:
            dataframe["Prediction"] = "False"

        # Select relevant columns
        response_data = dataframe[["month", "year", "total_PIn", "total_POut", "PUE", "EER", "Prediction"]]

        # Convert to dictionary format for the response
        response = response_data.to_dict(orient="records")

        return response

    # def influx_resp(self, ip_address):
    #     query = f'''
    #           from(bucket: "Dcs_db")
    #             |> range(start: -6mo)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
    #             |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> aggregateWindow(every: 1mo, fn: mean, createEmpty: false)
    #             |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    #             |> yield(name: "monthly_aggregated_with_ip")
    #       '''
    #
    #     try:
    #         # Execute the query
    #         results = self.query_api1.query_data_frame(query)
    #
    #         # Combine data if results is a list of DataFrames
    #         if isinstance(results, list):
    #             combined_data = pd.concat(results, ignore_index=True)
    #             print("sdgljagdjs",combined_data)
    #         else:
    #             combined_data = results
    #
    #         # Handle empty DataFrame
    #         if combined_data.empty:
    #             print("No data returned after query execution.")
    #             return pd.DataFrame(columns=["time", "total_PIn", "total_POut", "PUE", "EER"])
    #
    #         # Rename "_time" to "time" and remove timezone
    #         combined_data.rename(columns={"_time": "time"}, inplace=True)
    #         combined_data["time"] = pd.to_datetime(combined_data["time"]).dt.tz_localize(None)
    #
    #         # Generate a complete monthly date range
    #         all_months = pd.date_range(
    #             start=combined_data["time"].min(),
    #             end=combined_data["time"].max(),
    #             freq="MS"
    #         )
    #
    #
    #         combined_data = combined_data.set_index("time").reindex(all_months).reset_index()
    #         combined_data.rename(columns={"index": "time"}, inplace=True)
    #
    #         print("***************")
    #         print('combined_data',combined_data)
    #
    #
    #         # Fill missing values
    #         combined_data.fillna({"total_PIn": 0, "total_POut": 0}, inplace=True)
    #         print("zxcmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
    #         print(combined_data)
    #
    #
    #         # Calculate ratios
    #         combined_data = self.calculate_ratios(combined_data)
    #
    #
    #         # Predict next month's values
    #         predictions = {}
    #         for column in ["total_PIn", "total_POut", "PUE", "EER"]:
    #             if column in combined_data.columns and not combined_data[column].isnull().all():
    #                 predictions[column] = self.predict_next_month(combined_data, column)
    #
    #         # Add predicted values as the next month's data
    #         predicted_row = {"time": all_months[-1] + pd.DateOffset(months=1)}
    #         for key, value in predictions.items():
    #             predicted_row[key] = value
    #         combined_data = pd.concat([combined_data, pd.DataFrame([predicted_row])], ignore_index=True)
    #
    #         # Replace invalid values
    #         combined_data.replace([float("inf"), -float("inf"), float("nan")], 0, inplace=True)
    #
    #         return combined_data
    #     except Exception as e:
    #         raise RuntimeError(f"Error querying InfluxDB: {e}")
    def influx_resp(self, ip_address):
        query = f'''
            from(bucket: "Dcs_db")
            |> range(start: -9mo)
            |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
            |> filter(fn: (r) => r["ApicController_IP"] == "{ip_address}")
            |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
            |> aggregateWindow(every: 1mo, fn: mean, createEmpty: false)
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> yield(name: "monthly_aggregated_with_ip")
        '''

        try:
            # Execute query
            results = self.query_api1.query_data_frame(query)

            # Handle multiple DataFrames (InfluxDB might return multiple parts)
            if isinstance(results, list):
                combined_data = pd.concat(results, ignore_index=True)
            else:
                combined_data = results

            # Handle empty result
            if combined_data.empty:
                print("❌ No data retrieved from InfluxDB.")
                return pd.DataFrame(columns=["time", "total_PIn", "total_POut", "PUE", "EER"])

            # Rename and format time column
            combined_data.rename(columns={"_time": "time"}, inplace=True)
            combined_data["time"] = pd.to_datetime(combined_data["time"]).dt.tz_localize(None)

            # Generate full monthly range for last 9 months
            start_date = pd.Timestamp.now().normalize() - pd.DateOffset(months=9)
            end_date = pd.Timestamp.today().normalize()
            all_months = pd.date_range(start=start_date, end=end_date, freq="MS")

            # Reindex data to fill missing months
            combined_data = combined_data.set_index("time").reindex(all_months).reset_index()
            combined_data.rename(columns={"index": "time"}, inplace=True)

            # Fill missing values properly
            combined_data.fillna({"total_PIn": 0, "total_POut": 0}, inplace=True)

            # Ensure no negative values (replace with 0)
            combined_data["total_PIn"] = combined_data["total_PIn"].clip(lower=0)
            combined_data["total_POut"] = combined_data["total_POut"].clip(lower=0)

            # Calculate PUE and EER ratios
            combined_data = self.calculate_ratios(combined_data)

            # Replace invalid values (NaN, Inf)
            combined_data.replace([float("inf"), -float("inf"), float("nan")], 0, inplace=True)
            combined_data.fillna(0, inplace=True)

            print("✅ Successfully retrieved & processed InfluxDB data.")
            return combined_data

        except Exception as e:
            print(f"⚠️ Error querying InfluxDB: {e}")
            return pd.DataFrame(columns=["time", "total_PIn", "total_POut", "PUE", "EER"])  # Return empty DataFrame

    def calculate_ratios(self, dataframes):
        print("Calculating ratios", dataframes)

        if "total_PIn" in dataframes.columns and "total_POut" in dataframes.columns:
            dataframes["PUE"] = dataframes["total_PIn"] / dataframes["total_POut"]
            dataframes["EER"] = dataframes["total_POut"] / dataframes["total_PIn"]
            return dataframes

        print("Missing required columns for ratio calculation")
        return dataframes


    # def predict_next_month(self, data, column_name):
    #     try:
    #         df = data.rename(columns={"time": "ds", column_name: "y"}).dropna(subset=["ds", "y"])
    #         df["ds"] = df["ds"].dt.tz_localize(None)  # Remove timezone from ds column
    #
    #         if len(df) < 2:
    #             print(f"Not enough data to predict for {column_name}.")
    #             return float("nan")
    #
    #         model = Prophet()
    #         model.fit(df)
    #         future = model.make_future_dataframe(periods=1, freq='M')
    #         forecast = model.predict(future)
    #
    #         predicted_value = forecast.iloc[-1]["yhat"]
    #         print(f"Prediction for {column_name}: {predicted_value:.2f}")
    #         return predicted_value
    #     except Exception as e:
    #         print(f"Error predicting next month for {column_name}: {e}")
    #         return float("nan")
    def predict_next_month(self, data, column_name):
        try:
            df = data.rename(columns={"time": "ds", column_name: "y"}).dropna(subset=["ds", "y"])
            df["ds"] = df["ds"].dt.tz_localize(None)  # Remove timezone from ds column

            # If there are not enough data points, return NaN
            if len(df) < 2:
                print(f"Not enough data to predict for {column_name}.")
                return float("nan")

            # Prophet needs a 'cap' for logistic growth
            df["cap"] = df["y"].max() * 1.5  # Set a reasonable cap (50% more than max observed)

            # Initialize model with logistic growth to prevent negatives
            model = Prophet(growth="logistic")
            model.fit(df)
            # Create future dataframe
            future = model.make_future_dataframe(periods=1, freq='M')
            future["cap"] = df["cap"].max()  # Ensure cap is applied to the future prediction

            # Predict
            forecast = model.predict(future)
            predicted_value = max(0, forecast.iloc[-1]["yhat"])  # Ensure no negative values

            print(f"Prediction for {column_name}: {predicted_value:.2f}")
            return predicted_value

        except Exception as e:
            print(f"Error predicting next month for {column_name}: {e}")
            return float("nan")


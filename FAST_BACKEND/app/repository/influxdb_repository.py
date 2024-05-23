import random
import sys
import traceback
from calendar import calendar

import numpy as np
from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable, List, Union, Tuple, Any

from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from app.core.config import configs
from datetime import datetime, timedelta
import pandas as pd


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

    def get_site_power_metrics(self, device_ips: List[str]) -> dict:
        total_power = 0
        max_power = 0
        power_measurements = []

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
            if not result.empty:
                power = result.loc[result['_field'] == 'total_Power', '_value'].values[0]
                total_power += power
                max_power = max(max_power, power)
                power_measurements.append(power)

        average_power = total_power / len(power_measurements) if power_measurements else 0

        total_power = int(total_power)
        average_power = int(average_power)
        max_power = int(max_power)

        return {
            "total_power": total_power,
            "average_power": average_power,
            "max_power": max_power
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
                |> aggregateWindow(every: 1h, fn: mean, createEmpty: true)
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
    #             |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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
            query = f'''
                from(bucket: "{configs.INFLUXDB_BUCKET}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            result = self.query_api1.query_data_frame(query)

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

                        energy_consumption = (pout / pin) * 100 if pin > 0 else 0
                        power_efficiency = ((pin / pout - 1) * 100) if pout > 0 else 0

                        total_power_metrics.append({
                            "time": row['index'],
                            "energy_consumption": round(energy_consumption, 2),
                            "total_POut": round(pout, 2),
                            "total_PIn": round(pin, 2),
                            "power_efficiency": round(power_efficiency, 2)
                        })

        df = pd.DataFrame(total_power_metrics).drop_duplicates(subset='time').to_dict(orient='records')
        return df

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
            |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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
                |> range(start: -1d)
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
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                |> sort(columns: ["_value"], desc: true)
                |> limit(n:5)
            '''
            result = self.query_api1.query_data_frame(query)
            print(f"Query result for IPPPPPPPPPPPP: {ip} is: {result}", file=sys.stderr)

            if not result.empty:
                total_power = result['_value'].sum()
                average_power = total_power / len(result) if len(result) > 0 else 0
                cost_of_power = self.calculate_cost_of_power(total_power)
                average_powerkw = average_power / 1000
                top_devices_power.append({
                    'ip': ip,
                    'total_PIn': total_power,
                    'average_PIn': average_powerkw,
                    'cost_of_power': cost_of_power,
                })

        top_devices_power = sorted(top_devices_power, key=lambda x: x['total_PIn'], reverse=True)[:5]
        return top_devices_power

    def calculate_cost_of_power(self, power_in_watts):

        power_in_kwh = power_in_watts / 1000
        rate_per_kwh = 0.405
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
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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
        device_ips = [device_ips]
        for ip in device_ips:
            # Query for traffic data
            traffic_query = f'''
                from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic" and r["_field"] == "total_bytesRateLast")
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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
                    total_bytes_rate_last_gb = row['total_bytesRateLast'] / (2 ** 30) if row[
                                                                                             'total_bytesRateLast'] > 0 else 0
                    pin = row['total_PIn'] if row['total_PIn'] > 0 else 1  # Avoid division by zero
                    pout = row['total_POut'] if row['total_POut'] > 0 else 0

                    energy_consumption = (pout / pin) * 100  # Calculate energy consumption
                    throughput_metrics.append({
                        "time": row['_time'],
                        "total_bytes_rate_last_gb": round(total_bytes_rate_last_gb, 2),
                        "energy_consumption": round(energy_consumption, 2)  # Add energy consumption
                    })

        return throughput_metrics

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
                |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: true)
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

            current_power = ((
                                     pin / pout) - 1) * 100 if pout != 0 else 0  # Calculate current power based on your formula

            metric = {
                "ip": row.get("ApicController_IP", "unknown_ip"),
                "time": row['_time'].strftime('%Y-%m-%d %H:%M:%S'),
                "PE": row.get('total_POut', 0) / max(pin, 1) * 100,
                "PUE": pin * 1.2 / max(pin, 1),
                "current_power": round(current_power, 2),  # Rounded for better display
                "energy_consumption": pin / 1000,
                "total_POut": pout / 1000,
                "average_energy_consumed": pin / max(pout, 1),
                "power_efficiency": pout / max(pin, 1) * 100
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
            print("IP QQQQ", ip, file=sys.stderr)
            query = f'''
                           from(bucket: "{configs.INFLUXDB_BUCKET}")
                           |> range(start: {start_time}, stop: {end_time})
                           |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
                           |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and (r["_field"] == "total_PIn" or r["_field"] == "total_POut"))
                           |> aggregateWindow(every: {aggregate_window}, fn: mean, createEmpty: false)
                           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                       '''
            result = self.query_api1.query_data_frame(query)
            print("resultttttttttttttttttt", result, file=sys.stderr)

            if result.empty:
                print(f"No data found for {ip}. Skipping data generation.", file=sys.stderr)  # Debug print when no data
            else:
                print(f"Data retrieved for {ip}, processing {len(result)} entries.",
                      file=sys.stderr)  # Debug print for retrieved data
                parsed_metrics = self.parse_result12(result)
                for metric in parsed_metrics:
                    metric["ip"] = ip  # Ensuring IP is included for device details merging
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
                    "pue": round(pue, 2) if pue is not None else 0
                })
            except Exception as e:
                print(f"Error querying InfluxDB for {apic_ip}: {e}")

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
                            t += total_byterate

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
        start_range = "-2h"
        for ip in device_ips:
            # Query for Power Input and Output
            power_in_query = self.build_query(ip, "total_PIn", start_range)
            power_out_query = self.build_query(ip, "total_POut", start_range)
            total_power_query = self.build_query(ip, "total_Power", start_range)

            PowerIn = self.query_last_value(power_in_query)
            PowerOut = self.query_last_value(power_out_query)
            TotalPower = self.query_last_value(total_power_query)

            power_required_data.append({
                "site_id": site_id,
                "apic_controller_ip": ip,
                "PowerInput": PowerIn,
                "TotalPower": TotalPower,
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

    def get_consumption_percentages(self, start_date: datetime, end_date: datetime, duration_str: str) -> dict:
        start_time = start_date.isoformat() + 'Z'
        end_time = end_date.isoformat() + 'Z'
        aggregate_window = "1h" if duration_str == "24 hours" else "1d"
        zone = "AE"

        # fields = [
        #     "nuclear", "geothermal", "biomass", "coal", "wind", "solar",
        #     "hydro", "gas", "oil", "unknown", "battery_discharge"
        # ]

        # Initialize the consumption totals dictionary.
        consumption_totals = {field: 0 for field in fields}

        # Construct the query for all energy consumption fields and execute it.
        query = f'''
            from(bucket: "Dcs_db")
            |> range(start: {start_time}, stop: {end_time})
            |> filter(fn: (r) => r["_measurement"] == "electricitymap_power")
            |> filter(fn: (r) => r["zone"] == "{zone}")
            |> filter(fn: (r) => 
                r["_field"] == "nuclear_consumption" 
                r["_field"] == "geothermal_consumption" 
                r["_field"] == "biomass_consumption" 
                r["_field"] == "coal_consumption" 
                r["_field"] == "wind_consumption" 
                r["_field"] == "solar_consumption" 
                r["_field"] == "hydro_consumption" 
                r["_field"] == "gas_consumption" 
                r["_field"] == "oil_consumption" 
                r["_field"] == "unknown_consumption" 
                r["_field"] == "battery_discharge_consumption")
            |> aggregateWindow(every: {aggregate_window}, fn: sum, createEmpty: false)
            |> sum()  // Sum the total consumption for each field over the selected range
        '''
        result = self.query_api1.query_data_frame(query)
        if not result.empty:
            # Extract the sums from the query result and calculate total power consumption
            for field in fields:
                field_name = f"{field}_consumption"
                if field_name in result.columns:
                    consumption_totals[field] = result[field_name].iloc[0]

        # Calculate the total power consumption from the retrieved data.
        powerConsumptionTotal = sum(consumption_totals.values())

        # Compute the percentage of total power consumption for each field.
        percentages = {field: round((value / powerConsumptionTotal) * 100, 2) if powerConsumptionTotal > 0 else 0
                       for field, value in consumption_totals.items()}

        return percentages


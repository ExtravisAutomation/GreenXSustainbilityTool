import sys

from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable, List

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
                |> range(start: -7d)
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

    def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
        # Initialize metrics
        total_power_metrics = []

        for ip in device_ips:

            power_metrics_per_device = []

            for field in ['total_PIn', 'total_POut']:
                query = f'''
                    from(bucket: "{configs.INFLUXDB_BUCKET}")
                    |> range(start: -7d)
                    |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                    |> filter(fn: (r) => r["_field"] == "{field}")
                    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                '''
                result = self.query_api1.query_data_frame(query)
                if not result.empty:

                    result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
                    for index, row in result.iterrows():
                        power_metrics_per_device.append({
                            "time": row['time'],
                            field: round(row['_value'] / 1000, 2)
                        })

            if power_metrics_per_device:
                df = pd.DataFrame(power_metrics_per_device)
                grouped_df = df.groupby('time').sum().reset_index()

                for index, row in grouped_df.iterrows():
                    total_power_metrics.append({
                        "time": row['time'],
                        "energy_consumption": row.get('total_PIn', 0),
                        "total_POut": row.get('total_POut', 0),
                        "average_energy_consumed": row.get('total_PIn', 0) / row.get('total_POut', 1) if row.get(
                            'total_POut', 1) > 0 else None,
                        "power_efficiency": row.get('total_POut', 0) / row.get('total_PIn', 1) * 100 if row.get(
                            'total_PIn', 1) > 0 else None
                    })

        return total_power_metrics

    def calculate_hourly_metrics_for_device(self, device_ips: List[str]) -> List[dict]:
        total_power_metrics = []

        for ip in device_ips:

            print(f"Processing IP: {ip}", file=sys.stderr)

            power_metrics = {}

            for field in ['total_PIn', 'total_POut']:
                query = f'''
                    from(bucket: "{configs.INFLUXDB_BUCKET}")
                    |> range(start: -7d)
                    |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                    |> filter(fn: (r) => r["_field"] == "{field}")
                    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                '''
                # Debug: Print the query being executed
                print(f"Executing query: {query}", file=sys.stderr)

                result = self.query_api1.query_data_frame(query)
                if not result.empty:
                    result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
                    for _, row in result.iterrows():
                        time_key = row['time']
                        if time_key not in power_metrics:
                            power_metrics[time_key] = {}
                        power_metrics[time_key][field] = row['_value']

            for time, metrics in power_metrics.items():
                total_PIn = metrics.get('total_PIn', 0)
                total_POut = metrics.get('total_POut', 0)
                current_power = total_PIn

                PE = (total_POut / total_PIn * 100) if total_PIn else None

                total_energy = total_PIn * 1.2
                PUE = total_energy / total_PIn if total_PIn else None

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
                    hour = pd.to_datetime(row['_time']).strftime('%Y-%m-%d %H:%M:%S')
                    total_power = row['_value']
                    ip_hourly_metrics.append({
                        "hour": hour,
                        "total_PIn": total_power
                    })
                    total_power_accumulated.append(total_power)

            print(f"Total power accumulated for IP {ip}: {total_power_accumulated}")
            total_power = sum(total_power_accumulated) if total_power_accumulated else None
            max_power = max(total_power_accumulated) if total_power_accumulated else None
            print(f"Total power for IP {ip}: {total_power}, Max power for IP {ip}: {max_power}")

            for metric in ip_hourly_metrics:
                metric.update({
                    "apic_controller_ip": ip,
                    "total_power": total_power,
                    "max_power": max_power
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
                average_power = total_power / count_measurements if count_measurements > 0 else 0
                powerinkwh = total_power / 1000  # aed
                cost_of_power = powerinkwh * 0.405
                top_devices_power.append({
                    'ip': ip,
                    'total_PIn': total_power,
                    'average_PIn': average_power,
                    'cost_of_power': cost_of_power
                    # Add other necessary data as needed
                })

        return top_devices_power

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
                        "total_bytes_rate_last": total_bytes_rate_last_gb
                    })

        return throughput_metrics

    def calculate_throughput_metrics_for_devices(self, device_ips: List[str]) -> List[dict]:
        throughput_metrics = []

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
                for _, row in result.iterrows():
                    throughput_metrics.append({
                        "ip": ip,
                        "traffic_throughput": row['_value'],
                        "time": pd.to_datetime(row['_time'])
                    })
        return throughput_metrics

    def get_total_power_for_ip(self, ip_address: str) -> float:
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
            total_power_kwh = result['_value'].sum() / 1000.0  # Assuming _value is in Watts
            return total_power_kwh
        return 0.0

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
        |> range(start: -7d)
        |> filter(fn: (r) => r["ApicController_IP"] == "10.14.106.6")
        |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> yield(name: "mean")
        '''
        result = self.query_api1.query_data_frame(query=query)
        if result.empty:
            return []
        result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
        hourly_data = [{"time": row['time'], "total_PIn": row['_value']} for index, row in result.iterrows()]
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

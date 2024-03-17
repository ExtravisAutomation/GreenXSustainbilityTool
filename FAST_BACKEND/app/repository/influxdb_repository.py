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

    # def get_power_data(self, apic_ip, node):
    #     query = f'''
    #        from(bucket: "{configs.INFLUXDB_BUCKET}")
    #        |> range(start: -5m)  # Updated to last 5 minutes
    #        |> filter(fn: (r) => r["apic_ip"] == "{apic_ip}" and r["node"] == "{node}")
    #        |> last()
    #        '''
    #     result = self.query_api1.query(query)
    #     drawnAvg, suppliedAvg = None, None
    #
    #     for table in result:
    #         for record in table.records:
    #             if record.get_field() == "drawnAvg":
    #                 drawnAvg = record.get_value()
    #             elif record.get_field() == "suppliedAvg":
    #                 suppliedAvg = record.get_value()
    #     return drawnAvg, suppliedAvg

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

    # def get_power_data_per_hour(self, apic_ip: str, node: str) -> List[dict]:
    #     start_range = "-24h"
    #     query = f'''
    #     from(bucket: "{configs.INFLUXDB_BUCKET}")
    #     |> range(start: {start_range})
    #     |> filter(fn: (r) => r["_measurement"] == "Final_Apic_power_consumption")
    #     |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
    #     |> filter(fn: (r) => r["node"] == "{node}")
    #     |> filter(fn: (r) => r["_field"] == "drawnAvg")
    #     |> filter(fn: (r) => r["_field"] == "suppliedAvg")
    #     |> aggregateWindow(every: 1h, fn: mean)
    #     '''
    #     result = self.query_api1.query(query)
    #     print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
    #     hourly_data = []
    #     for table in result:
    #         for record in table.records:
    #             hour = record.get_time().strftime('%Y-%m-%d %H:00')
    #             drawnAvg = record.get_value() if 'drawnAvg' in record.values else None
    #             suppliedAvg = record.get_value() if 'suppliedAvg' in record.values else None
    #             power_utilization = None
    #             if drawnAvg is not None and suppliedAvg is not None and suppliedAvg > 0:
    #                 power_utilization = (drawnAvg / suppliedAvg) * 100
    #             hourly_data.append({
    #                 "hour": hour,
    #                 "power_utilization": round(power_utilization, 2) if power_utilization is not None else None
    #             })
    #     return hourly_data

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

            drawnLast = None  # Initialize drawnLast as None

            for table in result:
                for record in table.records:
                    if record.get_field() == "drawnLast":
                        drawnLast = record.get_value()
                        break  # Assuming only one drawnLast value per node

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
                |> range(start: -1d)
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

    # def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
    #     energy_consumption_metrics = []
    #
    #     for ip in device_ips:
    #         # Query to get the last values of total_Pin and total_POut
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -1d)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_Pin")
    #             |> filter(fn: (r) => r["_field"] == "total_POut")
    #             |> last()
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #         if not result.empty:
    #
    #             total_Pin = result[result['_field'] == 'total_Pin']['_value'].values[0]
    #             total_POut = result[result['_field'] == 'total_POut']['_value'].values[0]
    #             energy_consumed = total_Pin / total_POut if total_POut != 0 else None
    #             time = result['_time'].values[0]
    #
    #             energy_consumption_metrics.append({
    #                 "ip": ip,
    #                 "time": str(time),
    #                 "Pin": total_Pin,
    #                 "POut": total_POut,
    #                 "energy_consumed": energy_consumed
    #             })
    #
    #     return energy_consumption_metrics

    # def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
    #     energy_consumption_metrics = []
    #
    #     for ip in device_ips:
    #         # Adjusted query to properly pivot the fields for DataFrame processing
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -1d)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" and r["_field"] == "total_POut")
    #             |> last()
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #         if not result.empty:
    #             total_Pin = result['total_Pin'][0] if 'total_Pin' in result.columns else None
    #             total_POut = result['total_POut'][0] if 'total_POut' in result.columns else None
    #             energy_consumed = total_Pin / total_POut if total_POut and total_Pin else None
    #             time = result.index[0]
    #
    #             energy_consumption_metrics.append({
    #                 "ip": ip,
    #                 "time": str(time),
    #                 "Pin": total_Pin,
    #                 "POut": total_POut,
    #                 "energy_consumed": energy_consumed
    #             })
    #
    #     return energy_consumption_metrics

    # def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
    #     energy_consumption_metrics = []
    #
    #     for ip in device_ips:
    #         query = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -1d)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn" or r["_field"] == "total_POut")
    #             |> last()
    #             |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    #         '''
    #         result = self.query_api1.query_data_frame(query)
    #         if not result.empty and 'total_Pin' in result.columns and 'total_POut' in result.columns:
    #             total_Pin = result['total_Pin'].iloc[0] if 'total_PIn' in result else None
    #             total_POut = result['total_POut'].iloc[0] if 'total_POut' in result else None
    #             energy_consumed = total_Pin / total_POut if total_POut and total_Pin is not None else None
    #             time = result.index[0] if not result.empty else "N/A"
    #
    #             energy_consumption_metrics.append({
    #                 "ip": ip,
    #                 "time": str(time),
    #                 "Pin": total_Pin,
    #                 "POut": total_POut,
    #                 "energy_consumed": energy_consumed
    #             })
    #
    #     return energy_consumption_metrics
    #

    # def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
    #     energy_consumption_metrics = []
    #
    #     for ip in device_ips:
    #         # Query for total_Pin
    #         query_pin = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -1d)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_PIn")
    #             |> last()
    #         '''
    #         result_pin = self.query_api1.query_data_frame(query_pin)
    #         total_Pin = result_pin['_value'].values[0] if not result_pin.empty else None
    #         print("PINNNNNNNNNNNNNNNNNNNNNNNNNNNNN", total_Pin, file=sys.stderr)
    #         # Query for total_POut
    #         query_pout = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -1d)
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_field"] == "total_POut")
    #             |> last()
    #         '''
    #         result_pout = self.query_api1.query_data_frame(query_pout)
    #         total_POut = result_pout['_value'].values[0] if not result_pout.empty else None
    #         print("POUTTTTTTTTTTTTTTTTTTTTTTTT", total_POut, file=sys.stderr)
    #         # Calculate energy consumed if both values are available
    #         energy_consumed = total_Pin / total_POut if total_Pin is not None and total_POut is not None and total_POut != 0 else None
    #
    #         # Assume the time from the Pin query as the reference time
    #         time = result_pin['_time'].values[0] if not result_pin.empty else "N/A"
    #
    #         energy_consumption_metrics.append({
    #             "ip": ip,
    #             "time": str(time),
    #             "current_power": total_Pin,
    #             "POut": total_POut,
    #             "energy_consumed": energy_consumed
    #         })
    #
    #     return energy_consumption_metrics

    def get_energy_consumption_metrics(self, device_ips: List[str]) -> List[dict]:
        # Initialize metrics
        total_power_metrics = []

        # Iterate over each device IP
        for ip in device_ips:
            # Perform separate queries for total_PIn and total_POut, and aggregate data hourly
            power_metrics_per_device = []

            for field in ['total_PIn', 'total_POut']:
                query = f'''
                    from(bucket: "{configs.INFLUXDB_BUCKET}")
                    |> range(start: -1d)
                    |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{ip}")
                    |> filter(fn: (r) => r["_field"] == "{field}")
                    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
                '''
                result = self.query_api1.query_data_frame(query)
                if not result.empty:
                    # Extract power values and append to power_metrics_per_device
                    result['time'] = pd.to_datetime(result['_time']).dt.strftime('%Y-%m-%d %H:%M:%S')
                    for index, row in result.iterrows():
                        power_metrics_per_device.append({
                            "time": row['time'],
                            field: row['_value']
                        })

            # Aggregate the results for total_PIn and total_POut across all devices
            if power_metrics_per_device:
                df = pd.DataFrame(power_metrics_per_device)
                grouped_df = df.groupby('time').sum().reset_index()

                for index, row in grouped_df.iterrows():
                    total_power_metrics.append({
                        "time": row['time'],
                        "total_current_power": row.get('total_PIn', 0),
                        "total_POut": row.get('total_POut', 0),
                        "average_energy_consumed": row.get('total_PIn', 0) / row.get('total_POut', 1) if row.get(
                            'total_POut', 1) > 0 else None
                    })

        return total_power_metrics

    # def calculate_hourly_metrics_for_device(self, apic_controller_ip: str) -> List[dict[str, float]]:
    #     hourly_metrics = []
    #
    #     # Query for total_PIn with hourly aggregation
    #     query_pin = f'''
    #         from(bucket: "{self.bucket}")
    #         |> range(start: -7d)
    #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{apic_controller_ip}")
    #         |> filter(fn: (r) => r["_field"] == "total_PIn")
    #         |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
    #     '''
    #     result_pin = self.query_api1.query_data_frame(query_pin)
    #
    #     # Query for total_POut with hourly aggregation
    #     query_pout = f'''
    #         from(bucket: "{self.bucket}")
    #         |> range(start: -7d)
    #         |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["ApicController_IP"] == "{apic_controller_ip}")
    #         |> filter(fn: (r) => r["_field"] == "total_POut")
    #         |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
    #     '''
    #     result_pout = self.query_api1.query_data_frame(query_pout)
    #
    #     if not result_pin.empty and not result_pout.empty:
    #         # Merge the two dataframes on the time column
    #         merged_results = pd.merge(result_pin, result_pout, on=["_time", "_start", "_stop"],
    #                                   suffixes=('_pin', '_pout'))
    #
    #         for _, row in merged_results.iterrows():
    #             total_PIn = row['_value_pin']
    #             total_POut = row['_value_pout']
    #             current_power = total_PIn  # This is an assumption; adjust as necessary
    #
    #             # Calculate PE (Power Efficiency)
    #             PE = (total_POut / total_PIn) * 100 if total_PIn else 0
    #
    #             # For PUE calculation, assume placeholders for total energy and computing equipment energy
    #             total_energy_consumed_by_data_center = 1  # Placeholder
    #             energy_consumed_by_computing_equipment = total_PIn  # Placeholder
    #             PUE = (
    #                         total_energy_consumed_by_data_center / energy_consumed_by_computing_equipment) if energy_consumed_by_computing_equipment else 0
    #
    #             hourly_metrics.append({
    #                 "time": row['_time'].strftime('%Y-%m-%d %H:%M:%S'),
    #                 "PE": PE,
    #                 "PUE": PUE,
    #                 "current_power": current_power
    #             })
    #
    #     return hourly_metrics

    def calculate_hourly_metrics_for_device(self, device_ips: List[str]) -> List[dict]:
        total_power_metrics = []

        for ip in device_ips:
            # Debug: Print the IP being processed
            print(f"Processing IP: {ip}", file=sys.stderr)

            # Initialize dictionaries to store aggregated power metrics
            power_metrics = {}

            # Query for total_PIn and total_POut separately
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

            # Process the aggregated data
            for time, metrics in power_metrics.items():
                total_PIn = metrics.get('total_PIn', 0)
                total_POut = metrics.get('total_POut', 0)
                current_power = total_PIn

                PE = (total_POut / total_PIn * 100) if total_PIn else None
                # Placeholder for total energy consumed by the data center for PUE calculation
                total_energy = total_PIn * 1.2  # Example calculation for total energy
                PUE = total_energy / total_PIn if total_PIn else None

                # Debug: Print calculated metrics
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

    # def get_hourly_power_metrics_for_ip(self, device_ips: List[str]) -> List[dict]:
    #     hourly_power_metrics = []
    #
    #     for ip in device_ips:
    #         # Initialize a dictionary to store the hourly metrics for the current IP
    #         ip_metrics = {}
    #
    #         # Query for total_PIn with hourly aggregation
    #         query_pin = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -7d)
    #             |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_PIn")
    #             |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
    #         '''
    #         result_pin = self.query_api1.query_data_frame(query_pin)
    #         if not result_pin.empty:
    #             for _, row in result_pin.iterrows():
    #                 hour = pd.to_datetime(row['_time']).strftime('%Y-%m-%d %H:%M:%S')
    #                 if hour not in ip_metrics:
    #                     ip_metrics[hour] = {"total_PIn": row['_value']}
    #                 else:
    #                     ip_metrics[hour]["total_PIn"] = row['_value']
    #
    #         # Query for total_POut with hourly aggregation
    #         query_pout = f'''
    #             from(bucket: "{configs.INFLUXDB_BUCKET}")
    #             |> range(start: -7d)
    #             |> filter(fn: (r) => r["ApicController_IP"] == "{ip}")
    #             |> filter(fn: (r) => r["_measurement"] == "DevicePSU" and r["_field"] == "total_POut")
    #             |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
    #         '''
    #         result_pout = self.query_api1.query_data_frame(query_pout)
    #         if not result_pout.empty:
    #             for _, row in result_pout.iterrows():
    #                 hour = pd.to_datetime(row['_time']).strftime('%Y-%m-%d %H:%M:%S')
    #                 if hour not in ip_metrics:
    #                     ip_metrics[hour] = {"total_POut": row['_value']}
    #                 else:
    #                     ip_metrics[hour]["total_POut"] = row['_value']
    #
    #         # Compile the results into the hourly_power_metrics list
    #         for hour, metrics in ip_metrics.items():
    #             hourly_power_metrics.append({
    #                 "apic_controller_ip": ip,
    #                 "hour": hour,
    #                 **metrics,
    #                 "power_utilization": (metrics.get("total_POut", 0) / metrics.get("total_PIn", 1)) * 100 if metrics.get("total_PIn", 1) > 0 else None
    #             })
    #
    #     return hourly_power_metrics

    def get_hourly_power_metrics_for_ip(self, device_ips: List[str]) -> List[dict]:
        hourly_power_metrics = []

        for ip in device_ips:
            print(f"Processing IP: {ip}")  # Debug print
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

            # Add similar logic for total_POut if necessary

            print(f"Total power accumulated for IP {ip}: {total_power_accumulated}")  # Debug print
            total_power = sum(total_power_accumulated) if total_power_accumulated else None
            max_power = max(total_power_accumulated) if total_power_accumulated else None
            print(f"Total power for IP {ip}: {total_power}, Max power for IP {ip}: {max_power}")  # Debug print

            for metric in ip_hourly_metrics:
                metric.update({
                    "apic_controller_ip": ip,
                    "total_power": total_power,
                    "max_power": max_power
                })
                print(f"Metric before appending to list for IP {ip}: {metric}")  # Debug print
                hourly_power_metrics.append(metric)

        return hourly_power_metrics

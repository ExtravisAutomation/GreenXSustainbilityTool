import sys

from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable, List

from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from app.core.config import configs


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
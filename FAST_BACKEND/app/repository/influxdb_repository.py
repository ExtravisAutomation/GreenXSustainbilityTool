import sys

from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable

from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from app.core.config import configs


class InfluxDBRepository:
    def __init__(self, client: InfluxDBClient, bucket: str, org: str):
        self.client = client
        self.bucket = bucket
        self.org = org
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
           |> range(start: -5m)  # Updated to last 5 minutes
           |> filter(fn: (r) => r["apic_ip"] == "{apic_ip}" and r["node"] == "{node}")
           |> last()
           '''
        result = self.query_api1.query(query)
        drawnAvg, suppliedAvg = None, None

        for table in result:
            for record in table.records:
                if record.get_field() == "drawnAvg":
                    drawnAvg = record.get_value()
                elif record.get_field() == "suppliedAvg":
                    suppliedAvg = record.get_value()
        return drawnAvg, suppliedAvg

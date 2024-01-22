import sys

from influxdb_client import InfluxDBClient, Point, WritePrecision
from contextlib import AbstractContextManager
from typing import Callable

from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS


class InfluxDBRepository:
    def __init__(self, client: InfluxDBClient, bucket: str, org: str):
        self.client = client
        self.bucket = bucket
        self.org = org

    def write_data(self, data: Point):
        try:
            with self.client.write_api(write_options=SYNCHRONOUS) as write_api:
                write_api.write(bucket=self.bucket, org=self.org, record=data)
                print(f"Data written to InfluxDB for bucket {self.bucket}", file=sys.stderr)
        except Exception as e:
            print(f"Error writing data to InfluxDB: {e}", file=sys.stderr)

    def get_last_records(self, ip: str, limit: int = 10) -> list:
        query = f'from(bucket: "{self.bucket}") |> range(start: -1h) |> filter(fn: (r) => r["device"] == "{ip}") |> limit(n:{limit})'
        query_api: QueryApi = self.client.query_api()
        result = query_api.query_data_frame(query)
        return result if result else []


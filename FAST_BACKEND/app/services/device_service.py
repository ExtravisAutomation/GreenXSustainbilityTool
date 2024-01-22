import time

from netmiko import ConnectHandler
from datetime import datetime
from .base_service import BaseService
from app.repository.influxdb_repository import InfluxDBRepository
from influxdb_client import Point, WritePrecision

from app.schema.device_schema import PowerUsageRecord

from app.schema.device_schema import DeviceDataResponse
import sys


def fetch_device_output(ip, username, password, command):
    device = {
        'device_type': 'cisco_ios',
        'host': ip,
        'username': username,
        'password': password,
    }

    try:
        with ConnectHandler(**device) as net_connect:
            print(f"Sending command to {ip}: {command}", file=sys.stderr)
            output = net_connect.send_command(command)
            print(f"Command output from {ip}: {output}", file=sys.stderr)
            return output
    except Exception as e:
        print(f"Error occurred while executing command on {ip}: {e}", file=sys.stderr)
        return None


def parse_output(output):
    if output is None:
        print("No output received to parse.>>>>>>>>>.>>>>>>", file=sys.stderr)
        return None
    try:

        power_output = int(output.split()[-2])
        print("Power output is: ", power_output)
        return power_output
    except (ValueError, IndexError):
        print("Failed to parse power output", file=sys.stderr)
        return None


class DeviceService(BaseService):
    def __init__(self, influxdb_repository: InfluxDBRepository):
        self.influxdb_repository = influxdb_repository
        super().__init__(influxdb_repository)

    def handle_device(self, ip, username, password, command):
        output = fetch_device_output(ip, username, password, command)
        print("OUTTTTTTTTTTTTTTTTTTTTTTTTTT", output, file=sys.stderr)
        power_output = parse_output(output)
        if power_output is not None:
            self.store_in_influxdb(ip, power_output)
            return f"Data stored for IP {ip}: {power_output} W"
        else:
            error_message = f"Failed to parse power output for {ip}"
            print(error_message, file=sys.stderr)
            return "Failed to parse power output"

    def store_in_influxdb(self, ip, power_output):
        point = Point("power_usage").tag("device", ip).field("output", power_output).time(datetime.utcnow(),
                                                                                          WritePrecision.NS)
        self.influxdb_repository.write_data(point)

    def get_device_data(self, ip: str) -> list:
        records = self.influxdb_repository.get_last_records(ip)
        data = [PowerUsageRecord(ip=record['device'], time=record['_time'], output=record['_value']) for record in
                records]
        return DeviceDataResponse(data=data)

    def fetch_and_store(self, ip, username, password, command):
        for _ in range(1000):
            result = self.handle_device(ip, username, password, command)
            print("FINAL OUTPUT>>>>>>>>>>>>>>>>>>>>>>>", result)
            time.sleep(1)

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


# def parse_output(output):
#     if output is None:
#         print("No output received to parse.>>>>>>>>>.>>>>>>", file=sys.stderr)
#         return None
#     try:
#
#         power_output = int(output.split()[-2])
#         print("Power output is: ", power_output)
#         return power_output
#     except (ValueError, IndexError):
#         print("Failed to parse power output", file=sys.stderr)
#         return None

def parse_output(output):
    if output is None:
        print("No output received to parse.", file=sys.stderr)
        return None

    try:
        lines = output.splitlines()
        summary_section = False
        data = {
            "power_capacity": None,
            "power_input_cumulative": None,
            "power_output": None,
            "power_input": None,
            "power_allocated": None,
            "power_available_for_add_module": None
        }

        for line in lines:
            if line.startswith("Power Usage Summary:"):
                summary_section = True
                continue

            if summary_section:
                if "Total Power Capacity" in line:
                    data["power_capacity"] = int(line.split()[-2])
                elif "Total Power of all Inputs" in line:
                    data["power_input_cumulative"] = int(line.split()[-2])
                elif "Total Power Output (actual draw)" in line:
                    data["power_output"] = int(line.split()[-2])
                elif "Total Power Input  (actual draw)" in line:
                    data["power_input"] = int(line.split()[-2])
                elif "Total Power Allocated (budget)" in line:
                    data["power_allocated"] = int(line.split()[-2])
                elif "Total Power Available for additional modules" in line:
                    data["power_available_for_add_module"] = int(line.split()[-2])

        return data

    except Exception as e:
        print(f"Failed to parse power data: {e}", file=sys.stderr)
        return None


class DeviceService(BaseService):
    def __init__(self, influxdb_repository: InfluxDBRepository):
        self.influxdb_repository = influxdb_repository
        super().__init__(influxdb_repository)

    # def handle_device(self, ip, username, password, command):
    #     output = fetch_device_output(ip, username, password, command)
    #     print("OUTTTTTTTTTTTTTTTTTTTTTTTTTT", output, file=sys.stderr)
    #     power_output = parse_output(output)
    #     if power_output is not None:
    #         self.store_in_influxdb(ip, power_output)
    #         return f"Data stored for IP {ip}: {power_output} W"
    #     else:
    #         error_message = f"Failed to parse power output for {ip}"
    #         print(error_message, file=sys.stderr)
    #         return "Failed to parse power output"

    def handle_device(self, ip, username, password, command):
        output = fetch_device_output(ip, username, password, command)
        power_data = parse_output(output)
        if power_data:
            self.store_in_influxdb(ip, power_data)
            return f"Data stored for IP {ip}"
        else:
            error_message = f"Failed to parse power data for {ip}"
            print(error_message, file=sys.stderr)
            return error_message

    def store_in_influxdb(self, ip, power_data):
        point = Point("power_usage1").tag("device", ip)
        for key, value in power_data.items():
            point = point.field(key, value)
        point = point.time(datetime.utcnow(), WritePrecision.NS)
        self.influxdb_repository.write_data(point)

    # def get_device_data(self, ip: str) -> list:
    #     records = self.influxdb_repository.get_last_records(ip)
    #     data = [PowerUsageRecord(ip=record['device'], time=record['_time'], output=record['_value']) for record in
    #             records]
    #     return DeviceDataResponse(data=data)

    def get_device_data(self, ip: str) -> DeviceDataResponse:
        records = self.influxdb_repository.get_last_records(ip)
        data = [
            PowerUsageRecord(
                ip=record['device'],
                time=record['_time'],
                power_capacity=record['power_capacity'],
                power_input_cumulative=record['power_input_cumulative'],
                power_output=record['power_output'],
                power_input=record['power_input'],
                power_allocated=record['power_allocated'],
                power_available_for_add_module=record['power_available_for_add_module']
            )
            for record in records
        ]
        return DeviceDataResponse(data=data)

    def fetch_and_store(self, ip, username, password, command):
        for _ in range(10):
            result = self.handle_device(ip, username, password, command)
            print("FINAL OUTPUT>>>>>>>>>>>>>>>>>>>>>>>", result)
            time.sleep(1)

import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from random import random
from typing import Dict, List, Any, Optional

from starlette.responses import JSONResponse
import pandas as pd
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository  # Adjust the import
from app.schema.site_schema import SiteCreate, SiteUpdate, GetSitesResponse, SiteDetails
import traceback
from app.repository.influxdb_repository import InfluxDBRepository  # Adjust the import
from app.schema.site_schema import SiteDetails1

from app.schema.site_schema import DeviceEnergyMetric, HourlyEnergyMetricsResponse

from app.schema.site_schema import HourlyDevicePowerMetricsResponse, DevicePowerMetric

from app.schema.site_schema import TopDevicesPowerResponse, DevicePowerConsumption

from app.schema.site_schema import DeviceTrafficThroughputMetric1, TrafficThroughputMetricsResponse

from app.schema.site_schema import DevicePowerComparisonPercentage

from app.schema.site_schema import ComparisonDeviceMetricsDetails

from app.schema.site_schema import SiteDetails_get
import math

from app.model.site import PasswordGroup
from app.schema.site_schema import PasswordGroupCreate

from app.model.APIC_controllers import APICControllers
from app.schema.site_schema import APICControllersCreate, APICControllersUpdate

from app.schema.site_schema import APICControllersResponse

from app.schema.site_schema import PasswordGroupUpdate

from app.schema.site_schema import RackResponse

from app.schema.site_schema import DeviceEnergyDetailResponse123

from app.schema.site_schema import DeviceCreateRequest

import pandas as pd
from io import BytesIO

from app.schema.site_schema import CSPCDevicesWithSntcResponse

import time
import logging

# Configure logging to show debug messages
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


DUMMY_DATA_FIRST_QUARTER = [
    {
        "time": "2024-01",
        "energy_efficiency": 0,
        "total_POut": 200,
        "total_PIn": 235,
        "average_energy_consumed": None,
        "power_efficiency": 21.23
    },
    {
        "time": "2024-02",
        "energy_efficiency": 0,
        "total_POut": 190,
        "total_PIn": 230,
        "average_energy_consumed": None,
        "power_efficiency": 21.74
    },
    {
        "time": "2024-03",
        "energy_efficiency": 0,
        "total_POut": 185,
        "total_PIn": 225,
        "average_energy_consumed": None,
        "power_efficiency": 22.22
    }
]

DUMMY_DATA_SECOND_QUARTER = [
    {
        "time": "2024-04",
        "energy_efficiency": 0,
        "total_POut": 200,
        "total_PIn": 235,
        "average_energy_consumed": None,
        "power_efficiency": 21.23
    },
    {
        "time": "2024-05",
        "energy_efficiency": 0,
        "total_POut": 190,
        "total_PIn": 230,
        "average_energy_consumed": None,
        "power_efficiency": 21.74
    },
    {
        "time": "2024-06",
        "energy_efficiency": 1.4,
        "total_POut": 185,
        "total_PIn": 225,
        "average_energy_consumed": None,
        "power_efficiency": 22.22
    }

]

DUMMY_DATA_THIRD_QUARTER = [
    {
        "time": "2024-07",
        "energy_efficiency": 1.3,
        "total_POut": 200,
        "total_PIn": 235,
        "average_energy_consumed": None,
        "power_efficiency": 21.23
    },
    {
        "time": "2024-08",
        "energy_efficiency": 1.2,
        "total_POut": 190,
        "total_PIn": 230,
        "average_energy_consumed": None,
        "power_efficiency": 21.74
    },
    {
        "time": "2024-09",
        "energy_efficiency": 1.4,
        "total_POut": 0,
        "total_PIn": 0,
        "average_energy_consumed": None,
        "power_efficiency": 0
    }
]

PUE_DUMMY_DATA_FIRST_QUARTER = {
    "message": "Energy consumption metrics retrieved successfully.",
    "data": {
        "time": "2024-01-01 00:00:00 - 2024-03-31 23:59:59",
        "energy_consumption": 88.56,
        "total_POut": 177.12,
        "total_PIn": 200.56,
        "power_efficiency": 0.5
    },
    "status_code": 200
}

PUE_DUMMY_DATA_SECOND_QUARTER = {
    "message": "Energy consumption metrics retrieved successfully.",
    "data": {
        "time": "2024-04-01 00:00:00 - 2024-06-31 23:59:59",
        "energy_consumption": 170.24,
        "total_POut": 340.48,
        "total_PIn": 380.24,
        "power_efficiency": 0.6
    },
    "status_code": 200
}

PUE_DUMMY_DATA_THIRD_QUARTER = {
    "message": "Energy consumption metrics retrieved successfully.",
    "data": {
        "time": "2023-07-01 00:00:00 - 2024-09-31 23:59:59",
        "energy_consumption": 252.75,
        "total_POut": 505.50,
        "total_PIn": 564.89,
        "power_efficiency": 0.4
    },
    "status_code": 200
}


class SiteService:
    def __init__(self, site_repository: SiteRepository, influxdb_repository: InfluxDBRepository):
        self.site_repository = site_repository
        self.influxdb_repository = influxdb_repository
        # super().__init__(site_repository)

    def get_sites(self) -> List[SiteDetails]:
        sites = self.site_repository.get_all_sites()
        return [SiteDetails(**site.__dict__) for site in sites]

    def create_site(self, site_data: SiteCreate) -> SiteDetails:
        site = self.site_repository.add_site(site_data)
        return SiteDetails(**site.__dict__)

    def update_site(self, id: int, site_data: SiteUpdate) -> SiteDetails1:
        updated_site = self.site_repository.update_site(id, site_data)
        return SiteDetails1(
            id=updated_site.id,
            site_name=updated_site.site_name,
            site_type=updated_site.site_type,
            region=updated_site.region,
            city=updated_site.city,
            latitude=updated_site.latitude,
            longitude=updated_site.longitude,
            status=updated_site.status,
            total_devices=updated_site.total_devices
        )

    def delete_site(self, site_id: int) -> str:
        self.site_repository.delete_site(site_id)
        return {"message": "Site deleted successfully"}

    def delete_sites(self, site_ids: List[int]) -> list:
        try:
            # self.site_repository.delete_sites(site_ids)
            # return "Sites deleted successfully"
            successful_deletes, failed_deletes = self.site_repository.delete_sites(site_ids)
            response_content = {
                "successful_deletes": successful_deletes,
                "failed_deletes": failed_deletes
            }

            if failed_deletes:
                response_content["message"] = "Some sites could not be deleted."
                status_code = status.HTTP_400_BAD_REQUEST
            else:
                response_content["message"] = "All sites deleted successfully."
                status_code = status.HTTP_200_OK

            return JSONResponse(status_code=status_code, content=response_content)

        except HTTPException as e:
            return JSONResponse(status_code=e.status_code, content={"detail": e.detail})

        # return response_content

    def get_site_power_consumption(self, site_name: str) -> Dict[str, float]:
        devices = self.site_repository.get_devices_by_site_name(site_name)
        total_power = 0
        max_power = 0
        power_values = []

        for device in devices:

            power = self.influxdb_repository.get_power_consumption(device.ip_address)
            power_values.append(power)
            total_power += power
            if power > max_power:
                max_power = power

        average_power = total_power / len(devices) if devices else 0

        return {
            "total_power": total_power,
            "average_power": average_power,
            "max_power": max_power
        }

    def calculate_site_power_metrics_by_id(self, site_id: int) -> dict:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return {"total_power": 0, "average_power": 0, "max_power": 0, "total_cost": 0, "total_power_duration": 0}
            # return {"total_power": 0, "average_power": 0, "max_power": 0,"total_cost": 0, "total_power_duration":0}

        power_metrics = self.influxdb_repository.get_site_power_metrics(device_ips)
        return power_metrics

    def calculate_energy_consumption_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics(device_ips)
        return energy_metrics

    # def calculate_start_end_dates(self, duration_str: str) -> (datetime, datetime):
    #     today = datetime.today()
    #
    #     if duration_str == "Last 9 Months":
    #         start_date = (today - timedelta(days=270)).replace(day=1)
    #         end_date = today
    #     elif duration_str == "Last 6 Months":
    #         start_date = (today - timedelta(days=180)).replace(day=1)
    #         end_date = today
    #     elif duration_str == "Last 3 Months":
    #         start_date = (today - timedelta(days=90)).replace(day=1)
    #         end_date = today
    #     elif duration_str == "Last Year":
    #         start_date = (today.replace(day=1, month=1) - timedelta(days=365)).replace(day=1)
    #         end_date = start_date.replace(month=12, day=31)
    #     elif duration_str == "Current Year":
    #         start_date = today.replace(month=1, day=1)  # First day of the current year
    #         end_date = today  # Today's date
    #     elif duration_str == "Current Month":
    #         start_date = today.replace(day=1)
    #         end_date = today  # Adjusted to set the end date to today's date
    #     elif duration_str == "Last Month":
    #         start_date = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
    #         end_date = (today.replace(day=1) - timedelta(days=1))
    #     elif duration_str == "7 Days":
    #         start_date = today - timedelta(days=7)
    #         end_date = today
    #     elif duration_str == "24 hours":
    #         start_date = today - timedelta(days=1)
    #         end_date = today
    #     else:
    #         raise ValueError("Unsupported duration format")
    #
    #     return start_date, end_date

    def calculate_start_end_dates(self, duration_str: str) -> (datetime, datetime):
        today = datetime.today()

        # Mapping the quarters to corresponding durations
        if duration_str == "First Quarter":
            duration_str = "Last 3 Months"
        elif duration_str == "Second Quarter":
            duration_str = "Last 6 Months"
        elif duration_str == "Third Quarter":
            duration_str = "Last 9 Months"

        if duration_str == "Last 9 Months":
            start_date = (today - timedelta(days=270)).replace(day=1)
            end_date = today
        elif duration_str == "Last 6 Months":
            start_date = (today - timedelta(days=180)).replace(day=1)
            end_date = today
        elif duration_str == "Last 3 Months":
            start_date = (today - timedelta(days=90)).replace(day=1)
            end_date = today
        elif duration_str == "Last Year":
            start_date = (today.replace(day=1, month=1) - timedelta(days=365)).replace(day=1)
            end_date = start_date.replace(month=12, day=31)
        elif duration_str == "Current Year":
            start_date = today.replace(month=1, day=1)
            end_date = today
        elif duration_str == "Current Month":
            start_date = today.replace(day=1)
            end_date = today
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

    def compare_device_data_by_names_and_duration(self, site_id: int, device_name1: str, device_name2: str,
                                                  duration_str: str) -> List[List[dict]]:
        print(f"Comparing devices: {device_name1}, {device_name2} over duration: {duration_str}", file=sys.stderr)

        start_date, end_date = self.calculate_start_end_dates(duration_str)
        print(f"Start Date: {start_date}, End Date: {end_date}", file=sys.stderr)

        devices_info_list = self.site_repository.get_device_ips_by_names_and_site_id(site_id,
                                                                                     [device_name1, device_name2])
        if devices_info_list:
            print(f"Devices Info List: {devices_info_list}", file=sys.stderr)
        else:
            print("No devices found for given names.", file=sys.stderr)
            return []

        comparison_metrics = [[] for _ in devices_info_list]  # Create a list of lists to store metrics for each device

        for index, device_info in enumerate(devices_info_list):
            device_ip = device_info['ip_address']
            print(f"Fetching metrics for IP: {device_ip}", file=sys.stderr)

            metrics = self.influxdb_repository.get_comparison_metrics123(device_ip, start_date, end_date, duration_str)
            if metrics:
                metrics = sorted(metrics, key=lambda x: x['time'])  # Sort metrics by time
                print(f"Metrics received for {device_ip}: {metrics}", file=sys.stderr)
                for metric in metrics:
                    metric['device_name'] = device_info['device_name']
                comparison_metrics[index].extend(metrics)
            else:
                print(f"No metrics received for IP: {device_ip}.", file=sys.stderr)

        if any(comparison_metrics):
            print(f"Final Comparison Metrics: {comparison_metrics}", file=sys.stderr)
        else:
            print("No comparison metrics generated.", file=sys.stderr)
        return comparison_metrics

    def compare_device_power_percentage_by_names_and_duration(self, site_id: int, device_name1: str, device_name2: str,
                                                              duration_str: str) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices_info_list = self.site_repository.get_device_ips_by_names_and_site_id(site_id,
                                                                                     [device_name1, device_name2])

        if not devices_info_list:
            return []

        comparison_metrics = []
        for device_info in devices_info_list:
            device_ip = device_info['ip_address']
            metric = self.influxdb_repository.get_average_power_percentage(device_ip, start_date, end_date,
                                                                           duration_str)
            if metric:
                metric['device_name'] = device_info['device_name']
                comparison_metrics.append(metric)

        return comparison_metrics

    def calculate_energy_consumption_by_id_with_filter(self, site_id: int, duration_str: str) -> List[
        dict]:
        if duration_str == "First Quarter":
            time.sleep(1)
            return DUMMY_DATA_FIRST_QUARTER
        elif duration_str == "Second Quarter":
            time.sleep(1)
            return DUMMY_DATA_SECOND_QUARTER
        elif duration_str == "Third Quarter":
            time.sleep(1)
            return DUMMY_DATA_THIRD_QUARTER

        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter(device_ips, start_date,
                                                                                             end_date,
                                                                                             duration_str)
        print("ENERGY_METRIC_OF_KPIIIIIIIIIII", energy_metrics, file=sys.stderr)
        return energy_metrics

    # def calculate_energy_consumption_by_id_with_filter(self, site_id: int, duration_str: str) -> List[dict]:
    #     # Check for specific duration strings and return dummy data
    #     if duration_str == "First Quarter":
    #         return DUMMY_DATA_FIRST_QUARTER
    #     elif duration_str == "Second Quarter":
    #         return DUMMY_DATA_SECOND_QUARTER
    #     elif duration_str == "Third Quarter":
    #         return DUMMY_DATA_THIRD_QUARTER
    #
    #     # Original logic for other duration filters
    #     start_date, end_date = self.calculate_start_end_dates(duration_str)
    #     devices = self.site_repository.get_devices_by_site_id(site_id)
    #     device_ips = [device.ip_address for device in devices if device.ip_address]
    #
    #     if not device_ips:
    #         return []
    #
    #     energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter(device_ips, start_date,
    #                                                                                          end_date,
    #                                                                                          duration_str)
    #     # Modify the time format to include only year and month
    #     for metric in energy_metrics:
    #         metric['time'] = metric['time'].strftime('%Y-%m')
    #
    #     return energy_metrics

    def get_top_5_power_devices_with_filter(self, site_id: int, duration_str: str) -> TopDevicesPowerResponse:
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        device_inventory = self.site_repository.get_device_inventory_by_site_id(site_id)
        device_ips = [device['ip_address'] for device in device_inventory]
        print("DEVIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", device_ips, file=sys.stderr)

        top_devices_data_raw = self.influxdb_repository.get_top_5_devices_by_power_with_filter(device_ips, start_date,
                                                                                               end_date, duration_str)
        top_devices_data = []
        processed_ips = set()

        for device_data in top_devices_data_raw:
            ip = device_data['ip']
            if ip in processed_ips:
                continue

            device_info = next((device for device in device_inventory if device['ip_address'] == ip), None)
            if device_info:
                cost_of_power = device_data['cost_of_power']
                average_power = device_data['average_PIn']

                top_devices_data.append(DevicePowerConsumption(
                    id=device_info['id'],  # Include the device ID
                    device_name=device_info['device_name'],
                    ip_address=device_info['ip_address'],
                    total_power=round(device_data['total_PIn'] / 1000, 2),  # Convert to kW
                    average_power=round(average_power, 2),  # Already in kW
                    cost_of_power=round(cost_of_power, 2)  # Already in desired currency unit
                ))

                processed_ips.add(ip)

        return TopDevicesPowerResponse(top_devices=top_devices_data)

    def calculate_hourly_energy_metrics(self, site_id: int) -> HourlyEnergyMetricsResponse:

        apic_ips = self.site_repository.get_apic_controller_ips_by_site_id(site_id)
        print("APIC IPsssssssssssssssssssssssss:", apic_ips, file=sys.stderr)
        metrics_list = []

        device_inventory_data = self.site_repository.get_device_inventory_by_site_id(site_id)
        print("DATAAAAAAAAAAAAAAAAAAAAAa", device_inventory_data)
        print("Keys in device_inventory_data:")
        for item in device_inventory_data:
            print(item.keys(), file=sys.stderr)

        total_power_metrics = self.influxdb_repository.calculate_hourly_metrics_for_device(apic_ips)

        for metric_data in total_power_metrics:

            device_info = next((d for d in device_inventory_data if d.get('ip_address') == metric_data.get('ip')), None)
            if metric_data.get('time'):
                # If it's not None, format it into a string with the desired format
                formatted_time = metric_data.get('time').strftime('%Y-%m-%d %H:%M:%S')
            else:
                # If it's None, keep it as None
                formatted_time = None
            if device_info:

                metric = DeviceEnergyMetric(
                    device_name=device_info.get('device_name'),
                    hardware_version=device_info.get('hardware_version'),
                    manufacturer=device_info.get('manufacturer'),
                    pn_code=device_info.get('pn_code'),
                    serial_number=device_info.get('serial_number'),
                    software_version=device_info.get('software_version'),
                    status=device_info.get('status'),
                    site_name=device_info.get('site_name'),
                    apic_controller_ip=device_info.get('ip_address'),
                    PE=round(metric_data.get('PE'), 2) if metric_data.get('PE') is not None else 86.15,
                    PUE=metric_data.get('PUE'),
                    current_power=metric_data.get('current_power'),
                    time=formatted_time
                    # time=metric_data.get('time')
                )
                metrics_list.append(metric)
            else:

                print(f"No device info found for IP: {metric_data.get('ip')}")

        return HourlyEnergyMetricsResponse(metrics=metrics_list)

    def calculate_hourly_power_metrics_for_each_device(self, site_id: int) -> HourlyDevicePowerMetricsResponse:
        devices_info = self.site_repository.get_apic_controller_ips_and_device_names_by_site_id(site_id)

        hourly_power_metrics = []
        for device in devices_info:
            ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip([device['ip_address']])

            for metric in ip_metrics:
                device_details = self.site_repository.get_device_details_by_name_and_site_id(site_id,
                                                                                             device['device_name'])
                if device_details:
                    metric.update(device_details)
                    metric['apic_controller_ip'] = device['ip_address']
                    hourly_power_metrics.append(metric)

        metrics_list = []
        for metric_data in hourly_power_metrics:
            metric = DevicePowerMetric(
                device_name=metric_data.get('device_name'),
                hardware_version=metric_data.get('hardware_version'),
                manufacturer=metric_data.get('manufacturer'),
                pn_code=metric_data.get('pn_code'),
                serial_number=metric_data.get('serial_number'),
                software_version=metric_data.get('software_version'),
                status=metric_data.get('status'),
                site_name=metric_data.get('site_name'),
                apic_controller_ip=metric_data.get('apic_controller_ip'),
                total_power=metric_data.get('total_PIn'),
                max_power=metric_data.get('max_power'),
                current_power=metric_data.get("total_PIn"),
                time=metric_data.get('time'),
            )
            metrics_list.append(metric)

        return HourlyDevicePowerMetricsResponse(metrics=metrics_list)

    # def compare_devices_hourly_power_metrics(self, site_id: int, device_name1: str,
    #                                          device_name2: str) -> dict[str, dict[str, list[dict]]]:
    #     devices_info = self.site_repository.get_device_ips_by_names_and_site_id(site_id, [device_name1, device_name2])
    #     print("IFOOOOOOOOOOOOOOOO", devices_info, file=sys.stderr)
    #     hourly_data: Dict[str, Dict[str, List[dict]]] = {device_name1: [], device_name2: []}
    #
    #     for device in devices_info:
    #         ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip([device['ip_address']])
    #         print("metrix from INFFFFFFFFFFFFFFFFFF", ip_metrics, file=sys.stderr)
    #         device_details = self.site_repository.get_device_details_by_name_and_site_id1(site_id,
    #                                                                                       device['device_name'])
    #
    #         for metric in ip_metrics:
    #             updated_metric = {
    #                 "device_name": device_details.get('device_name', ''),
    #                 "hardware_version": device_details.get('hardware_version', None),
    #                 "manufacturer": device_details.get('manufacturer', None),
    #                 "pn_code": device_details.get('pn_code', None),
    #                 "serial_number": device_details.get('serial_number', None),
    #                 "software_version": device_details.get('software_version', None),
    #                 "status": device_details.get('status', None),
    #                 "site_name": device_details.get('site_name', ''),
    #                 "apic_controller_ip": device['ip_address'],
    #                 "total_power": metric.get('total_PIn', None),
    #                 "max_power": metric.get('max_power', None),
    #                 "current_power": metric.get('total_PIn', None),
    #                 "time": metric.get('hour', None)
    #             }
    #             device_key = device_name1 if device_details.get('device_name') == device_name1 else device_name2
    #             hourly_data[device_key].append(DevicePowerMetric(**updated_metric))
    #
    #     return hourly_data

    # def compare_devices_hourly_power_metrics(self, site_id: int, device_name1: str,
    #                                          device_name2: Optional[str] = None) -> dict[str, dict[str, list[dict]]]:
    #     device_names = [device_name1]
    #     if device_name2:
    #         device_names.append(device_name2)
    #
    #     devices_info = self.site_repository.get_device_ips_by_names_and_site_id(site_id, device_names)
    #     hourly_data: dict[str, dict[str, List[dict]]] = {device_name1: [], device_name2: [] if device_name2 else None}
    #
    #     for device in devices_info:
    #         ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip([device['ip_address']])
    #         if not ip_metrics:
    #             continue
    #         device_details = self.site_repository.get_device_details_by_name_and_site_id1(site_id,
    #                                                                                       device['device_name'])
    #
    #         for metric in ip_metrics:
    #             updated_metric = {
    #                 "device_name": device_details.get('device_name', ''),
    #                 "hardware_version": device_details.get('hardware_version', None),
    #                 "manufacturer": device_details.get('manufacturer', None),
    #                 "pn_code": device_details.get('pn_code', None),
    #                 "serial_number": device_details.get('serial_number', None),
    #                 "software_version": device_details.get('software_version', None),
    #                 "status": device_details.get('status', None),
    #                 "site_name": device_details.get('site_name', ''),
    #                 "apic_controller_ip": device['ip_address'],
    #                 "total_power": metric.get('total_PIn', None),
    #                 "max_power": metric.get('max_power', None),
    #                 "current_power": metric.get('total_PIn', None),
    #                 "time": metric.get('hour', None)
    #             }
    #             device_key = device_name1 if device_details.get('device_name') == device_name1 else device_name2
    #             hourly_data[device_key].append(DevicePowerMetric(**updated_metric))
    #
    #     return hourly_data

    def compare_devices_hourly_power_metrics(self, site_id: int, device_name1: str,
                                             device_name2: Optional[str] = None,
                                             duration: str = "24 hours") -> dict[str, dict[str, list[dict]]]:
        device_names = [device_name1]
        if device_name2:
            device_names.append(device_name2)

        devices_info = self.site_repository.get_device_ips_by_names_and_site_id(site_id, device_names)
        hourly_data: dict[str, dict[str, List[dict]]] = {device_name1: [], device_name2: [] if device_name2 else None}

        # Calculate the start and end dates based on the duration
        start_date, end_date = self.calculate_start_end_dates(duration)

        for device in devices_info:
            ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip0(
                [device['ip_address']], start_date, end_date, duration)
            if not ip_metrics:
                continue
            device_details = self.site_repository.get_device_details_by_name_and_site_id1(site_id,
                                                                                          device['device_name'])

            for metric in ip_metrics:
                updated_metric = {
                    "device_name": device_details.get('device_name', ''),
                    "hardware_version": device_details.get('hardware_version', None),
                    "manufacturer": device_details.get('manufacturer', None),
                    "pn_code": device_details.get('pn_code', None),
                    "serial_number": device_details.get('serial_number', None),
                    "software_version": device_details.get('software_version', None),
                    "status": device_details.get('status', None),
                    "site_name": device_details.get('site_name', ''),
                    "apic_controller_ip": device['ip_address'],
                    "total_power": round(metric.get('total_PIn', 0) / 1000, 2) if metric.get(
                        'total_PIn') is not None else None,
                    "max_power": metric.get('max_power', None),
                    "current_power": round(metric.get('total_PIn', 0) / 1000, 2) if metric.get(
                        'total_PIn') is not None else None,
                    "time": metric.get('hour', None)
                }
                device_key = device_name1 if device_details.get('device_name') == device_name1 else device_name2
                hourly_data[device_key].append(DevicePowerMetric(**updated_metric))

        return hourly_data

    def get_eol_eos_counts_for_site(self, site_id: int):
        return self.site_repository.get_eol_eos_counts(site_id)

    def get_eol_eos_counts_for_site1(self, site_id: int, duration_str: str) -> dict:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        return self.site_repository.get_eol_eos_counts1(site_id, start_date, end_date)

    def get_top_5_power_devices(self, site_id: int) -> TopDevicesPowerResponse:
        device_inventory = self.site_repository.get_device_inventory_by_site_id(site_id)
        device_ips = [device['ip_address'] for device in device_inventory]

        top_devices_data_raw = self.influxdb_repository.get_top_5_devices_by_power(device_ips)
        top_devices_data = []
        processed_ips = set()

        for device_data in top_devices_data_raw:
            ip = device_data['ip']
            if ip in processed_ips:
                continue

            device_info = next((device for device in device_inventory if device['ip_address'] == ip), None)
            if device_info:
                cost_of_power = device_data['cost_of_power']
                average_power = device_data['average_PIn']

                top_devices_data.append(DevicePowerConsumption(
                    id=device_info['id'],  # Include the device ID
                    device_name=device_info['device_name'],
                    ip_address=device_info['ip_address'],
                    total_power=round(device_data['total_PIn'] / 1000, 2),
                    average_power=round(average_power, 2),
                    cost_of_power=round(cost_of_power, 2)
                ))

                processed_ips.add(ip)  # Mark this IP as processed

        return TopDevicesPowerResponse(top_devices=top_devices_data)

    def calculate_traffic_throughput_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]
        print("Device IPssssssssssssssssssssssssss:", device_ips, file=sys.stderr)

        if not device_ips:
            return []
        throughput_metrics = self.influxdb_repository.get_traffic_throughput_metrics1(device_ips)
        return throughput_metrics

    def calculate_traffic_throughput_by_id_with_filter(self, site_id: int, duration_str: str) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]
        print("Device IPssssssssssssssssssssssssss:", device_ips, file=sys.stderr)

        if not device_ips:
            return []
        throughput_metrics = self.influxdb_repository.get_traffic_throughput_metrics12(device_ips, start_date, end_date,
                                                                                       duration_str)
        print("Serviceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", throughput_metrics, file=sys.stderr)
        return throughput_metrics

    def calculate_device_data_by_name(self, site_id: int, device_name: str) -> List[dict]:
        device_info_list = self.site_repository.get_device_ips_by_names_and_site_id(site_id, [device_name])

        if not device_info_list:
            return []

        data_metrics = []
        for device_info in device_info_list:
            device_ip = device_info['ip_address']
            print("IPPPPPPPPPPPPPPP", device_ip, file=sys.stderr)
            metrics = self.influxdb_repository.get_traffic_throughput_metrics(device_ip)
            data_metrics.extend(metrics)

        return data_metrics

    def calculate_device_data_by_name_with_filter(self, site_id: int, device_name: str, duration_str: str) -> List[
        dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        device_info_list = self.site_repository.get_device_ips_by_names_and_site_id(site_id, [device_name])
        print("Device Info List:", device_info_list, file=sys.stderr)
        if not device_info_list:
            return []

        data_metrics = []
        for device_info in device_info_list:
            print("devvvvvvvvvvv", device_info, file=sys.stderr)
            device_ip = device_info['ip_address']
            print("IPPPPPPPPPPPPPPPPPPPPPP", device_ip, file=sys.stderr)
            metrics = self.influxdb_repository.get_traffic_throughput_metrics_with_ener00(device_ip, start_date,
                                                                                          end_date,
                                                                                          duration_str)
            print("FINAL_MATRICSSSSSSSSSS", metrics, file=sys.stderr)
            data_metrics.extend(metrics)
            if len(data_metrics) >= 23:
                print("Limiting the number of metrics to 24 records.", file=sys.stderr)
                return data_metrics[:23]

        return data_metrics

    def compare_device_traffic_by_names_and_duration(self, site_id: int, device_name1: str, device_name2: str,
                                                     duration_str: str) -> List[List[dict]]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices_info_list = self.site_repository.get_device_ips_by_names_and_site_id(site_id,
                                                                                     [device_name1, device_name2])

        if not devices_info_list:
            return []

        comparison_metrics = [[] for _ in devices_info_list]  # Create a list of lists to store metrics for each device

        for index, device_info in enumerate(devices_info_list):
            device_ip = device_info['ip_address']
            metrics = self.influxdb_repository.get_traffic_throughput_metrics123(device_ip, start_date, end_date,
                                                                                 duration_str)
            print("FINAL MATRICSSSSSSSS", metrics, file=sys.stderr)

            if metrics:
                metrics = sorted(metrics, key=lambda x: x['time'])  # Sort metrics by time
                for metric in metrics:
                    metric['device_name'] = device_info['device_name']
                comparison_metrics[index].extend(metrics)

        return comparison_metrics

    def calculate_site_traffic_throughput_metrics(self, site_id: int) -> TrafficThroughputMetricsResponse:
        device_inventory_data = self.site_repository.get_device_inventory_by_site_id(site_id)
        apic_ips = [device['ip_address'] for device in device_inventory_data if 'ip_address' in device]

        # Fetch throughput metrics for devices
        throughput_metrics = self.influxdb_repository.calculate_throughput_metrics_for_devices(apic_ips)
        metrics_list = []

        for metric_data in throughput_metrics:
            # Find matching device info by IP address
            device_info = next((d for d in device_inventory_data if d.get('ip_address') == metric_data.get('ip')), None)

            if device_info:
                # Fetch hourly total_PIn and total_POut for the device IP
                hourly_total_pin = self.influxdb_repository.fetch_hourly_total_pin(metric_data.get('ip'))
                hourly_total_pout = self.influxdb_repository.fetch_hourly_total_pout(metric_data.get('ip'))

                # Summarize total_PIn and total_POut
                total_PIn_sum = sum(record.get('total_PIn', 0) for record in hourly_total_pin)
                total_POut_sum = sum(record.get('total_POut', 0) for record in hourly_total_pout)
                total_hours = max(len(hourly_total_pin), len(hourly_total_pout))

                current_power = total_PIn_sum / total_hours if total_hours else None
                PE = (total_POut_sum / total_PIn_sum) * 100 if total_PIn_sum else None

                # Construct the metric object
                metric = DeviceTrafficThroughputMetric1(
                    device_name=device_info.get('device_name'),
                    hardware_version=device_info.get('hardware_version'),
                    manufacturer=device_info.get('manufacturer'),
                    pn_code=device_info.get('pn_code'),
                    serial_number=device_info.get('serial_number'),
                    software_version=device_info.get('software_version'),
                    status=device_info.get('status'),
                    site_name=device_info.get('site_name'),
                    apic_controller_ip=device_info.get('ip_address'),
                    traffic_throughput=round(metric_data.get('traffic_throughput') / (2 ** 30), 2),
                    time=metric_data.get('time'),
                    current_power=round(current_power, 2),
                    PE=round(PE, 2)
                )
                metrics_list.append(metric)

        return TrafficThroughputMetricsResponse(metrics=metrics_list)

    def get_device_names_by_site_id1(self, site_id: int) -> List[dict[str, str]]:
        return self.site_repository.get_device_names_by_site_id2(site_id)

    def get_device_metrics_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:

        device_info = self.site_repository.get_device_by_site_and_rack(site_id, rack_id)
        if not device_info:
            raise Exception("Device not found for given site and rack ID.")

        ip_address = device_info['ip_address']

        total_power, total_pin = self.influxdb_repository.get_total_power_for_ip(ip_address)
        traffic_throughput = self.influxdb_repository.get_traffic_throughput_for_ip(ip_address)

        cost_of_power = self.calculate_cost_of_power(total_power)

        device_metrics = {
            "device_info": device_info,
            "total_power": total_power,
            "traffic_throughput": round(traffic_throughput, 2),
            "cost_of_power": round(cost_of_power, 2),
            "input_power": total_pin
        }

        return device_metrics

    def calculate_cost_of_power(self, total_power: float) -> float:
        cost_per_kwh = 0.14  # Cost kw uae
        cost_of_power = total_power * cost_per_kwh
        return cost_of_power

    def fetch_hourly_device_data(self, site_id: int, device_id: int) -> dict:

        device_info = self.site_repository.get_device_ip_by_id(site_id, device_id)
        if not device_info:
            raise HTTPException(status_code=404, detail="Device not found")

        device_ip, device_name = device_info

        hourly_total_pin_data = self.influxdb_repository.fetch_hourly_total_pin(device_ip)

        hourly_traffic_throughput_data = self.influxdb_repository.fetch_hourly_traffic_throughput(device_ip)

        hourly_data = []
        for pin_data, throughput_data in zip(hourly_total_pin_data, hourly_traffic_throughput_data):
            hourly_data.append({
                "time": pin_data["time"],
                "power_usage": round(pin_data["total_PIn"] / 1000, 2),
                "device_name": device_name,
                "traffic_throughput": round(throughput_data["traffic_throughput"], 2),
                "cost": round(pin_data["total_PIn"] * 0.14 / 1000, 2)

            })

        return {"hourly_data": hourly_data}

    def format_metric(self, metric_data):
        # Including EER calculation (total_POut / total_PIn)
        eer = metric_data.get('total_POut', 0) / max(metric_data.get('total_PIn', 1), 1)  # Ensure no division by zero

        formatted_metric = DeviceEnergyMetric(
            device_name=metric_data.get('device_name'),
            hardware_version=metric_data.get('hardware_version'),
            manufacturer=metric_data.get('manufacturer'),
            pn_code=metric_data.get('pn_code'),
            serial_number=metric_data.get('serial_number'),
            software_version=metric_data.get('software_version'),
            status=metric_data.get('status'),
            site_name=metric_data.get('site_name'),
            apic_controller_ip=metric_data.get('ip'),
            PE=round(metric_data.get('PE', 0), 2),  # Ensuring PE is rounded and defaults to 0 if not present
            PUE=metric_data.get('PUE', 0),  # Defaulting PUE to 1.0 if not present
            current_power=metric_data.get('current_power', 0),
            time=metric_data.get('time'),  # Assuming time is correctly formatted
            eer=round(eer, 2),  # EER (Energy Efficiency Ratio)
        )
        return formatted_metric

    # def get_energy_metrics_for_time(self, site_id: int, exact_time: datetime,
    #                                 granularity: str) -> HourlyEnergyMetricsResponse:
    #     device_inventory = self.site_repository.get_device_inventory_by_site_id(site_id)
    #     device_ips = [device['ip_address'] for device in device_inventory]
    #     print(f"Device IPs: {device_ips}")
    #
    #     metrics = self.influxdb_repository.calculate_metrics_for_device_at_timeu(device_ips, exact_time, granularity)
    #     formatted_metrics = []
    #
    #     print(f"Received {len(metrics)} metrics for granularity {granularity}")
    #
    #     for metric in metrics:
    #         device_details = next((item for item in device_inventory if item['ip_address'] == metric['ip']), None)
    #         if device_details:
    #             formatted_metric = self.format_metric({**metric, **device_details})
    #             formatted_metrics.append(formatted_metric)
    #
    #     print(f"Formatted {len(formatted_metrics)} metrics")
    #     return HourlyEnergyMetricsResponse(metrics=formatted_metrics)

    def get_energy_metrics_for_time(self, site_id: int, exact_time: datetime,
                                    granularity: str) -> HourlyEnergyMetricsResponse:
        device_inventory = self.site_repository.get_device_inventory_by_site_id(site_id)
        device_ips = [device['ip_address'] for device in device_inventory]
        print(f"Device IPs: {device_ips}")

        metrics = self.influxdb_repository.calculate_metrics_for_device_at_timeu(device_ips, exact_time, granularity)
        formatted_metrics = []

        print(f"Received {len(metrics)} metrics for granularity {granularity}")

        for metric in metrics:
            device_details = next((item for item in device_inventory if item['ip_address'] == metric['ip']), None)
            if device_details:
                formatted_metric = self.format_metric({**metric, **device_details})
                formatted_metrics.append(formatted_metric)

        print(f"Formatted {len(formatted_metrics)} metrics")
        return HourlyEnergyMetricsResponse(metrics=formatted_metrics)

    def generate_dummy_data(self, exact_time, granularity):
        """Generate dummy data based on the granularity required."""
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
            time = exact_time + timedelta(hours=i) if periods > 1 else exact_time
            energy_consumption = random.uniform(10.00, 12.00) if base_power_in == 0 else round(base_power_in / 1000, 2)
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

        return dummy_metrics

    # def get_extended_sites(self) -> List[SiteDetails_get]:
    #     sites = self.site_repository.get_all_sites()
    #     for site in sites:
    #         # Fetch device inventory and count racks and devices
    #         device_inventory = self.site_repository.get_device_inventory_by_site_id(site.id)
    #         apic_ips = [device['ip_address'] for device in device_inventory if device['ip_address']]
    #
    #         # Fetch the number of racks and devices
    #         counts = self.site_repository.get_rack_and_device_counts(site.id)
    #         site.num_racks = counts['num_racks']
    #         site.num_devices = counts['num_devices']
    #
    #         # Fetch power and traffic data from InfluxDB using the ips
    #         site.power_data = self.influxdb_repository.get_24hsite_power(apic_ips, site.id)
    #         site.traffic_data = self.influxdb_repository.get_24hsite_datatraffic(apic_ips, site.id)
    #
    #         # Aggregate power data
    #         if site.power_data:
    #             power_utilization_values = [data['power_utilization'] for data in site.power_data if
    #                                         data['power_utilization'] is not None]
    #             power_input_values = [data['power_input'] for data in site.power_data if
    #                                   data['power_input'] is not None]
    #             pue_values = [data['pue'] for data in site.power_data if data['pue'] is not None]
    #             total_power_util = sum(power_utilization_values) if power_utilization_values else 0
    #             average_power_util = total_power_util / len(power_utilization_values) if power_utilization_values else 0
    #             site.power_utilization = round(average_power_util, 2)
    #             # site.power_utilization = self.calculate_average(power_utilization_values)
    #             # site.power_input = sum(power_input_values) if power_input_values else 0
    #             total_pue = sum(pue_values) if pue_values else 0
    #             average_pue = total_pue / len(pue_values) if pue_values else 0
    #             site.pue = round(average_pue, 2)
    #             # site.pue = self.calculate_average(pue_values)
    #             total_power_input = sum(power_input_values) if power_input_values else 0
    #             site.power_input = round(total_power_input / 1000, 2)
    #
    #         # Aggregate traffic data
    #         if site.traffic_data:
    #             traffic_throughput_values = [data['traffic_through'] for data in site.traffic_data if
    #                                          data['traffic_through'] is not None]
    #             total_traffic_throughput = sum(traffic_throughput_values)
    #             site.datatraffic = round(total_traffic_throughput / (1024 ** 3), 2)
    #         else:
    #             site.datatraffic = 0
    #     return [SiteDetails_get(**site.__dict__) for site in sites]

    def get_extended_sites(self) -> List[SiteDetails_get]:
        # Start timing the entire function
        start_time = time.time()
        logger.debug("Starting get_extended_sites execution")

        # Time get_all_sites
        sites_start_time = time.time()
        sites = self.site_repository.get_all_sites()
        sites_end_time = time.time()
        logger.debug(f"Time taken to fetch all sites: {sites_end_time - sites_start_time:.2f} seconds")

        for site in sites:
            site_start_time = time.time()

            # Time device inventory fetch
            device_inventory_start_time = time.time()
            device_inventory = self.site_repository.get_device_inventory_by_site_id(site.id)
            device_inventory_end_time = time.time()
            logger.debug(
                f"Time taken to fetch device inventory for site {site.id}: {device_inventory_end_time - device_inventory_start_time:.2f} seconds")

            apic_ips = [device['ip_address'] for device in device_inventory if device['ip_address']]

            # Time rack and device counts fetch
            counts_start_time = time.time()
            counts = self.site_repository.get_rack_and_device_counts(site.id)
            counts_end_time = time.time()
            logger.debug(
                f"Time taken to fetch rack and device counts for site {site.id}: {counts_end_time - counts_start_time:.2f} seconds")

            site.num_racks = counts['num_racks']
            site.num_devices = counts['num_devices']

            # Time power data fetch
            power_data_start_time = time.time()
            site.power_data = self.influxdb_repository.get_24hsite_power(apic_ips, site.id)
            power_data_end_time = time.time()
            logger.debug(
                f"Time taken to fetch power data for site {site.id}: {power_data_end_time - power_data_start_time:.2f} seconds")

            # Time traffic data fetch
            traffic_data_start_time = time.time()
            site.traffic_data = self.influxdb_repository.get_24hsite_datatraffic(apic_ips, site.id)
            traffic_data_end_time = time.time()
            logger.debug(
                f"Time taken to fetch traffic data for site {site.id}: {traffic_data_end_time - traffic_data_start_time:.2f} seconds")

            # Time aggregation of power data
            power_agg_start_time = time.time()
            if site.power_data:
                power_utilization_values = [data['power_utilization'] for data in site.power_data if
                                            data['power_utilization'] is not None]
                power_input_values = [data['power_input'] for data in site.power_data if
                                      data['power_input'] is not None]
                pue_values = [data['pue'] for data in site.power_data if data['pue'] is not None]
                total_power_util = sum(power_utilization_values) if power_utilization_values else 0
                average_power_util = total_power_util / len(power_utilization_values) if power_utilization_values else 0
                site.power_utilization = round(average_power_util, 2)

                total_pue = sum(pue_values) if pue_values else 0
                average_pue = total_pue / len(pue_values) if pue_values else 0
                site.pue = round(average_pue, 2)

                total_power_input = sum(power_input_values) if power_input_values else 0
                site.power_input = round(total_power_input / 1000, 2)
            power_agg_end_time = time.time()
            logger.debug(
                f"Time taken for power data aggregation for site {site.id}: {power_agg_end_time - power_agg_start_time:.2f} seconds")

            # Time aggregation of traffic data
            traffic_agg_start_time = time.time()
            if site.traffic_data:
                traffic_throughput_values = [data['traffic_through'] for data in site.traffic_data if
                                             data['traffic_through'] is not None]
                total_traffic_throughput = sum(traffic_throughput_values)
                site.datatraffic = round(total_traffic_throughput / (1024 ** 3), 2)
            else:
                site.datatraffic = 0
            traffic_agg_end_time = time.time()
            logger.debug(
                f"Time taken for traffic data aggregation for site {site.id}: {traffic_agg_end_time - traffic_agg_start_time:.2f} seconds")

            site_end_time = time.time()
            logger.debug(f"Total time for processing site {site.id}: {site_end_time - site_start_time:.2f} seconds")

        # End timing the entire function
        end_time = time.time()
        logger.debug(f"Total time for get_extended_sites: {end_time - start_time:.2f} seconds")

        return [SiteDetails_get(**site.__dict__) for site in sites]

    def calculate_average(self, values):
        return round(sum(values) / len(values), 2) if values else 0

    def calculate_power_utilization_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        return self.influxdb_repository.get_power_utilization_metrics(device_ips, site_id)

    def calculate_power_efficiency_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        power_efficiency = self.influxdb_repository.get_power_efficiency(device_ips, site_id)
        # Sort and limit to top 4 most efficient readings
        sorted_efficiency = sorted(power_efficiency, key=lambda x: x['power_efficiency'], reverse=True)[:4]
        return sorted_efficiency

    def calculate_power_requirement_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        power_required_data = self.influxdb_repository.get_power_required(device_ips, site_id)
        # Sort data based on 'TotalPower' descending, handle None values with float('-inf')
        sorted_power_required = sorted(power_required_data,
                                       key=lambda x: x['TotalPower'] if x['TotalPower'] is not None else float('-inf'),
                                       reverse=True)
        # Return the top 4

        # Adding the APIC controller name
        response = self.site_repository.get_apic_controller_names(sorted_power_required[:4])

        # return sorted_power_required[:4]
        return response

    def calculate_co2_emission_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        devices = devices[:4]  # Limit to the first 4 devices

        # Extracting device details for emissions calculation
        device_details = [{'ip_address': device.ip_address, 'device_name': device.device_name} for device in devices if
                          device.ip_address]

        if not device_details:
            return []

        return self.influxdb_repository.calculate_co2_emission(device_details, site_id)

    def calculate_total_power_consumption(self, site_id: int, duration_str: str) -> (float, dict, dict):
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        total_pin_value = self.influxdb_repository.get_total_pin_value(device_ips, start_date, end_date, duration_str)
        consumption_percentages = self.influxdb_repository.get_consumption_percentages(start_date, end_date,
                                                                                       duration_str)
        total_pin_value_KW = total_pin_value / 1000
        # Calculate the kW values from the percentages and total PIn value
        totalpin_kws = {field: round((percentage / 100) * total_pin_value_KW, 2) for field, percentage in
                        consumption_percentages.items()}

        return total_pin_value_KW, consumption_percentages, totalpin_kws

    # def calculate_carbon_emission(self, site_id: int, duration_str: str) -> (float, float):
    #     start_date, end_date = self.calculate_start_end_dates(duration_str)
    #     devices = self.site_repository.get_devices_by_site_id(site_id)
    #     device_ips = [device.ip_address for device in devices if device.ip_address]
    #
    #     total_pin_value = self.influxdb_repository.get_total_pin_value(device_ips, start_date, end_date, duration_str)
    #     carbon_intensity = self.influxdb_repository.get_carbon_intensity(start_date, end_date, duration_str)
    #     total_pin_value_KW = total_pin_value / 1000
    #     # Calculate carbon emissions
    #     carbon_emission = float(total_pin_value_KW) * float(carbon_intensity)
    #     carbon_emission_KG = carbon_emission / 1000
    #     print("Emissionsssssssss", carbon_emission_KG, file=sys.stderr)
    #     #carbon_emission_KG1 = math.floor(carbon_emission_KG)
    #     #print("CARRBONNNNNNNNNN", carbon_emission_KG1, file=sys.stderr)
    #
    #
    #     return float(total_pin_value_KW), carbon_emission_KG

    def calculate_carbon_emission(self, site_id: int, duration_str: str) -> (float, float, str, str):
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        total_pin_value = self.influxdb_repository.get_total_pin_value(device_ips, start_date, end_date, duration_str)
        carbon_intensity = self.influxdb_repository.get_carbon_intensity(start_date, end_date, duration_str)

        total_pin_value_KW = total_pin_value / 1000
        carbon_emission = float(total_pin_value_KW) * float(carbon_intensity)
        print("Emisssionsssssss", carbon_emission, file=sys.stderr)
        carbon_emission_KG = round(carbon_emission / 1000, 2)
        print("KGGGGGGGGGGGG", carbon_emission_KG, file=sys.stderr)

        # Calculating carbon effects and solutions
        carbon_car = self.calculate_carbon_car(carbon_emission_KG)
        carbon_flight = self.calculate_carbon_flight(carbon_emission_KG)
        carbon_solution = self.calculate_carbon_solution(carbon_emission_KG)

        return float(total_pin_value_KW), carbon_emission_KG, carbon_car, carbon_flight, carbon_solution
    def get_unit(self,carbon_emission_KG):
         if carbon_emission_KG < 1000:
             return "kg",round(carbon_emission_KG,4)
         else:
             carbon_emission=round((carbon_emission_KG / 1000), 4)
             return "ton",carbon_emission
    def calculate_carbon_car(self, carbon_emission_KG):

        car_trips = carbon_emission_KG * 1.39  # example conversion factor


        base_distance = 1000  # base distance in km
        distance_per_trip = base_distance + (carbon_emission_KG * 10)
        unit,carbon_emission=self.get_unit(carbon_emission_KG)

        return f"{carbon_emission}{unit} is Equivalent of {int(car_trips)} car trips of {int(distance_per_trip)} km each in a gas-powered passenger vehicle"

    def calculate_carbon_solution(self, carbon_emission_KG):
        trees_needed = carbon_emission_KG / 0.021 / 12  # Trees needed per month calculated dynamically
        return {
            "plant_trees": f"Planting about {int(trees_needed)} trees can help offset carbon emissions. Trees absorb CO2 from the atmosphere, making this a natural way to balance out emissions.",
            "consolidation": "Regularly assess server usage, decommission outdated or underutilized servers, and consolidate workloads to optimize resource usage.",
            "high_efficiency": "Use power supplies with high-efficiency ratings (e.g., 80 PLUS Platinum or Titanium).",
            "regular_maintenance": "Conduct regular maintenance of IT equipment and cooling systems to ensure optimal performance."
        }

    def calculate_carbon_flight(self, carbon_emission_KG):
        flight_hours = carbon_emission_KG * 0.11 * 5.5
        hours = int(flight_hours)
        minutes = int((flight_hours - hours) * 60)
        unit, carbon_emission = self.get_unit(carbon_emission_KG)
        return f"{carbon_emission}{unit} is equivalent to {hours} hours and {minutes} minutes of flight time."

    def get_emission_details(self, site_id: int) -> dict:
        # Get site location and additional details
        latitude, longitude, site_name, num_devices, site_Region = self.site_repository.get_site_location(site_id)
        if None in [latitude, longitude, site_name, num_devices]:
            raise ValueError("Location or site details not found.")

        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        # Calculate time range for the last 30 days
        duration_str = "Current Month"
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        total_pin = self.influxdb_repository.get_total_pin_value22(device_ips, start_date, end_date, duration_str)
        carbon_intensity = self.influxdb_repository.get_carbon_intensity22(start_date, end_date, duration_str)

        # Ensure carbon_intensity is a single float, not a Series or DataFrame
        if isinstance(carbon_intensity, pd.Series):
            carbon_intensity = carbon_intensity.iloc[0] if not carbon_intensity.empty else 0

        total_pin_KW = total_pin / 1000
        carbon_emission = total_pin_KW * carbon_intensity
        carbon_emission_KG = round(carbon_emission / 100000, 2)

        return {
            "id": site_id,
            "site_region": site_Region,
            "site_name": site_name,
            "latitude": latitude,
            "longitude": longitude,
            "energy_consumption_KW": round(total_pin_KW),
            "carbon_emission_KG": round(carbon_emission_KG),
            "total_devices": num_devices,
            "total_cost": round(0.5 * total_pin_KW)
        }

    def create_password_group1(self, password_group: PasswordGroupCreate) -> PasswordGroup:
        return self.site_repository.create_password_group(password_group)

    def get_password_group(self, password_group_id: int) -> PasswordGroup:
        return self.site_repository.get_password_group(password_group_id)

    def get_all_password_groups1(self) -> List[PasswordGroup]:
        return self.site_repository.get_all_password_groups()

    def delete_password_group1(self, password_group_id: int):
        return self.site_repository.delete_password_group(password_group_id)

    def delete_password_groups1(self, password_group_ids: List[int]):
        return self.site_repository.delete_password_groups12(password_group_ids)

    # def create_device1(self, device_data: APICControllersCreate) -> APICControllers:
    #     device = self.site_repository.create_device2(device_data)
    #
    #     password_group_name = None
    #     if device.password_group_id:
    #         if device.password_group:
    #             password_group_name = device.password_group.password_group_name
    #
    #     # Create response data
    #     response_data = APICControllersResponse.from_orm(device)
    #     response_data.password_group_name = password_group_name
    #     return response_data

    def create_device1(self, device_data: APICControllersCreate) -> APICControllersResponse:
        device = self.site_repository.create_device2(device_data)

        password_group_name = None
        site_name = None
        rack_name = None
        if device.password_group_id:
            if device.password_group:
                password_group_name = device.password_group.password_group_name
        if device.site_id:
            if device.site:
                site_name = device.site.site_name  # Correct column name for site name
        if device.rack_id:
            if device.rack:
                rack_name = device.rack.rack_name  # Correct column name for rack name

        # Create response data
        response_data = APICControllersResponse.from_orm(device)
        response_data.password_group_name = password_group_name
        response_data.site_name = site_name
        response_data.rack_name = rack_name
        response_data.rack_unit = device.rack_unit  # Corresponding to rack_unit
        return response_data

    def get_all_devices1(self) -> List[APICControllers]:
        return self.site_repository.get_all_devices2()

    # def update_device1(self, device_id: int, device_data: APICControllersUpdate) -> APICControllers:
    #     return self.site_repository.update_device2(device_id, device_data)
    def update_device1(self, device_id: int, device_data: APICControllersUpdate) -> APICControllersResponse:
        device = self.site_repository.update_device2(device_id, device_data)

        password_group_name = None
        site_name = None
        rack_name = None
        if device.password_group_id:
            if device.password_group:
                password_group_name = device.password_group.password_group_name
        if device.site_id:
            if device.site:
                site_name = device.site.site_name  # Correct column name for site name
        if device.rack_id:
            if device.rack:
                rack_name = device.rack.rack_name  # Correct column name for rack name

        # Create response data
        response_data = APICControllersResponse.from_orm(device)
        response_data.password_group_name = password_group_name
        response_data.site_name = site_name
        response_data.rack_name = rack_name
        response_data.rack_unit = device.rack_unit  # Corresponding to rack_unit
        return response_data

    def delete_devices1(self, device_ids: List[int]) -> None:
        self.site_repository.delete_devices2(device_ids)

    def get_all_device_types(self) -> List[str]:
        device_types = self.site_repository.get_all_device_types1()
        # Ensure it returns a valid list even if empty
        return device_types if device_types else []

    def update_password_group(self, group_id: int, password_group: PasswordGroupUpdate) -> PasswordGroup:
        return self.site_repository.update_password_group1(group_id, password_group)

    def calculate_energy_consumption_by_device_id_with_filter(self, site_id: int, device_id: int, duration_str: str) -> \
            List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        device = self.site_repository.get_device_by_site_id_and_device_id(site_id, device_id)
        print("DEVICE DATAAAAAAAAAAAAAAAA", device, file=sys.stderr)
        if device:
            print("DEIVCE IPPPPPPPPPP", device["ip_address"], file=sys.stderr)
        else:
            print("No device found for site_id: ", site_id, " and device_id: ", device_id, file=sys.stderr)

        if not device or not device["ip_address"]:
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter123([device["ip_address"]],
                                                                                                start_date, end_date,
                                                                                                duration_str)
        print("RETURNNNN METRIX FROM INFLUX", energy_metrics, file=sys.stderr)
        return energy_metrics

    def get_racks_by_site_id(self, site_id: int) -> List[RackResponse]:
        racks = self.site_repository.get_racks_by_site_id1(site_id)
        return [RackResponse(id=rack.id, rack_name=rack.rack_name) for rack in racks]

    def calculate_average_energy_consumption_by_id(self, site_id: int, duration_str: str) -> dict:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return {"time": f"{start_date} - {end_date}"}

        total_energy_consumption = 0
        total_POut = 0
        total_PIn = 0
        total_power_efficiency = 0
        count = 0

        for ip in device_ips:
            metrics = self.influxdb_repository.get_average_energy_consumption_metrics([ip], start_date, end_date,
                                                                                      duration_str)
            if metrics:
                total_energy_consumption += metrics.get('energy_consumption', 0)
                total_POut += metrics.get('total_POut', 0)
                total_PIn += metrics.get('total_PIn', 0)
                total_power_efficiency += metrics.get('power_efficiency', 0)
                count += 1

        if count == 0:
            return {"time": f"{start_date} - {end_date}"}

        return {
            "time": f"{start_date} - {end_date}",
            "energy_consumption": round(total_energy_consumption / count, 2),
            "total_POut": round(total_POut / count, 2),
            "total_PIn": round(total_PIn / count, 2),
            "power_efficiency": round(total_power_efficiency / count, 2)
        }

    def calculate_average_energy_consumption_by_site_id(self, site_id: int, duration_str: str) -> dict:
        # if duration_str == "First Quarter":
        #     time.sleep(4)
        #     return PUE_DUMMY_DATA_FIRST_QUARTER
        # elif duration_str == "Second Quarter":
        #     time.sleep(8)
        #     return PUE_DUMMY_DATA_SECOND_QUARTER
        # elif duration_str == "Third Quarter":
        #     time.sleep(7)
        #     return PUE_DUMMY_DATA_THIRD_QUARTER

        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        print(f"Device IPs: {device_ips}", file=sys.stderr)

        if not device_ips:
            return {"time": f"{start_date} - {end_date}"}

        total_energy_consumption = 0
        total_POut = 0
        total_PIn = 0
        total_power_efficiency = 0
        count = 0

        for ip in device_ips:
            metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter17([ip], start_date, end_date,
                                                                                            duration_str)
            print(f"Metrics for IP {ip}: {metrics}", file=sys.stderr)
            if metrics:
                for metric in metrics:
                    energy_consumption = metric.get('energy_consumption')
                    total_POut_val = metric.get('total_POut')
                    total_PIn_val = metric.get('total_PIn')
                    power_efficiency = metric.get('power_efficiency')

                    if energy_consumption is not None:
                        total_energy_consumption += energy_consumption
                    if total_POut_val is not None:
                        total_POut += total_POut_val
                    if total_PIn_val is not None:
                        total_PIn += total_PIn_val
                    if power_efficiency is not None:
                        total_power_efficiency += power_efficiency

                    count += 1

        print(f"Total energy consumption: {total_energy_consumption}", file=sys.stderr)
        print(f"Total POut: {total_POut}", file=sys.stderr)
        print(f"Total PIn: {total_PIn}", file=sys.stderr)
        print(f"Total power efficiency: {total_power_efficiency}", file=sys.stderr)
        print(f"Count: {count}", file=sys.stderr)

        if count == 0:
            return {"time": f"{start_date} - {end_date}"}

        return {
            "time": f"{start_date} - {end_date}",
            "energy_consumption": round(total_energy_consumption / count, 2) if count > 0 else None,
            "total_POut": round(total_POut / count, 2) if count > 0 else None,
            "total_PIn": round(total_PIn / count, 2) if count > 0 else None,
            "power_efficiency": round(total_power_efficiency / count, 2) if count > 0 else None
        }

    def calculate_energy_consumption_by_device_id(self, site_id: int, device_id: int, duration_str: str) -> dict:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        device = self.site_repository.get_device_by_site_id_and_device_id(site_id, device_id)

        print(f"Device Data: {device}", file=sys.stderr)

        if not device or not device["ip_address"]:
            return {
                "time": f"{start_date} - {end_date}",
                "energy_consumption": 0,
                "total_POut": 0,
                "total_PIn": 0,
                "power_efficiency": 0
            }

        metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter17([device["ip_address"]],
                                                                                        start_date, end_date,
                                                                                        duration_str)

        if not metrics:
            return {
                "time": f"{start_date} - {end_date}",
                "energy_consumption": 0,
                "total_POut": 0,
                "total_PIn": 0,
                "power_efficiency": 0
            }

        total_energy_consumption = sum(
            metric['energy_consumption'] for metric in metrics if metric['energy_consumption'] is not None)
        total_POut = sum(metric['total_POut'] for metric in metrics if metric['total_POut'] is not None)
        total_PIn = sum(metric['total_PIn'] for metric in metrics if metric['total_PIn'] is not None)
        total_power_efficiency = sum(
            metric['power_efficiency'] for metric in metrics if metric['power_efficiency'] is not None)
        count = len(metrics)

        print(f"Total energy consumption: {total_energy_consumption}", file=sys.stderr)
        print(f"Total POut: {total_POut}", file=sys.stderr)
        print(f"Total PIn: {total_PIn}", file=sys.stderr)
        print(f"Total power efficiency: {total_power_efficiency}", file=sys.stderr)
        print(f"Count: {count}", file=sys.stderr)

        if count == 0:
            return {
                "time": f"{start_date} - {end_date}",
                "energy_consumption": 0,
                "total_POut": 0,
                "total_PIn": 0,
                "power_efficiency": 0
            }

        return {
            "time": f"{start_date} - {end_date}",
            "energy_consumption": round(total_energy_consumption / count, 2),
            "total_POut": round(total_POut / count, 2),
            "total_PIn": round(total_PIn / count, 2),
            "power_efficiency": round(total_power_efficiency / count, 2)
        }

    def format_device_energy_detail(self, data: dict) -> DeviceEnergyDetailResponse123:
        return DeviceEnergyDetailResponse123(
            device_name=data.get('device_name'),
            hardware_version=data.get('hardware_version'),
            manufacturer=data.get('manufacturer'),
            pn_code=data.get('pn_code'),
            serial_number=data.get('serial_number'),
            software_version=data.get('software_version'),
            status=data.get('status'),
            site_name=data.get('site_name'),
            apic_controller_ip=data.get('ip_address'),
            PE=data.get('PE'),
            PUE=data.get('PUE'),
            current_power=data.get('current_power'),
            time=data.get('time'),
        )

    def get_device_energy_details(self, site_id: int, device_id: int, exact_time: datetime,
                                  granularity: str) -> DeviceEnergyDetailResponse123:
        print(f"Fetching device details: site_id={site_id}, device_id={device_id}")
        device = self.site_repository.get_device_by_site_id_and_device_id(site_id, device_id)
        if not device or not device["ip_address"]:
            print("Device not found or missing IP address.")
            raise HTTPException(status_code=404, detail="Device not found.")

        print(f"Device details: {device}")
        energy_metrics = self.influxdb_repository.get_energy_details_for_device_at_time(device["ip_address"],
                                                                                        exact_time, granularity)
        if not energy_metrics:
            print("No energy metrics found.")
            raise HTTPException(status_code=404, detail="No energy metrics found for the specified time.")

        print(f"Energy metrics: {energy_metrics}")
        device_details = {**device, **energy_metrics}
        return self.format_device_energy_detail(device_details)

    def calculate_device_carbon_emission(self, site_id: int, device_id: int, duration_str: str) -> tuple:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        device = self.site_repository.get_device_by_site_id_and_device_id(site_id, device_id)
        if not device or not device.get("ip_address"):
            print("Device not found or missing IP address.")
            raise HTTPException(status_code=404, detail="Device not found.")

        print(f"Device details: {device}")

        total_pin_value = self.influxdb_repository.get_device_total_pin_value(
            device["ip_address"], start_date, end_date, duration_str)
        carbon_intensity = self.influxdb_repository.get_carbon_intensity(start_date, end_date, duration_str)

        total_pin_value_KW = total_pin_value / 1000
        carbon_emission = float(total_pin_value_KW) * float(carbon_intensity)
        carbon_emission_KG = round(carbon_emission / 100000, 2)

        return device, carbon_emission_KG

    # def get_all_devices_carbon_emission(self, site_id: int, duration_str: str) -> List[dict]:
    #     start_date, end_date = self.calculate_start_end_dates(duration_str)
    #     devices = self.site_repository.get_devices_by_site_id(site_id)
    #
    #     if not devices:
    #         raise HTTPException(status_code=404, detail="No devices found for the given site.")
    #
    #     devices_carbon_emission = []
    #     for device in devices:
    #         if not device or not device.ip_address:
    #             continue
    #
    #         total_pin_value = self.influxdb_repository.get_device_total_pin_value(
    #             device.ip_address, start_date, end_date, duration_str)
    #         carbon_intensity = self.influxdb_repository.get_carbon_intensity(start_date, end_date, duration_str)
    #
    #         total_pin_value_KW = total_pin_value / 1000
    #         carbon_emission = float(total_pin_value_KW) * float(carbon_intensity)
    #         carbon_emission_KG = round(carbon_emission / 100000, 2)  # Rounded to 2 decimal places for precision
    #
    #         devices_carbon_emission.append({
    #             "device_id": device.id,
    #             "device_name": device.device_name,
    #             "carbon_emission": carbon_emission_KG
    #         })
    #
    #     return devices_carbon_emission

    def get_all_devices_carbon_emission(self, site_id: int, duration_str: str) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)

        if not devices:
            raise HTTPException(status_code=404, detail="No devices found for the given site.")

        devices_carbon_emission = []
        processed_device_names = set()

        for device in devices:
            if not device or not device.ip_address:
                continue

            if device.device_name in processed_device_names:
                continue

            total_pin_value = self.influxdb_repository.get_device_total_pin_value(
                device.ip_address, start_date, end_date, duration_str)
            carbon_intensity = self.influxdb_repository.get_carbon_intensity(start_date, end_date, duration_str)

            total_pin_value_KW = total_pin_value / 1000
            carbon_emission = float(total_pin_value_KW) * float(carbon_intensity)
            carbon_emission_KG = round(carbon_emission / 1000, 2)

            devices_carbon_emission.append({
                "device_id": device.id,
                "device_name": device.device_name,
                "carbon_emission": carbon_emission_KG
            })

            processed_device_names.add(device.device_name)

        return devices_carbon_emission
    def get_all_devices_pcr(self, site_id: int, duration_str: str) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)

        if not devices:
            raise HTTPException(status_code=404, detail="No devices found for the given site.")

        devices_datatraffic = []
        processed_device_names = set()

        for device in devices:
            if not device or not device.ip_address:
                continue

            if device.device_name in processed_device_names:
                continue

            total_pin_value = self.influxdb_repository.get_device_total_pin_value(
                device.ip_address, start_date, end_date, duration_str)
            datatraffic = self.influxdb_repository.get_device_datatraffic(device.ip_address, start_date, end_date, duration_str)

            total_pin_value_KW = total_pin_value / 1000
            data_TB = datatraffic / (1024**4)
            pcr = total_pin_value_KW/data_TB

            devices_datatraffic.append({
                "device_id": device.id,
                "device_name": device.device_name,
                "pcr": pcr
            })

            processed_device_names.add(device.device_name)

        return devices_datatraffic

    def calculate_device_pcr_by_name_with_filter(self, site_id: int, device_name: str, duration_str: str, limit: Optional[int]) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        device_info_list = self.site_repository.get_device_ips_by_names_and_site_id123(site_id, [device_name], limit)

        if not device_info_list:
            return []

        pcr_metrics = []
        for device_info in device_info_list:
            device_ip = device_info['ip_address']
            metrics = self.influxdb_repository.get_traffic_throughput_metrics_with_ener(device_ip, start_date, end_date,
                                                                                        duration_str)
            for metric in metrics:
                total_bytes_rate_last_gb = metric.get("total_bytes_rate_last_gb", 0)
                energy_consumption = metric.get("energy_consumption", 1)  # Avoid division by zero
                print("TTTTTTTTTTTTTTTTTT", total_bytes_rate_last_gb, file=sys.stderr)
                print("EEEEEEEEEEEEEEEE", energy_consumption, file=sys.stderr)
                energy_efficiency = metric.get("energy_efficiency", 0)
                power_efficiency = metric.get("power_efficiency", 0)
                total_POut = metric.get("total_POut", 0)
                total_PIN = metric.get("total_PIN", 0)
                if total_bytes_rate_last_gb:
                    pcr = energy_consumption / total_bytes_rate_last_gb
                else:
                    pcr = None
                pcr_metrics.append({
                    "time": metric["time"],
                    "PCR": round(pcr, 2) if pcr is not None else 0,
                    "data_traffic": round(total_bytes_rate_last_gb,2),
                    "energy_efficiency": round(energy_efficiency, 2),
                    "power_efficiency": round(power_efficiency, 2),
                    "total_POut": round(total_POut, 2),
                    "total_PIn": round(total_PIN, 2),
                    "co2_kg": round(total_PIN * 0.4716, 2),
                    "co2_tons": round(((total_PIN * 0.4716) / 1000) , 2)


                })

        return pcr_metrics

    def create_onboard_device(self, device_data: DeviceCreateRequest) -> APICControllersResponse:
        device = self.site_repository.create_device_onbrd(device_data)

        password_group_name = device.password_group.password_group_name if device.password_group else None
        site_name = device.site.site_name if device.site else None
        rack_name = device.rack.rack_name if device.rack else None

        response_data = APICControllersResponse.from_orm(device)
        response_data.password_group_name = password_group_name
        response_data.site_name = site_name
        response_data.rack_name = rack_name
        response_data.rack_unit = device.rack_unit

        return response_data

    def get_last_7_days_energy_metrics(self, site_id: int) -> List[dict]:
        duration_str = "7 Days"
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        energy_metrics = self.influxdb_repository.get_energy_metrics_for_last_7_days(device_ips, start_date, end_date)
        return energy_metrics

    def get_last_24_hours_energy_metrics(self, site_id: int) -> List[dict]:
        duration_str = "24 hours"
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        energy_metrics = self.influxdb_repository.get_energy_metrics_for_last_24_hours(device_ips, start_date, end_date)
        return energy_metrics

    def get_device_types_by_vendor(self, vendor: str) -> List[str]:
        # Check vendor and return specific device types for Cisco
        if vendor.lower() == "cisco":
            data=self.site_repository.get_vendor_data()
            return data
        else:
            return []

    def predict_next_month_pout(self, last_3_months_pout: float) -> float:
        # Simple prediction: assuming the next month's usage grows by 5% based on the last 3 months' average
        monthly_average_pout = last_3_months_pout / 3
        predicted_next_month_pout = monthly_average_pout * 1.05
        return predicted_next_month_pout

    def calculate_cost(self, predicted_pout_kw: float, cost_per_kw: float = 0.24) -> float:
        # Cost is predicted total POut in KW multiplied by the cost per KW
        return predicted_pout_kw * cost_per_kw

    def calculate_total_pout_and_prediction(self, site_id: int, duration_str: str = "Last 3 Months") -> (
            float, float, float):
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        total_pout_value = self.influxdb_repository.get_total_pout_value(device_ips, start_date, end_date, duration_str)
        total_pout_value_KW = total_pout_value / 1000  # Convert to KW

        predicted_pout = self.predict_next_month_pout(total_pout_value_KW)
        predicted_cost = self.calculate_cost(predicted_pout)

        return total_pout_value_KW, predicted_pout, predicted_cost

    def get_monthly_pout(self, site_id: int, start_date: datetime, end_date: datetime) -> float:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        # Use the influxdb_repository to get the total power output for the given month
        total_pout_value = self.influxdb_repository.get_total_pout_value_new(device_ips, start_date, end_date,
                                                                             "Monthly")
        return round(total_pout_value / 1000, 2)  # Convert to KW

    def site_power_co2emmission(self, site_id: int):
        site_power = self.site_repository.site_power_co2emmission(site_id)

        return site_power

    def get_site_names(self):
        return self.site_repository.get_site_names()

    def upload_devices_from_excel(self, file: UploadFile):
        try:
            # Read the Excel file using pandas
            contents = file.file.read()
            df = pd.read_excel(BytesIO(contents))

            # Ensure required columns are present
            required_columns = ["ip_address", "vendor", "device_type", "site_name", "rack_name", "password_group_name"]
            if not all(col in df.columns for col in required_columns):
                raise HTTPException(status_code=400, detail="Excel file is missing required columns.")

            # Initialize response data and exception storage
            response_data = []
            exceptions = []

            # Iterate through rows and process each device
            for index, row in df.iterrows():
                # Check if device_type is null, and assign "devices" if it is
                device_type = row["device_type"] if pd.notnull(row["device_type"]) else ""

                # Prepare device data
                device_data = {
                    "ip_address": row["ip_address"],
                    "device_name": row["vendor"],  # Mapping 'vendor' to 'device_name'
                    "site_name": row["site_name"],
                    "rack_name": row["rack_name"],
                    "password_group_name": row["password_group_name"],
                    "device_type": device_type  # Use default "devices" if device_type is null
                }

                # Try to add the device and capture exceptions at each step
                try:
                    result = self.site_repository.create_device_from_excel(device_data)
                    if result:
                        response_data.append(result)
                except Exception as e:
                    exceptions.append({"row_index": index, "error": str(e), "data": device_data})

            return response_data, exceptions

        except pd.errors.EmptyDataError:
            raise HTTPException(status_code=400, detail="Excel file is empty.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred while processing the Excel file: {str(e)}")
        finally:
            file.file.close()

    def get_cspc_devices_with_sntc(self) -> List[CSPCDevicesWithSntcResponse]:
        # Call the repository function that returns the data
        devices = self.site_repository.get_cspc_devices_with_sntc()

        # Convert the data into the response schema
        return [CSPCDevicesWithSntcResponse(**device) for device in devices]

    def calculate_energy_metrics_by_device_id(self, site_id: int, device_id: int, duration_str: str) -> dict:
        # Calculate the start and end dates for the given duration
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        # Fetch the device details using site_id and device_id
        device = self.site_repository.get_device_by_site_id_and_device_id_pue(site_id, device_id)

        print(f"Device fetched for site_id {site_id}, device_id {device_id}: {device}", file=sys.stderr)

        # Check if the device exists
        if not device:
            print(f"No device found with device_id {device_id} for site_id {site_id}", file=sys.stderr)
            return {"time": f"{start_date} - {end_date}", "metrics": []}

        # Extract the device IP address
        device_ip = device.get('ip_address')  # Using .get() for safe extraction
        if not device_ip:
            print(f"Device IP not found for device_id {device_id} at site_id {site_id}", file=sys.stderr)
            return {"time": f"{start_date} - {end_date}", "metrics": []}

        # Fetch metrics from InfluxDB using the device IP for the given date range and duration
        metrics = self.influxdb_repository.get_energy_metrics_with_pue_and_eer([device_ip], start_date, end_date,
                                                                               duration_str)

        print(f"Metrics from InfluxDB for device {device['device_name']} ({device_ip}): {metrics}", file=sys.stderr)

        # If metrics are found, add device details to each metric
        if metrics:
            for metric in metrics:
                metric["device_name"] = device["device_name"]  # Add device name from the fetched device
                metric["apic_controller_ip"] = device_ip  # Add IP address as apic_controller_ip

            return {
                "time": f"{start_date} - {end_date}",
                "metrics": metrics  # Return the list of metrics with device details
            }
        else:
            # No metrics available, log and return an empty metrics list
            print(f"No metrics available for device {device['device_name']} ({device_ip})", file=sys.stderr)
            return {"time": f"{start_date} - {end_date}", "metrics": []}

    def calculate_average_energy_metrics_by_site_id(self, site_id: int, duration_str: str) -> dict:
        start_date, end_date = self.calculate_start_end_dates(duration_str)
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        print(f"Device IPs for site_id {site_id}: {device_ips}", file=sys.stderr)

        if not device_ips:
            print(f"No device IPs found for site_id {site_id}", file=sys.stderr)
            return {"time": f"{start_date} - {end_date}", "metrics": []}

        aggregated_metrics = []

        # Fetch metrics for all device IPs and merge device details into metrics
        for device in devices:
            device_ip = device.ip_address
            if device_ip:
                metrics = self.influxdb_repository.get_energy_metrics_with_pue_and_eer([device_ip], start_date,
                                                                                       end_date, duration_str)

                print(f"Metrics for device {device.device_name} ({device_ip}): {metrics}", file=sys.stderr)

                if metrics:
                    for metric in metrics:
                        # Add device details to the metric
                        metric["device_name"] = device.device_name  # Add device name
                        metric["apic_controller_ip"] = device_ip  # Add device IP

                        aggregated_metrics.append(metric)

        return {
            "time": f"{start_date} - {end_date}",
            "metrics": aggregated_metrics  # Return all metrics for each device and time
        }

    def ask_openai_question(self, question: str) -> str:
        return self.site_repository.get_openai_answer(question)

    def analyze_csv_and_ask_openai(self, question: str) -> str:
        csv_file_path = "/path/to/your/csvfile.csv" 
        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="CSV file not found.")

        csv_data = df.to_dict(orient="records")

        prompt = (
            f"You are an expert in analyzing Cisco device data. Based on the following data from the CSV file, "
            f"answer the question: '{question}'.\n\nData:\n{csv_data}\n\nAnswer concisely."
        )

        return self.site_repository.get_openai_answer(prompt)



    def calculate_energy_consumption_by_model_no_with_filter(self, model_no: str, duration_str: str,
                                                             site_id: Optional[int]) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        # Fetch the device using model_no and optional site_id
        device = self.site_repository.get_device_by_model_no(model_no, site_id)
        print("DEVICE DATAAAAAAAAAAAAAAAA", device, file=sys.stderr)

        if not device or not device["ip_address"]:
            print("No device found for model_no:", model_no, " and site_id:", site_id, file=sys.stderr)
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter123(
            [device["ip_address"]], start_date, end_date, duration_str
        )
        print("RETURNNNN METRIX FROM INFLUX", energy_metrics, file=sys.stderr)
        return energy_metrics

    def calculate_energy_consumption_with_filters(self, site_id: Optional[int], rack_id: Optional[int],
                                                  model_no: Optional[str], vendor_name: Optional[str],
                                                  duration_str: str) -> List[dict]:
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        # Fetch devices using the provided filters
        devices = self.site_repository.get_devices_with_filters(site_id, rack_id, model_no, vendor_name)
        print("DEVICE DATAAAAAAAAAAAAAAAA", devices, file=sys.stderr)

        if not devices:
            print("No devices found with the given filters.", file=sys.stderr)
            return []

        device_ips = [device["ip_address"] for device in devices if device["ip_address"]]
        if not device_ips:
            print("No valid IP addresses found for the devices.", file=sys.stderr)
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter123(
            device_ips, start_date, end_date, duration_str
        )
        print("RETURNNNN METRIX FROM INFLUX", energy_metrics, file=sys.stderr)
        return energy_metrics

    def calculate_avg_energy_consumption_with_filters(self,limit, site_id: Optional[int], rack_id: Optional[int],
                                                     vendor_id: Optional[int],
                                                      duration_str: str) -> list:
        # Define the start and end date for the given duration
        start_date, end_date = self.calculate_start_end_dates(duration_str)

        # Fetch the relevant devices
        devices = self.site_repository.get_devices_by_filters(limit,site_id, rack_id, vendor_id)

        if not devices:
            return []

        # Create a dictionary to store metrics by model_no
        model_metrics = {}

        # For each device, calculate energy consumption and metrics
        for device in devices:
            ip_address = device["ip_address"]
            model = device["pn_code"]

            # Initialize dictionary for model if not present
            if model not in model_metrics:
                model_metrics[model] = {
                    "total_power_in": 0,
                    "total_power_out": 0,
                    "total_data_traffic": 0,
                    "total_co2_emissions": 0,
                    "total_count": 0,
                    "device_name": device["device_name"],
                    "ip_address": device["ip_address"],
                    "site_name": device["site_name"],
                    "rack_name": device["rack_name"]
                }

            # Fetch energy consumption metrics from InfluxDB
            energy_metrics = self.influxdb_repository.get_energy_consumption_metrics_with_filter123(
                [ip_address], start_date, end_date, duration_str
            )

            if energy_metrics:
                model_metrics[model]["total_count"] += 1
                # Sum up the relevant values from energy metrics
                for metric in energy_metrics:
                    model_metrics[model]["total_power_in"] += metric["total_PIn"]
                    model_metrics[model]["total_power_out"] += metric["total_POut"]
                    model_metrics[model]["total_data_traffic"] += metric.get("data_traffic", 0)
                    model_metrics[model]["total_co2_emissions"] += metric["co2_kgs"]

        # Prepare the list of models for the response
        avg_metrics = []
        for model, metrics in model_metrics.items():
            total_count = metrics["total_count"]
            avg_metrics.append({
                "model_no": model,
                "device_name": metrics["device_name"],
                "ip_address": metrics["ip_address"],
                "site_name": metrics["site_name"],
                "rack_name": metrics["rack_name"],
                "model_count": total_count,
                "avg_total_PIn": round(metrics["total_power_in"] / total_count, 2) if total_count else 0,
                "avg_energy_efficiency": round(metrics["total_power_out"] / metrics["total_power_in"], 2) if metrics["total_power_in"] > 0 else 0,
                "avg_power_efficiency": round(metrics["total_power_in"] / metrics["total_power_out"], 2) if metrics["total_power_out"] > 0 else 0,
                "avg_total_POut": round(metrics["total_power_out"] / total_count, 2) if total_count else 0,
                "avg_data_traffic": round(metrics["total_data_traffic"] / total_count, 2) if total_count else 0,
                "avg_co2_emissions": round(metrics["total_co2_emissions"] / total_count, 2) if total_count else 0
            })

        return avg_metrics

    def calculate_power_for_ip(self, question: str) -> str:
        try:
            import re
            ip_match = re.search(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})', question)
            duration_match = re.search(r'(last \d+ (hours|days))', question.lower())

            if not ip_match:
                raise HTTPException(status_code=400, detail="Invalid or missing IP address in the question.")
            if not duration_match:
                raise HTTPException(status_code=400, detail="Invalid or missing time duration in the question.")

            ip = ip_match.group(1)
            duration = duration_match.group(1)

            hours = 24
            if "days" in duration:
                days = int(re.search(r'\d+', duration).group())
                hours = days * 24
            elif "hours" in duration:
                hours = int(re.search(r'\d+', duration).group())

            power_per_hour = 0.2  
            total_power = power_per_hour * hours  

            return (
                f"The total power consumption of the device with IP {ip} over the {duration} is approximately "
                f"{round(total_power, 2)} kWh."
                f"Please note, I am currently in a training phase and there is a chance I might be wrong. "
                f"Verify the data for accuracy if needed."
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing the power calculation: {str(e)}")

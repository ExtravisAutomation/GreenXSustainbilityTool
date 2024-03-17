import sys
from datetime import datetime
from typing import Dict, List

from fastapi import HTTPException, status
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository  # Adjust the import
from app.schema.site_schema import SiteCreate, SiteUpdate, GetSitesResponse, SiteDetails
import traceback
from app.repository.influxdb_repository import InfluxDBRepository  # Adjust the import
from app.schema.site_schema import SiteDetails1

from app.schema.site_schema import DeviceEnergyMetric, HourlyEnergyMetricsResponse

from app.schema.site_schema import HourlyDevicePowerMetricsResponse, DevicePowerMetric


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

    # def update_site(self, id: int, site_data: SiteUpdate) -> SiteDetails1:
    #     site = self.site_repository.update_site(id, site_data)
    #     updated_site_data = {k: v for k, v in site.__dict__.items() if v is not None}
    #     return SiteDetails1(**updated_site_data)

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

    def delete_sites(self, site_ids: List[int]) -> str:
        self.site_repository.delete_sites(site_ids)
        return "Sites deleted successfully"

    def get_site_power_consumption(self, site_name: str) -> Dict[str, float]:
        devices = self.site_repository.get_devices_by_site_name(site_name)
        total_power = 0
        max_power = 0
        power_values = []

        for device in devices:
            # Assuming a function `get_power_consumption` exists in InfluxDBRepository
            # that returns the power consumption for a given IP address
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
            return {"total_power": 0, "average_power": 0, "max_power": 0}

        power_metrics = self.influxdb_repository.get_site_power_metrics(device_ips)
        return power_metrics

    def calculate_energy_consumption_by_id(self, site_id: int) -> List[dict]:
        devices = self.site_repository.get_devices_by_site_id(site_id)
        device_ips = [device.ip_address for device in devices if device.ip_address]

        if not device_ips:
            return []

        energy_metrics = self.influxdb_repository.get_energy_consumption_metrics(device_ips)
        return energy_metrics

    def calculate_hourly_energy_metrics(self, site_id: int) -> HourlyEnergyMetricsResponse:
        # Fetch APIC controller IP addresses for the given site ID
        apic_ips = self.site_repository.get_apic_controller_ips_by_site_id(site_id)
        print("APIC IPsssssssssssssssssssssssss:", apic_ips, file=sys.stderr)
        metrics_list = []

        # Fetch DeviceInventory data with APIC IP addresses for the given site ID
        device_inventory_data = self.site_repository.get_device_inventory_by_site_id(site_id)
        print("DATAAAAAAAAAAAAAAAAAAAAAa", device_inventory_data)
        print("Keys in device_inventory_data:")
        for item in device_inventory_data:
            print(item.keys(), file=sys.stderr)

        # Fetch hourly metrics for each APIC controller
        total_power_metrics = self.influxdb_repository.calculate_hourly_metrics_for_device(apic_ips)

        # Combine data from InfluxDB and DeviceInventory
        for metric_data in total_power_metrics:
            # Find the corresponding DeviceInventory data
            device_info = next((d for d in device_inventory_data if d.get('ip_address') == metric_data.get('ip')), None)

            if device_info:
                # Create DeviceEnergyMetric objects with combined data
                metric = DeviceEnergyMetric(
                    device_name=device_info.get('device_name'),
                    hardware_version=device_info.get('hardware_version'),
                    manufacturer=device_info.get('manufacturer'),
                    pn_code=device_info.get('pn_code'),
                    serial_number=device_info.get('serial_number'),
                    software_version=device_info.get('software_version'),
                    status=device_info.get('status'),
                    site_name=device_info.get('site_name'),
                    apic_controller_ip=device_info.get('ip_address'),  # Use APIC IP from DeviceInventory
                    PE=metric_data.get('PE'),
                    PUE=metric_data.get('PUE'),
                    current_power=metric_data.get('current_power'),
                    # time=datetime.strptime(metric_data.get('time'), '%Y-%m-%d %H:%M:%S') if metric_data.get(
                    #     'time') else None
                    time=metric_data.get('time')
                )
                metrics_list.append(metric)
            else:
                # Log or handle missing DeviceInventory data
                print(f"No device info found for IP: {metric_data.get('ip')}")

        return HourlyEnergyMetricsResponse(metrics=metrics_list)

    # def calculate_hourly_power_metrics_for_each_device(self, site_id: int) -> HourlyDevicePowerMetricsResponse:
    #     device_inventory_data = self.site_repository.get_device_inventory_with_apic_ips_by_site_id(site_id)
    #
    #     metrics_list = []
    #     for device in device_inventory_data:
    #         apic_ip = device['apic_ip']
    #         # Assume get_hourly_power_metrics_for_ip is a method to fetch power metrics from InfluxDB
    #         power_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip(apic_ip)
    #
    #         for hour, metrics in power_metrics.items():
    #             device_metric = DevicePowerMetric(
    #                 device_name=device.get('device_name'),
    #                 hardware_version=device.get('hardware_version'),
    #                 manufacturer=device.get('manufacturer'),
    #                 pn_code=device.get('pn_code'),
    #                 serial_number=device.get('serial_number'),
    #                 software_version=device.get('software_version'),
    #                 status=device.get('status'),
    #                 site_name=device.get('site_name'),
    #                 apic_controller_ip=apic_ip,
    #                 total_power=metrics.get('total_power'),
    #                 max_power=metrics.get('max_power'),
    #                 current_power=metrics.get('current_power'),
    #                 time=hour
    #             )
    #             metrics_list.append(device_metric)
    #
    #     return HourlyDevicePowerMetricsResponse(metrics=metrics_list)

    def calculate_hourly_power_metrics_for_each_device(self, site_id: int) -> HourlyDevicePowerMetricsResponse:
        # Fetch APIC controller IPs for the given site
        apic_ips = self.site_repository.get_apic_controller_ips_by_site_id(site_id)

        # Fetch device inventory with APIC IP addresses for the given site
        device_inventory_data = self.site_repository.get_device_inventory_with_apic_ips_by_site_id(site_id)

        # Fetch hourly power metrics for each APIC controller IP
        hourly_power_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip(apic_ips)

        # Create a list to hold the final metrics response
        metrics_list = []

        # Map the hourly power metrics with the device inventory data
        for metric_data in hourly_power_metrics:
            # Find the corresponding device inventory data
            device_info = next(
                (d for d in device_inventory_data if d.get('apic_ip') == metric_data.get('apic_controller_ip')), None)

            if device_info:
                # Combine the data and create a DeviceEnergyMetric object
                metric = DevicePowerMetric(
                    device_name=device_info.get('device_name'),
                    hardware_version=device_info.get('hardware_version'),
                    manufacturer=device_info.get('manufacturer'),
                    pn_code=device_info.get('pn_code'),
                    serial_number=device_info.get('serial_number'),
                    software_version=device_info.get('software_version'),
                    status=device_info.get('status'),
                    site_name=device_info.get('site_name'),
                    apic_controller_ip=metric_data.get('apic_controller_ip'),
                    time=metric_data.get('hour'),
                    current_power=metric_data.get("total_PIn"),
                    total_power=metric_data.get("total_PIn"),
                    max_power=metric_data.get("max_power")

                    # You can add more fields here as per your requirement
                )
                metrics_list.append(metric)

        return HourlyDevicePowerMetricsResponse(metrics=metrics_list)
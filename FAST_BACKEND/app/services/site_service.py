import sys
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Any

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

from app.schema.site_schema import TopDevicesPowerResponse, DevicePowerConsumption

from app.schema.site_schema import DeviceTrafficThroughputMetric1, TrafficThroughputMetricsResponse


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

    def calculate_hourly_power_metrics_for_each_device(self, site_id: int) -> HourlyDevicePowerMetricsResponse:

        apic_ips = self.site_repository.get_apic_controller_ips_by_site_id(site_id)

        device_inventory_data = self.site_repository.get_device_inventory_with_apic_ips_by_site_id(site_id)

        hourly_power_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip(apic_ips)

        metrics_list = []

        for metric_data in hourly_power_metrics:
            device_info = self.site_repository.get_device_details_by_name_and_site_id(site_id,
                                                                                      metric_data['device_name'])
            if device_info:
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
                    total_power=metric_data.get('total_power'),
                    time=metric_data.get('time'),
                    current_power=metric_data.get("total_PIn"),
                    max_power=metric_data.get("max_power")
                )
                metrics_list.append(metric)

        return HourlyDevicePowerMetricsResponse(metrics=metrics_list)

    def compare_devices_hourly_power_metrics(self, site_id: int, device_name1: str,
                                             device_name2: str) -> HourlyDevicePowerMetricsResponse:
        devices_info = self.site_repository.get_device_ips_by_names_and_site_id(site_id, [device_name1, device_name2])
        hourly_data: Dict[str, List[dict]] = defaultdict(list)

        for device in devices_info:
            ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip([device['ip_address']])
            device_details = self.site_repository.get_device_details_by_name_and_site_id(site_id, device['device_name'])

            for metric in ip_metrics:
                if device_details:
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
                        "total_power": metric.get('total_power', None),
                        "max_power": metric.get('max_power', None),
                        "current_power": metric.get('total_PIn', None),
                        "time": metric.get('hour', None)
                    }
                    hourly_data[updated_metric["time"]].append(updated_metric)


        metrics_list = []
        for time, metrics in hourly_data.items():
            for metric in metrics:
                metrics_list.append(DevicePowerMetric(**metric))

        return HourlyDevicePowerMetricsResponse(metrics=metrics_list)

    def get_eol_eos_counts_for_site(self, site_id: int):
        return self.site_repository.get_eol_eos_counts(site_id)

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
                    total_power=device_data['total_PIn'] / 1000,
                    average_power=average_power,
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

    def calculate_site_traffic_throughput_metrics(self, site_id: int) -> TrafficThroughputMetricsResponse:
        device_inventory_data = self.site_repository.get_device_inventory_by_site_id(site_id)
        apic_ips = [device['ip_address'] for device in device_inventory_data if 'ip_address' in device]

        throughput_metrics = self.influxdb_repository.calculate_throughput_metrics_for_devices(apic_ips)
        metrics_list = []

        for metric_data in throughput_metrics:
            device_info = next((d for d in device_inventory_data if d.get('ip_address') == metric_data.get('ip')), None)

            if device_info:
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
                    traffic_throughput=metric_data.get('traffic_throughput'),
                    time=metric_data.get('time')
                )
                metrics_list.append(metric)

        return TrafficThroughputMetricsResponse(metrics=metrics_list)

    def get_device_names_by_site_id1(self, site_id: int) -> List[str]:
        return self.site_repository.get_device_names_by_site_id2(site_id)

    def get_device_metrics_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:

        device_info = self.site_repository.get_device_by_site_and_rack(site_id, rack_id)
        if not device_info:
            raise Exception("Device not found for given site and rack ID.")

        ip_address = device_info['ip_address']

        total_power, total_pin  = self.influxdb_repository.get_total_power_for_ip(ip_address)
        traffic_throughput = self.influxdb_repository.get_traffic_throughput_for_ip(ip_address)

        cost_of_power = self.calculate_cost_of_power(total_power)

        device_metrics = {
            "device_info": device_info,
            "total_power": total_power,
            "traffic_throughput": traffic_throughput,
            "cost_of_power": round(cost_of_power, 2),
            "input power": total_pin
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

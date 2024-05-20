import sys
from collections import defaultdict
from datetime import datetime, timedelta
from random import random
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

from app.schema.site_schema import DevicePowerComparisonPercentage

from app.schema.site_schema import ComparisonDeviceMetricsDetails

from app.schema.site_schema import SiteDetails_get


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

    def calculate_start_end_dates(self, duration_str: str) -> (datetime, datetime):
        today = datetime.today()
        if duration_str == "Last 6 Months":
            start_date = (today - timedelta(days=30 * 6)).replace(day=1)
            end_date = today
        elif duration_str == "Last 3 Months":
            start_date = (today - timedelta(days=90)).replace(day=1)
            end_date = today
        elif duration_str == "Last Year":
            start_date = (today.replace(day=1, month=1) - timedelta(days=365)).replace(day=1)
            end_date = start_date.replace(month=12, day=31)
        elif duration_str == "Current Year":
            start_date = today.replace(month=1, day=1)  # First day of the current year
            end_date = today  # Today's date
        elif duration_str == "Current Month":
            start_date = today.replace(day=1)
            end_date = today  # Adjusted to set the end date to today's date
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

    def compare_devices_hourly_power_metrics(self, site_id: int, device_name1: str,
                                             device_name2: str) -> HourlyDevicePowerMetricsResponse:
        devices_info = self.site_repository.get_device_ips_by_names_and_site_id(site_id, [device_name1, device_name2])
        hourly_data: Dict[str, List[dict]] = defaultdict(list)

        for device in devices_info:
            ip_metrics = self.influxdb_repository.get_hourly_power_metrics_for_ip([device['ip_address']])
            device_details = self.site_repository.get_device_details_by_name_and_site_id1(site_id,
                                                                                          device['device_name'])

            for metric in ip_metrics:
                print(
                    f"Preparing to append metric: device_name={metric.get('device_name')}, total_power={metric.get('total_power')}, max_power={metric.get('max_power')}, current_power={metric.get('current_power')}",
                    file=sys.stderr)
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
                        "total_power": metric.get('total_PIn', None),
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
            metrics = self.influxdb_repository.get_traffic_throughput_metrics_with_ener(device_ip, start_date, end_date,
                                                                                        duration_str)
            print("FINAL_MATRICSSSSSSSSSS", metrics, file=sys.stderr)
            data_metrics.extend(metrics)

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

    def get_device_names_by_site_id1(self, site_id: int) -> List[str]:
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
            PUE=metric_data.get('PUE', 1.0),  # Defaulting PUE to 1.0 if not present
            current_power=metric_data.get('current_power', 0),
            time=metric_data.get('time')  # Assuming time is correctly formatted
        )
        return formatted_metric

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

    def get_extended_sites(self) -> List[SiteDetails_get]:
        sites = self.site_repository.get_all_sites()
        for site in sites:
            device_inventory = self.site_repository.get_device_inventory_by_site_id(site.id)
            apic_ips = [device['ip_address'] for device in device_inventory if device['ip_address']]

            # Fetch power and traffic data from InfluxDB using the ips
            site.power_data = self.influxdb_repository.get_24hsite_power(apic_ips, site.id)
            site.traffic_data = self.influxdb_repository.get_24hsite_datatraffic(apic_ips, site.id)

            # Aggregate power and traffic data and set them to site object
            if site.power_data:
                power_utilization_values = [data['power_utilization'] for data in site.power_data if
                                            data['power_utilization'] is not None]
                Power_Input = [data['power_input'] for data in site.power_data if data['power_input'] is not None]
                pue_values = [data['pue'] for data in site.power_data if data['pue'] is not None]

                if power_utilization_values:
                    total_power_utilization = sum(power_utilization_values)
                    average_power_utilization = total_power_utilization / len(power_utilization_values)
                    site.power_utilization = round(average_power_utilization, 2)

                if pue_values:
                    average_pue = sum(pue_values) / len(pue_values)
                    site.pue = round(average_pue, 2)

                if Power_Input:
                    site.power_input = round(sum(Power_Input), 2)
                else:
                    site.power_input = 0  # Or set to None, depending on what you expect

            if site.traffic_data:
                traffic_throughput_values = [data['traffic_through'] for data in site.traffic_data if
                                             data['traffic_through'] is not None]
                if traffic_throughput_values:
                    total_traffic_throughput = sum(traffic_throughput_values)
                    datatraffic = total_traffic_throughput / (1024 ** 3)  # Convert from bytes to GB
                    site.datatraffic = round(datatraffic, 2)
                else:
                    site.datatraffic = 0  # Or set to None, depending on what you expect

        return [SiteDetails_get(**site.__dict__) for site in sites]


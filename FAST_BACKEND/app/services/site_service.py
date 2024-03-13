from typing import Dict, List

from fastapi import HTTPException, status
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository  # Adjust the import
from app.schema.site_schema import SiteCreate, SiteUpdate, GetSitesResponse, SiteDetails
import traceback
from app.repository.influxdb_repository import InfluxDBRepository  # Adjust the import
from app.schema.site_schema import SiteDetails1


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

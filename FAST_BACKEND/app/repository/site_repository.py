import sys
from contextlib import AbstractContextManager
from datetime import datetime
from typing import Callable, Dict, List, Optional, Any, Tuple

from sqlalchemy import func
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.model.site import Site
from app.repository.base_repository import BaseRepository
from sqlmodel import select, delete

from app.schema.site_schema import GetSitesResponse, SiteUpdate

from app.schema.site_schema import SiteCreate

from app.model.APIC_controllers import APICControllers

from app.model.device_inventory import DeviceInventory


class SiteRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Site)

    # def test_func(self) -> dict[str, list[Row]]:
    #     with self.session_factory() as session:
    #         res = session.execute("select * from site")
    #         results = res.fetchall()
    #         return {
    #             "results": results,
    #         }

    def get_all_sites(self) -> list[Site]:
        with self.session_factory() as session:
            return session.query(Site).all()

    def add_site(self, site_data: SiteCreate) -> Site:
        with self.session_factory() as session:
            new_site = Site(**site_data.dict())
            session.add(new_site)
            session.commit()
            session.refresh(new_site)
            return new_site

    def update_site(self, id: int, site_data: SiteUpdate) -> Site:
        with self.session_factory() as session:
            db_site = session.get(Site, id)
            if not db_site:
                raise HTTPException(status_code=404, detail="Site not found")

            for key, value in site_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(db_site, key, value)

            session.commit()

            session.refresh(db_site)
            return db_site

    def delete_site(self, site_id: int):
        with self.session_factory() as session:
            db_site = session.get(Site, site_id)
            if db_site is None:
                raise HTTPException(status_code=404, detail="Site not found")

            session.delete(db_site)
            session.commit()

    def delete_sites(self, site_ids: List[int]):
        with self.session_factory() as session:
            session.query(Site).filter(Site.id.in_(site_ids)).delete(synchronize_session='fetch')
            session.commit()

    # def get_devices_by_site_name(self, site_name: str) -> List[APICControllers]:
    #     with self.session_factory() as session:
    #         return session.query(APICControllers).join(Site).filter(Site.site_name == site_name).all()

    def get_devices_by_site_id(self, site_id: int) -> List[APICControllers]:
        with self.session_factory() as session:
            devices = (
                session.query(APICControllers)
                .filter(APICControllers.site_id == site_id)
                .all()
            )
            return devices

    # def get_devices_with_inventory_by_site_id(self, site_id: int) -> List[DeviceInventory]:
    #     with self.session_factory() as session:
    #         # Since the relationship is defined in DeviceInventory pointing to APICControllers,
    #         # we start the query from DeviceInventory and join APICControllers.
    #         devices_with_inventory = session.query(DeviceInventory).join(DeviceInventory.apic_controller).options(
    #             joinedload(DeviceInventory.apic_controller)
    #         ).filter(APICControllers.site_id == site_id).all()
    #
    #         return devices_with_inventory

    def get_apic_controller_ips_by_site_id(self, site_id: int) -> List[str]:
        with self.session_factory() as session:
            apic_ips = (
                session.query(APICControllers.ip_address)
                .join(DeviceInventory, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )
            print("APIC IPsSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS:", apic_ips, file=sys.stderr)

            ip_addresses = [ip[0] for ip in apic_ips]
            return ip_addresses

    def get_device_inventory_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            device_inventory_data = (
                session.query(DeviceInventory, APICControllers, Site.site_name)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            device_inventory_dicts = []
            for device, apic, site_name in device_inventory_data:
                device_info = device.__dict__
                device_info['ip_address'] = apic.ip_address
                device_info['site_name'] = site_name
                device_inventory_dicts.append(device_info)

            return device_inventory_dicts

    def get_device_inventory_with_apic_ips_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            device_inventory_data = (
                session.query(DeviceInventory, APICControllers, Site.site_name)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            device_inventory_dicts = []
            for device, apic, site_name in device_inventory_data:
                device_info = device.__dict__
                device_info['apic_ip'] = apic.ip_address
                device_info['site_name'] = site_name
                device_inventory_dicts.append(device_info)

            return device_inventory_dicts

    def get_device_ips_by_names_and_site_id(self, site_id: int, device_names: List[str]) -> list[dict[str, Any]]:
        with self.session_factory() as session:
            device_ips_and_details = (
                session.query(
                    DeviceInventory.device_name,
                    APICControllers.ip_address,
                    Site.site_name
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_name.in_(device_names))
                .all()
            )

            devices_info = [
                {"device_name": device_name, "ip_address": ip_address, "site_name": site_name}
                for device_name, ip_address, site_name in device_ips_and_details
            ]

            return devices_info

    def get_eol_eos_counts(self, site_id: int) -> dict:
        with self.session_factory() as session:
            current_date = datetime.now()
            hw_eol_count = session.query(DeviceInventory).filter(
                DeviceInventory.site_id == site_id,
                DeviceInventory.hw_eol_date != None,
                DeviceInventory.hw_eol_date < current_date
            ).count()
            hw_eos_count = session.query(DeviceInventory).filter(
                DeviceInventory.site_id == site_id,
                DeviceInventory.hw_eos_date != None,
                DeviceInventory.hw_eos_date < current_date
            ).count()
            sw_eol_count = session.query(DeviceInventory).filter(
                DeviceInventory.site_id == site_id,
                DeviceInventory.sw_eol_date != None,
                DeviceInventory.sw_eol_date < current_date
            ).count()
            sw_eos_count = session.query(DeviceInventory).filter(
                DeviceInventory.site_id == site_id,
                DeviceInventory.sw_eos_date != None,
                DeviceInventory.sw_eos_date < current_date
            ).count()

            return {
                "hardware_eol_count": hw_eol_count,
                "hardware_eos_count": hw_eos_count,
                "software_eol_count": sw_eol_count,
                "software_eos_count": sw_eos_count
            }

    def get_device_ip_by_name(self, site_id: int, device_name: str) -> str:
        with self.session_factory() as session:
            device = (
                session.query(APICControllers.ip_address)
                .join(DeviceInventory, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_name == device_name)
                .first()
            )
            return device.ip_address if device else None

    def get_device_ip_by_device_name_and_site_id(self, site_id: int, device_name: str) -> dict[str, Any]:
        with self.session_factory() as session:
            device_ip_and_site_name = (
                session.query(APICControllers.ip_address, Site.site_name)
                .join(DeviceInventory, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_name == device_name)
                .first()
            )

            if device_ip_and_site_name:
                device_info = {
                    "ip_address": device_ip_and_site_name[0],
                    "site_name": device_ip_and_site_name[1]
                }
                return device_info
            else:
                return {}

    def get_device_names_by_site_id2(self, site_id: int) -> List[str]:
        with self.session_factory() as session:
            device_names = (
                session.query(DeviceInventory.device_name)
                .filter(DeviceInventory.site_id == site_id)
                .distinct()
                .all()
            )
            return [name[0] for name in device_names if name[0] is not None]

    def get_device_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:
        with self.session_factory() as session:
            device = (
                session.query(DeviceInventory)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id, APICControllers.rack_id == rack_id)
                .first()
            )
            if device:
                return {
                    "ip_address": device.apic_controller.ip_address,
                    "device_name": device.device_name,
                    "hardware_version": device.hardware_version,
                    "manufacturer": device.manufacturer,
                    "pn_code": device.pn_code,
                    "serial_number": device.serial_number,
                    "software_version": device.software_version,
                    "status": device.status

                    # Add other fields as necessary
                }

    def get_device_details_by_name_and_site_id(self, site_id: int, device_name: str) -> dict:
        with self.session_factory() as session:
            # Assuming `DeviceInventory` has a relationship with `APICControllers` and possibly other models for additional details
            # Adjust the fields according to your actual database schema
            query_result = (
                session.query(
                    DeviceInventory.device_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status,
                    APICControllers.ip_address,
                    Site.site_name
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_name == device_name)
                .first()
            )

            if query_result:
                # Mapping the result to a dictionary
                device_details = {
                    "device_name": query_result.device_name,
                    "hardware_version": query_result.hardware_version,
                    "manufacturer": query_result.manufacturer,
                    "pn_code": query_result.pn_code,
                    "serial_number": query_result.serial_number,
                    "software_version": query_result.software_version,
                    "status": query_result.status,
                    "ip_address": query_result.ip_address,
                    "site_name": query_result.site_name,
                }
                return device_details
            else:
                # Return an empty dictionary or handle the case where no results are found
                return {}

    def get_device_ip_by_id(self, site_id: int, device_id: int) -> Optional[tuple[Any, Any]]:
        with self.session_factory() as session:
            # Adjust the query to also select the device_name from the DeviceInventory table
            result = (
                session.query(APICControllers.ip_address, DeviceInventory.device_name)
                .join(DeviceInventory, APICControllers.id == DeviceInventory.apic_controller_id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.id == device_id)
                .first()
            )
            if result:
                # Return both ip_address and device_name if the query was successful
                return result.ip_address, result.device_name
            else:
                return None

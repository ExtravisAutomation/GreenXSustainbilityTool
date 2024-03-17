import sys
from contextlib import AbstractContextManager
from typing import Callable, Dict, List, Optional

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
            # Query DeviceInventory to get APICControllers by site_id
            apic_ips = (
                session.query(APICControllers.ip_address)
                .join(DeviceInventory, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )
            print("APIC IPsSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS:", apic_ips, file=sys.stderr)
            # Extract IP addresses from query results
            ip_addresses = [ip[0] for ip in apic_ips]
            return ip_addresses

    def get_device_inventory_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            # Query DeviceInventory and APICControllers tables to fetch required data
            device_inventory_data = (
                session.query(DeviceInventory, APICControllers)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            # Convert query result to dictionary format
            device_inventory_dicts = []
            for device, apic in device_inventory_data:
                device_info = device.__dict__
                device_info['ip_address'] = apic.ip_address  # Add APIC IP address to the device info
                device_inventory_dicts.append(device_info)

            return device_inventory_dicts

    def get_device_inventory_with_apic_ips_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            # Query DeviceInventory and APICControllers tables to fetch required data
            device_inventory_data = (
                session.query(DeviceInventory, APICControllers)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            # Convert query result to dictionary format
            device_inventory_dicts = []
            for device, apic in device_inventory_data:
                device_info = device.__dict__
                device_info['apic_ip'] = apic.ip_address  # Add APIC IP address to the device info
                device_inventory_dicts.append(device_info)

            return device_inventory_dicts

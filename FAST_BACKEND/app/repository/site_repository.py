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

from app.model.rack import Rack

from app.model.apic_controller import APICController
from app.model.DevicesSntc import DevicesSntc

from app.model.site import PasswordGroup
from app.schema.site_schema import PasswordGroupCreate

from app.schema.site_schema import APICControllersCreate, APICControllersUpdate


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

    def get_apic_controller_ips_and_device_names_by_site_id(self, site_id: int) -> List[Dict[str, str]]:
        with self.session_factory() as session:
            result = (
                session.query(
                    APICControllers.ip_address,
                    DeviceInventory.device_name
                )
                .join(DeviceInventory, DeviceInventory.apic_controller_id == APICControllers.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            devices_info = [{"ip_address": device.ip_address, "device_name": device.device_name} for device in result]
            return devices_info

    # def get_device_inventory_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
    #     with self.session_factory() as session:
    #         device_inventory_data = (
    #             session.query(
    #                 DeviceInventory.id,
    #                 DeviceInventory.device_name,
    #                 APICControllers.ip_address.label('ip_address'),
    #                 Site.site_name,
    #                 DeviceInventory.hardware_version,
    #                 DeviceInventory.manufacturer,
    #                 DeviceInventory.pn_code,
    #                 DeviceInventory.serial_number,
    #                 DeviceInventory.software_version,
    #                 DeviceInventory.status
    #             )
    #             .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
    #             .join(Site, DeviceInventory.site_id == Site.id)
    #             .filter(DeviceInventory.site_id == site_id)
    #             .all()
    #         )
    #
    #         device_inventory_dicts = []
    #         for data in device_inventory_data:
    #             device_info = {
    #                 "id": data.id,
    #                 "device_name": data.device_name,
    #                 "ip_address": data.ip_address,  # Ensure ip_address is directly extracted
    #                 "site_name": data.site_name,
    #                 "hardware_version": data.hardware_version,
    #                 "manufacturer": data.manufacturer,
    #                 "pn_code": data.pn_code,
    #                 "serial_number": data.serial_number,
    #                 "software_version": data.software_version,
    #                 "status": data.status,
    #             }
    #             device_inventory_dicts.append(device_info)
    #
    #         return device_inventory_dicts

    def get_device_inventory_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            device_inventory_data = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    APICControllers.ip_address.label('ip_address'),  # Use APICController class for IP address
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers,
                      DeviceInventory.apic_controller_id == APICControllers.id)  # Correct join to APICController
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            device_inventory_dicts = []
            for data in device_inventory_data:
                device_info = {
                    "id": data.id,
                    "device_name": data.device_name,
                    "ip_address": data.ip_address,  # Ensure ip_address is directly extracted
                    "site_name": data.site_name,
                    "hardware_version": data.hardware_version,
                    "manufacturer": data.manufacturer,
                    "pn_code": data.pn_code,
                    "serial_number": data.serial_number,
                    "software_version": data.software_version,
                    "status": data.status,
                }
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

    def get_first_two_device_names(self, site_id: int) -> List[str]:
        with self.session_factory() as session:
            device_names = (
                session.query(DeviceInventory.device_name)
                .filter(DeviceInventory.site_id == site_id)
                .order_by(DeviceInventory.id)  # Assuming ordering by ID or another column
                .limit(2)
                .all()
            )
        return [name for (name,) in device_names]

    def get_first_device_name(self, site_id: int) -> Optional[str]:
        with self.session_factory() as session:
            device_name = (
                session.query(DeviceInventory.device_name)
                .filter(DeviceInventory.site_id == site_id)
                .order_by(DeviceInventory.id)  # Assuming ordering by ID or another column
                .limit(1)
                .first()
            )
            return device_name[0] if device_name else None

    def get_eol_eos_counts(self, site_id: int) -> dict:
        with self.session_factory() as session:
            num_devices = session.query(func.count(APICControllers.id)).filter(
                APICControllers.site_id == site_id).scalar()
            current_date = datetime.now()

            join_query = session.query(DeviceInventory). \
                join(DevicesSntc, DeviceInventory.pn_code == DevicesSntc.model_name). \
                filter(DeviceInventory.site_id == site_id)

            hw_eol_count = join_query.filter(
                DevicesSntc.hw_eol_ad != None,
                DevicesSntc.hw_eol_ad < current_date
            ).count()

            hw_eos_count = join_query.filter(
                DevicesSntc.hw_eos != None,
                DevicesSntc.hw_eos < current_date
            ).count()

            sw_eol_count = join_query.filter(
                DevicesSntc.sw_EoSWM != None,
                DevicesSntc.sw_EoSWM < current_date
            ).count()

            sw_eos_count = join_query.filter(
                DevicesSntc.hw_EoSCR != None,
                DevicesSntc.hw_EoSCR < current_date,
                DevicesSntc.sw_EoVSS != None,
                DevicesSntc.sw_EoVSS < current_date
            ).count()

            hw_eosup_count = join_query.filter(
                DevicesSntc.hw_ldos != None,
                DevicesSntc.hw_ldos < current_date
            ).count()

            return {
                "num_devices": num_devices,
                "hardware_eol_count": hw_eol_count,
                "hardware_eos_count": hw_eos_count,
                "hardware_eosup_count": hw_eosup_count,
                "software_eol_count": sw_eol_count,
                "software_eos_count": sw_eos_count
            }

    def get_eol_eos_counts1(self, site_id: int, start_date: datetime, end_date: datetime) -> dict:
        with self.session_factory() as session:
            join_query = session.query(DeviceInventory). \
                join(DevicesSntc, DeviceInventory.pn_code == DevicesSntc.model_name). \
                filter(DeviceInventory.site_id == site_id)

            hw_eol_count = join_query.filter(
                DevicesSntc.hw_eol_ad is not None,
                DevicesSntc.hw_eol_ad.between(start_date, end_date)
            ).count()

            hw_eos_count = join_query.filter(
                DevicesSntc.hw_eos is not None,
                DevicesSntc.hw_eos.between(start_date, end_date)
            ).count()

            sw_eol_count = join_query.filter(
                DevicesSntc.sw_EoSWM is not None,
                DevicesSntc.sw_EoSWM.between(start_date, end_date)
            ).count()

            sw_eos_count = join_query.filter(
                DevicesSntc.hw_EoSCR is not None,
                DevicesSntc.hw_EoSCR.between(start_date, end_date),
                DevicesSntc.sw_EoVSS != None,
                DevicesSntc.sw_EoVSS.between(start_date, end_date)
            ).count()

            hw_eosup_count = join_query.filter(
                DevicesSntc.hw_ldos is not None,
                DevicesSntc.hw_ldos.between(start_date, end_date)
            ).count()

            return {
                "hardware_eol_count": hw_eol_count,
                "hardware_eos_count": hw_eos_count,
                "hardware_eosup_count": hw_eosup_count,
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

    # def get_device_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:
    #     with self.session_factory() as session:
    #         device = (
    #             session.query(DeviceInventory)
    #             .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
    #             .filter(DeviceInventory.site_id == site_id, APICControllers.rack_id == rack_id)
    #             .first()
    #         )
    #         if device:
    #             return {
    #                 "ip_address": device.apic_controller.ip_address,
    #                 "device_name": device.device_name,
    #                 "hardware_version": device.hardware_version,
    #                 "manufacturer": device.manufacturer,
    #                 "pn_code": device.pn_code,
    #                 "serial_number": device.serial_number,
    #                 "software_version": device.software_version,
    #                 "status": device.status
    #
    #                 # Add other fields as necessary
    #             }

    def get_device_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:
        with self.session_factory() as session:
            # Adjusting the query to join with Site and Rack for additional details
            device = (
                session.query(DeviceInventory, APICControllers, Site, Rack)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, APICControllers.site_id == Site.id)
                .join(Rack, APICControllers.rack_id == Rack.id)
                .filter(APICControllers.site_id == site_id, APICControllers.rack_id == rack_id)
                .first()
            )
            if device:
                # Unpack the result into individual models
                device_inventory, apic_controller, site, rack = device
                return {
                    "region": site.region,
                    "site_name": site.site_name,
                    "rack_name": rack.rack_name,
                    "device_type": apic_controller.device_type,
                    "ip_address": apic_controller.ip_address,
                    "device_name": device_inventory.device_name,
                    "hardware_version": device_inventory.hardware_version,
                    "manufacturer": device_inventory.manufacturer,
                    "pn_code": device_inventory.pn_code,
                    "serial_number": device_inventory.serial_number,
                    "software_version": device_inventory.software_version,
                    "status": device_inventory.status

                    # Add other fields as necessary
                }

    def get_device_details_by_name_and_site_id(self, site_id: int, device_name: str) -> dict:
        with self.session_factory() as session:

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

                return {}

    def get_device_details_by_name_and_site_id1(self, site_id: int, device_name: str) -> dict:
        with self.session_factory() as session:

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

    def get_rack_and_device_counts(self, site_id: int) -> dict:
        with self.session_factory() as session:
            num_racks = session.query(func.count(Rack.id)).filter(Rack.site_id == site_id).scalar()
            num_devices = session.query(func.count(APICControllers.id)).filter(
                APICControllers.site_id == site_id).scalar()
            return {
                "num_racks": num_racks or 0,
                "num_devices": num_devices or 0
            }

    def get_site_location(self, site_id: int) -> Tuple[float, float]:
        with self.session_factory() as session:
            site = session.query(Site).filter(Site.id == site_id).one_or_none()
            num_devices = session.query(func.count(APICControllers.id)).filter(
                APICControllers.site_id == site_id).scalar()
            if site:
                print("SITE LATITUDE AND LONGITUDE:", site.latitude, site.longitude, file=sys.stderr)
                return site.latitude, site.longitude, site.site_name, num_devices, site.region
            else:
                return None, None

    def create_password_group(self, password_group: PasswordGroupCreate) -> PasswordGroup:
        with self.session_factory() as session:
            db_password_group = PasswordGroup(**password_group.dict())
            session.add(db_password_group)
            session.commit()
            session.refresh(db_password_group)
            return db_password_group

    def get_password_group(self, password_group_id: int) -> PasswordGroup:
        return self.db.query(PasswordGroup).filter(PasswordGroup.id == password_group_id).first()

    def get_all_password_groups(self) -> List[PasswordGroup]:
        with self.session_factory() as session:
            return session.query(PasswordGroup).all()

    def delete_password_group(self, password_group_id: int):
        password_group = self.db.query(PasswordGroup).filter(PasswordGroup.id == password_group_id).first()
        if password_group:
            self.db.delete(password_group)
            self.db.commit()
        return password_group

    def delete_password_groups12(self, password_group_ids: List[int]):
        with self.session_factory() as session:
            password_groups = session.query(PasswordGroup).filter(PasswordGroup.id.in_(password_group_ids)).all()
            if password_groups:
                session.query(PasswordGroup).filter(PasswordGroup.id.in_(password_group_ids)).delete(
                    synchronize_session='fetch')
                session.commit()
            return password_groups

    def create_device2(self, device_data: APICControllersCreate) -> APICControllers:
        with self.session_factory() as session:
            db_device = APICControllers(**device_data.dict())
            session.add(db_device)
            session.commit()
            session.refresh(db_device)

            # Fetch the related PasswordGroup to include in the response
            if db_device.password_group_id:
                db_device = session.query(APICControllers).options(joinedload(APICControllers.password_group)).filter(
                    APICControllers.id == db_device.id).first()

            return db_device

    def get_all_devices2(self) -> List[APICControllers]:
        with self.session_factory() as session:
            devices = session.query(
                APICControllers,
                PasswordGroup.password_group_name
            ).outerjoin(PasswordGroup, APICControllers.password_group_id == PasswordGroup.id).all()

            result = []
            for device, password_group_name in devices:
                device_data = device.__dict__
                device_data["password_group_name"] = password_group_name
                result.append(device_data)

            return result

    def update_device2(self, device_id: int, device_data: APICControllersUpdate) -> APICControllers:
        with self.session_factory() as session:
            db_device = session.query(APICControllers).filter(APICControllers.id == device_id).first()
            for key, value in device_data.dict().items():
                setattr(db_device, key, value)
            session.commit()
            session.refresh(db_device)
            return db_device

    def delete_devices2(self, device_ids: List[int]) -> None:
        with self.session_factory() as session:
            session.query(APICControllers).filter(APICControllers.id.in_(device_ids)).delete(synchronize_session=False)
            session.commit()

import sys
from contextlib import AbstractContextManager
from datetime import datetime
from typing import Callable, Dict, List, Optional, Any, Tuple

from sqlalchemy import func
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session, joinedload, aliased
from fastapi import HTTPException, status
from app.model.site import Site
from app.repository.base_repository import BaseRepository
from sqlmodel import select, delete

from app.schema.site_schema import GetSitesResponse, SiteUpdate

from app.schema.site_schema import SiteCreate

from app.model.APIC_controllers import APICControllers,Vendor,DeviceType

from app.model.device_inventory import DeviceInventory

from app.model.rack import Rack

from app.model.apic_controller import APICController
from app.model.DevicesSntc import DevicesSntc

from app.model.site import PasswordGroup
from app.schema.site_schema import PasswordGroupCreate

from app.schema.site_schema import APICControllersCreate, APICControllersUpdate

from app.schema.site_schema import PasswordGroupUpdate

from app.schema.site_schema import DeviceCreateRequest

from app.model.APIC_controllers import APICControllers as Devices

from app.model.cspc_devices import CSPCDevices
from app.schema.site_schema import CSPCDevicesWithSntcResponse
from app.repository.ai_repository import AIRepository
import openai
from app.core.config import configs
class SiteRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Site)
        openai.api_key = configs.OPENAI_API_KEY

    
    

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
            
            
            
            successful_deletes = []
            failed_deletes = []
            for site_id in site_ids:
                try:
                    site = session.query(Site).filter(Site.id == site_id).first()
                    if site:
                        site_name = site.site_name  
                        
                        session.query(Site).filter(Site.id == site_id).delete(synchronize_session='fetch')
                        session.commit()
                        successful_deletes.append({'id': site_id, 'name': site_name})  
                    else:
                        failed_deletes.append({'id': site_id, 'name': None})  
                except Exception as e:
                    session.rollback()
                    if site:  
                        failed_deletes.append({'id': site_id, 'name': site.site_name})
                    else:
                        failed_deletes.append({'id': site_id, 'name': None})  

            return successful_deletes, failed_deletes



    # def get_all_devices_data(self, page: int = 1, page_size: int = 10) -> Dict[str, any]:
    #     """
    #     Fetches all devices data with pagination.
    #
    #     :param page: The page number (default is 1)
    #     :param page_size: Number of records per page (default is 10)
    #     :return: A dictionary containing devices data and pagination metadata
    #     """
    #     try:
    #         with self.session_factory() as session:
    #             subquery = session.query(DeviceInventory.device_id).filter(
    #                 DeviceInventory.role.in_(["leaf", "spine"])
    #             ).subquery()
    #
    #             query = session.query(
    #                 Devices,
    #                 PasswordGroup.password_group_name
    #             ).outerjoin(PasswordGroup, Devices.password_group_id == PasswordGroup.id) \
    #                 .outerjoin(DeviceInventory, Devices.id == DeviceInventory.device_id) \
    #                 .filter(~Devices.id.in_(subquery)) \
    #                 .options(joinedload(Devices.site), joinedload(Devices.rack)) \
    #                 .order_by(Devices.created_at.desc())
    #
    #             # Get total count before applying pagination
    #             total_records = query.count()
    #
    #             # Apply pagination
    #             devices = query.limit(page_size).offset((page - 1) * page_size).all()
    #
    #             result = []
    #             for device, password_group_name in devices:
    #                 device_data = device.__dict__
    #                 device_data["password_group_name"] = password_group_name
    #                 device_data["site_name"] = device.site.site_name if device.site else None
    #                 device_data["rack_name"] = device.rack.rack_name if device.rack else None
    #                 device_data["rack_unit"] = device.rack_unit
    #                 device_data["OnBoardingStatus"] = device.OnBoardingStatus
    #                 device_data["messages"] = device.messages if device.messages else None
    #                 device_data["site_id"] = device.site_id
    #                 device_data["device_ip"] = device.ip_address
    #                 device_data["collection_status"] = device.collection_status
    #                 result.append(device_data)
    #
    #             return {
    #                 "devices": result,
    #                 "pagination": {
    #                     "page": page,
    #                     "page_size": page_size,
    #                     "total_records": total_records,
    #                     "total_pages": (total_records + page_size - 1) // page_size  # Ceil division
    #                 }
    #             }
    #     except SQLAlchemyError as e:
    #         print(f"Database error: {str(e)}")
    #         return {"error": "Database error occurred."}

    def get_all_devices_data(self) -> List[Devices]:
        with self.session_factory() as session:
            subquery = session.query(DeviceInventory.device_id).filter(
                DeviceInventory.role.in_(["leaf", "spine"])
            ).subquery()

            devices = session.query(
                Devices,
                PasswordGroup.password_group_name,
            DeviceType.device_type,  # Fetch device type
            Vendor.vendor_name  # Fetch vendor name
            ).outerjoin(PasswordGroup, Devices.password_group_id == PasswordGroup.id) \
                .outerjoin(DeviceType, Devices.device_type_id == DeviceType.id) \
                .outerjoin(Vendor, Devices.vendor_id == Vendor.id) \
                .outerjoin(DeviceInventory, Devices.id == DeviceInventory.device_id) \
                .filter(~Devices.id.in_(subquery)) \
                .options(joinedload(Devices.site), joinedload(Devices.rack)) \
                .order_by(Devices.created_at.desc()) \
                .all()

            result = []
            for device, password_group_name,device_type, vendor_name  in devices:
                device_data = device.__dict__
                device_data["password_group_name"] = password_group_name
                device_data["site_name"] = device.site.site_name if device.site else None
                device_data["rack_name"] = device.rack.rack_name if device.rack else None
                device_data["rack_unit"] = device.rack_unit
                device_data["OnBoardingStatus"] = device.OnBoardingStatus
                device_data["messages"] = device.messages if device.messages else None
                device_data["site_id"] = device.site_id
                device_data["device_ip"] = device.ip_address
                device_data["collection_status"] = device.collection_status
                device_data["device_type"] = device_type  # Added Device Type
                device_data["vendor_name"] = vendor_name  # Added Vendor Name
                result.append(device_data)
            print("result", result)
            print("************************************")

            return result


    def get_devices_by_site_id(self, site_id: int) -> List[APICControllers]:
        with self.session_factory() as session:
            devices = (
                session.query(APICControllers)
                .filter(APICControllers.site_id == site_id)
                .filter(APICControllers.OnBoardingStatus==True)
                .filter(APICControllers.collection_status==True)
                .all()
            )
            return devices
        
    def get_apic_controller_names(self, sorted_power_required: list):
        with self.session_factory() as session:
            for data in sorted_power_required:
                result=session.query(Devices.device_name).filter(Devices.ip_address== data['apic_controller_ip']).first()
                
                
                data['apic_controller_name'] = result[0] if result else None
                
            return sorted_power_required
               

    
    
    
    
    
    
    
    
    

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

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    def get_device_inventory_by_site_id(self, site_id: int) -> List[Dict[str, any]]:
        with self.session_factory() as session:
            device_inventory_data = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    APICControllers.ip_address.label('ip_address'),  
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers,
                      DeviceInventory.apic_controller_id == APICControllers.id)  
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id)
                .all()
            )

            device_inventory_dicts = []
            for data in device_inventory_data:
                device_info = {
                    "id": data.id,
                    "device_name": data.device_name,
                    "ip_address": data.ip_address,  
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
                .order_by(DeviceInventory.id)  
                .limit(2)
                .all()
            )
        return [name for (name,) in device_names]

    def get_first_device_name(self, site_id: int) -> Optional[str]:
        with self.session_factory() as session:
            device_name = (
                session.query(DeviceInventory.device_name)
                .filter(DeviceInventory.site_id == site_id)
                .order_by(DeviceInventory.id)  
                .limit(1)
                .first()
            )
            return device_name[0] if device_name else None

    def get_eol_eos_counts(self, site_id: int) -> dict:
        with self.session_factory() as session:
            num_devices = session.query(func.count(APICControllers.id)).filter(
                (APICControllers.site_id == site_id) &
                (APICControllers.OnBoardingStatus == True)
            ).scalar()

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

    
    
    
    
    
    
    
    
    

    def get_device_names_by_site_id2(self, site_id: int) -> List[dict[str, str]]:
        with self.session_factory() as session:
            device_names = (
                session.query(APICControllers.id, APICControllers.device_name)
                .filter((APICControllers.site_id == site_id) &(APICControllers.OnBoardingStatus==True) & (APICControllers.collection_status==True))
                .distinct()
                .all()
            )
            return [{"id": name[0], "device_name": name[1]} for name in device_names if name[1] is not None]

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    def get_device_by_site_and_rack(self, site_id: int, rack_id: int) -> Dict[str, Any]:
        with self.session_factory() as session:
            
            device = (
                session.query(DeviceInventory, APICControllers, Site, Rack)
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, APICControllers.site_id == Site.id)
                .join(Rack, APICControllers.rack_id == Rack.id)
                .filter(APICControllers.site_id == site_id, APICControllers.rack_id == rack_id)
                .first()
            )
            if device:
                
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

    def get_all_device_names(self, site_id: int) -> List[str]:
        with self.session_factory() as session:
            device_names = (
                session.query(DeviceInventory.device_name)
                .filter(DeviceInventory.site_id == site_id)
                .order_by(DeviceInventory.id)  
                .all()
            )
        return [name for (name,) in device_names]

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
            
            result = (
                session.query(APICControllers.ip_address, DeviceInventory.device_name)
                .join(DeviceInventory, APICControllers.id == DeviceInventory.apic_controller_id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.id == device_id)
                .first()
            )
            if result:
                
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
            dependent_records = session.query(APICControllers).filter(APICControllers.password_group_id.in_(password_group_ids)).count()

            if dependent_records > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot delete password groups. {dependent_records} dependent records exist"
                )
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

            
            if db_device.password_group_id or db_device.site_id or db_device.rack_id:
                db_device = session.query(APICControllers).options(
                    joinedload(APICControllers.password_group),
                    joinedload(APICControllers.site),
                    joinedload(APICControllers.rack)
                ).filter(APICControllers.id == db_device.id).first()

            return db_device

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    



    def get_all_device_types1(self) -> List[str]:
        with self.session_factory() as session:
            device_types = session.query(APICControllers.device_type).distinct().all()
            
            return [device_type[0] for device_type in device_types if device_type[0] is not None]

    def update_password_group1(self, group_id: int, password_group: PasswordGroupUpdate) -> PasswordGroup:
        with self.session_factory() as session:
            db_password_group = session.query(PasswordGroup).filter(PasswordGroup.id == group_id).first()
            if not db_password_group:
                raise HTTPException(status_code=404, detail="Password group not found")

            for key, value in password_group.dict().items():
                if value is not None and value != '' and value != 'string':
                    setattr(db_password_group, key, value)

            session.commit()
            session.refresh(db_password_group)
            return db_password_group

    
    
    
    
    
    
    
    
    

    def update_device2(self, device_id: int, device_data: APICControllersUpdate) -> APICControllers:
        with self.session_factory() as session:
            db_device = session.query(APICControllers).filter(APICControllers.id == device_id).first()
            for key, value in device_data.dict().items():
                if value is not None and value != '' and value != 'string' and value != 0:
                    setattr(db_device, key, value)
            session.commit()
            session.refresh(db_device)

            
            if db_device.password_group_id or db_device.site_id or db_device.rack_id:
                db_device = session.query(APICControllers).options(
                    joinedload(APICControllers.password_group),
                    joinedload(APICControllers.site),
                    joinedload(APICControllers.rack)
                ).filter(APICControllers.id == db_device.id).first()

            return db_device

    def delete_devices2(self, device_ids: List[int]) -> None:
        with self.session_factory() as session:
            session.query(APICControllers).filter(APICControllers.id.in_(device_ids)).delete(synchronize_session=False)
            session.commit()

    def get_device_by_site_id_and_device_id(self, site_id: int, device_id: int) -> Optional[dict]:
        print(f"Querying device: site_id={site_id}, device_id={device_id}")
        with self.session_factory() as session:
            device = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    APICControllers.ip_address,
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.apic_controller_id == device_id)
                .first()
            )
            if device:
                print(f"Device found: {device}")
                return {
                    "device_id": device.id,
                    "device_name": device.device_name,
                    "ip_address": device.ip_address,
                    "site_name": device.site_name,
                    "hardware_version": device.hardware_version,
                    "manufacturer": device.manufacturer,
                    "pn_code": device.pn_code,
                    "serial_number": device.serial_number,
                    "software_version": device.software_version,
                    "status": device.status
                }
            else:
                print("Device not found.")
                return None

    def get_racks_by_site_id1(self, site_id: int) -> List[Rack]:
        with self.session_factory() as session:
            return session.query(Rack).filter(Rack.site_id == site_id).all()

    def create_device_onbrd(self, device_data: DeviceCreateRequest) -> APICControllers:
        with self.session_factory() as session:
            with self.session_factory() as session:
                db_device = APICControllers(
                    ip_address=device_data.ip_address,
                    device_name=device_data.device_name,
                    site_id=device_data.site_id,
                    rack_id=device_data.rack_id,
                    vendor_id=device_data.vendor_id,
                    password_group_id=device_data.password_group_id,
                    device_type_id=device_data.device_type_id,  # Fixed field name
                    OnBoardingStatus=False

                )
                session.add(db_device)
                session.commit()
                session.refresh(db_device)

                # Load related data after creation
                db_device = session.query(APICControllers).options(
                    joinedload(APICControllers.password_group),
                    joinedload(APICControllers.site),
                    joinedload(APICControllers.rack),
                    joinedload(APICControllers.vendor),  # Ensure vendor is loaded
                    joinedload(APICControllers.device_type_rel)
                ).filter(APICControllers.id == db_device.id).first()

                return db_device
        
        
    def co2_emission(self, apic_ips: List[str], site_id: int) -> List[Dict[str, any]]:
        apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]

        if not apic_ip_list:
            return []

        co2emission_data = []

        for apic_ip in apic_ip_list:
            
            annual_electricity_usage_mwh = 10000

            
            emission_factor_kg_per_mwh = 100

            
            annual_co2_emissions_kg = annual_electricity_usage_mwh * emission_factor_kg_per_mwh


            days_in_year = 365
            
            daily_co2_emissions_kg = annual_co2_emissions_kg / days_in_year

            co2emission_data.append({
                "site_id": site_id,
                "apic_controller_ip": apic_ip,
                "co2emission": round(daily_co2_emissions_kg, 2) if daily_co2_emissions_kg is not None else None
            })

        return co2emission_data
        
        
    def site_power_co2emmission(self, site_id: int):
        with self.session_factory() as session:
            devices = self.site_repositor.get_devices_by_site_id(site_id)
            device_ips = [device.ip_address for device in devices if device.ip_address]
            ip_to_name = {device.ip_address: device.device_name for device in devices if device.ip_address}

            if not device_ips:
                return []
            power_efficiency = self.influxdb_repository.get_energy_efficiency(device_ips, site_id)
            sorted_efficiency = sorted(power_efficiency, key=lambda x: x['PowerInput'], reverse=True)[:4]
            for entry in sorted_efficiency:
                entry['site_id']=site_id
                entry['device_name'] = ip_to_name.get(entry['apic_controller_ip'], "Unknown")
                entry['co2_emission']=round((entry['PowerInput']*0.4041),2)

            return sorted_efficiency

            # apic_ips = session.query(Devices.ip_address).filter(Devices.site_id == site_id).distinct().limit(4).all()
            # print(apic_ips)
            # co2_emmsion = self.co2_emission(apic_ips, site_id)
            # response = []
            # for data in co2_emmsion:
            #     result=session.query(Devices.device_name).filter(Devices.ip_address == data['apic_controller_ip']).first()
            #     response.append({
            #         'site_id': site_id,
            #         'ip_address': data['apic_controller_ip'],
            #         'device_name': result[0],
            #         'co2_emission': data['co2emission'],
            #     })
            #
            # return response
        
        
    def get_site_names(self):
        with self.session_factory() as session:
            sites = session.query(Site).all()
            return sites

    def get_device_inventory(self, site_id):
        with self.session_factory() as session:
            # Fetch all devices for the given site ID
            onboarded_devices = session.query(APICControllers).filter(
                (APICControllers.site_id == site_id) &
                (APICControllers.OnBoardingStatus == True)
            ).all()
            devices = session.query(APICControllers).filter(
                (APICControllers.site_id == site_id)
            ).all()

            # Count distinct vendors for the given site ID
            total_vendors = (
                session.query(func.count(APICControllers.vendor_id.distinct()))
                .filter(
                    (APICControllers.site_id == site_id) &
                    (APICControllers.OnBoardingStatus == True)
                )
                .scalar()
            )


            # Fetch all racks for the given site ID
            racks = session.query(Rack).filter(Rack.site_id == site_id).all()

            # Calculate onboarded devices
            # onboarded_devices = sum(1 for device in devices if device.OnBoardingStatus)
            return {
                "onboarded_devices": len(onboarded_devices),
                "total_devices": len(devices),
                "total_vendors": total_vendors,
                "total_racks": len(racks)
            }
    def check_site(self, site_id):
        with self.session_factory() as session:
            devices = session.query(APICControllers).filter(APICControllers.site_id == site_id).all()
            return True


    def get_devices_data(self,device_data):
        print("devociedata at ai end",device_data.device_id)

        with self.session_factory() as session:
            # print(device_data.device_id)
            try:
                existing_device = session.query(APICControllers).filter(
                    APICControllers.id == device_data.device_id).filter(APICControllers.site_id == device_data.site_id).first()
                print("Found existing",existing_device)
                return existing_device
                if not existing_device:
                    existing_device.messages = f"Device with this id  doesnot exists."
            except Exception as e:
                raise ValueError(f"Error checking device existence: {str(e)}")

    def create_device_from_excel(self, device_data: dict):
        with self.session_factory() as session:
            try:
                
                existing_device = session.query(APICControllers).filter_by(ip_address=device_data["ip_address"]).first()
                if existing_device:
                    existing_device.messages = f"Device with IP {device_data['ip_address']} already exists."
                    session.commit()
                    return {"message": existing_device.messages, "status": "error"}
            except Exception as e:
                raise ValueError(f"Error checking device existence: {str(e)}")
            try:
                site = session.query(Site).filter_by(site_name=device_data["site_name"]).first()
                if not site:
                    raise ValueError(f"Site with name {device_data['site_name']} does not exist.")
            except Exception as e:
                raise ValueError(f"Error fetching site: {str(e)}")
            try:
                rack = session.query(Rack).filter_by(rack_name=device_data["rack_name"], site_id=site.id).first()
                if not rack:
                    raise ValueError(
                        f"Rack with name {device_data['rack_name']} in site {site.site_name} does not exist.")
            except Exception as e:
                raise ValueError(f"Error fetching rack: {str(e)}")

            try:
                password_group = session.query(PasswordGroup).filter_by(
                    password_group_name=device_data["password_group_name"]).first()
                if not password_group:
                    raise ValueError(f"Password Group with name {device_data['password_group_name']} does not exist.")
            except Exception as e:
                raise ValueError(f"Error fetching password group: {str(e)}")

            try:
                
                new_device = APICControllers(
                    ip_address=device_data["ip_address"],
                    device_name=device_data["device_name"],
                    site_id=site.id,
                    rack_id=rack.id,
                    password_group_id=password_group.id,
                    device_type=device_data["device_type"],
                    OnBoardingStatus=False,  
                    messages="Device uploaded successfully."  
                )
                session.add(new_device)
                session.commit()
                session.refresh(new_device)

                
                return {
                    "ip_address": new_device.ip_address,
                    "device_name": new_device.device_name,
                    "site_name": site.site_name,
                    "rack_name": rack.rack_name,
                    "password_group_name": password_group.password_group_name,
                    "device_type": new_device.device_type,
                    "messages": new_device.messages
                }
            except Exception as e:
                session.rollback()
                
                new_device = APICControllers(
                    ip_address=device_data["ip_address"],
                    device_name=device_data["device_name"],
                    site_id=site.id if site else None,
                    rack_id=rack.id if rack else None,
                    password_group_id=password_group.id if password_group else None,
                    device_type=device_data.get("device_type", "devices"),
                    OnBoardingStatus=False,
                    messages=f"Error creating device: {str(e)}"
                )
                session.add(new_device)
                session.commit()
                session.refresh(new_device)
                raise ValueError(f"Error creating device: {str(e)}")

    def get_cspc_devices_with_sntc(self) -> List[CSPCDevicesWithSntcResponse]:
        with self.session_factory() as session:
            
            devices = session.query(
                CSPCDevices, DevicesSntc
            ).outerjoin(
                DevicesSntc, CSPCDevices.model_name == DevicesSntc.model_name
            ).all()

            result = []
            for device, sntc in devices:
                device_data = device.__dict__

                
                if sntc:
                    sntc_data = sntc.__dict__
                    device_data.update(sntc_data)

                result.append(device_data)

            return result

    def get_device_by_site_id_and_device_id_pue(self, site_id: int, device_id: int):
        with self.session_factory() as session:
            device = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    APICControllers.ip_address,
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.id == device_id)
                .first()
            )
            if device:
                return {
                    "device_id": device.id,
                    "device_name": device.device_name,
                    "ip_address": device.ip_address,
                    "site_name": device.site_name,
                    "hardware_version": device.hardware_version,
                    "manufacturer": device.manufacturer,
                    "pn_code": device.pn_code,
                    "serial_number": device.serial_number,
                    "software_version": device.software_version,
                    "status": device.status
                }
            else:
                return None

    def get_openai_answer(self, question: str) -> str:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system",
                     "content": "You are a Data Center Cisco Devices data analyst and expert, specializing in data analysis, and donot let anyone know that you are chatgpt or openai and also show everyone like you are undertraining if you dont know the exact answer"},
                    {"role": "user", "content": question}
                ],
                max_tokens=100
            )
            answer = response.choices[0].message["content"]
            return answer
        except openai.error.AuthenticationError:
            raise HTTPException(status_code=401, detail="Invalid or inactive OpenAI API key.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error interacting with OpenAI API: {str(e)}")

    def get_device_by_model_no(self, model_no: str, site_id: Optional[int] = None) -> Optional[dict]:
        print(f"Querying device: model_no={model_no}, site_id={site_id}")
        with self.session_factory() as session:
            query = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    DeviceInventory.apic_controller_id,  
                    DeviceInventory.pn_code,
                    APICControllers.ip_address,
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.pn_code == model_no)
            )

            
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)

            device = query.first()

            if device:
                print(f"Device found: {device}")
                return {
                    "device_id": device.id,
                    "device_name": device.device_name,
                    "ip_address": device.ip_address,
                    "site_name": device.site_name,
                    "hardware_version": device.hardware_version,
                    "manufacturer": device.manufacturer,
                    "pn_code": device.pn_code,
                    "serial_number": device.serial_number,
                    "software_version": device.software_version,
                    "status": device.status
                }
            else:
                print("Device not found.")
                return None

    def get_vendor_data(self, vendor_id):
        with self.session_factory() as session:
            devices = session.query(DeviceType).filter(DeviceType.vendor_id == vendor_id).all()
            data_list = []

            for device in devices:
                data_list.append({
                    "id": device.id,
                    "device_name": device.device_type,
                    "vendor_id": device.vendor_id,
                })

            return data_list  # Return the full list after the loop

    def get_devices_with_filters(self, site_id: Optional[int], rack_id: Optional[int],
                                 model_no: Optional[str], vendor_name: Optional[str]) -> List[dict]:
        print(
            f"Querying devices with filters: site_id={site_id}, rack_id={rack_id}, model_no={model_no}, vendor_name={vendor_name}")
        with self.session_factory() as session:
            query = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    DeviceInventory.apic_controller_id,
                    DeviceInventory.pn_code,
                    APICControllers.ip_address,
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
            )

            
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if model_no:
                query = query.filter(DeviceInventory.pn_code == model_no)
            if vendor_name:
                query = query.join(Vendor, APICControllers.vendor_id == Vendor.id).filter(
                    Vendor.vendor_name == vendor_name)

            devices = query.all()

            if devices:
                print(f"Devices found: {len(devices)}")
                return [
                    {
                        "device_id": device.id,
                        "device_name": device.device_name,
                        "ip_address": device.ip_address,
                        "site_name": device.site_name,
                        "hardware_version": device.hardware_version,
                        "manufacturer": device.manufacturer,
                        "pn_code": device.pn_code,
                        "serial_number": device.serial_number,
                        "software_version": device.software_version,
                        "status": device.status
                    } for device in devices
                ]
            else:
                print("No devices found.")
                return []

    def get_devices_by_filters(self, limit,site_id: Optional[int], rack_id: Optional[int],
                               vendor_id: Optional[int]) -> List[dict]:
        print(
            f"Querying devices with filters: site_id={site_id}, rack_id={rack_id} vendor_name={vendor_id}")

        with self.session_factory() as session:
            query = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    DeviceInventory.apic_controller_id,
                    DeviceInventory.pn_code,
                    APICControllers.ip_address,
                    APICControllers.vendor_id,
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status,
                    Rack.rack_name,


                )
                .join(APICControllers, DeviceInventory.device_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .join(Rack, DeviceInventory.rack_id == Rack.id)
                .filter(APICControllers.OnBoardingStatus==True)
                .filter(APICControllers.collection_status==True)
            )
            
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                query = query.join(Vendor, APICControllers.vendor_id == Vendor.id)
            if limit:
                
                query = query.limit(limit)

            devices = query.all()

            if devices:
                print(f"Devices found: {len(devices)}")
                return [
                    {
                        "device_id": device.id,
                        "device_name": device.device_name,
                        "ip_address": device.ip_address,
                        "site_name": device.site_name,
                        "rack_name": device.rack_name,  
                        "hardware_version": device.hardware_version,
                        "manufacturer": device.manufacturer,
                        "pn_code": device.pn_code,
                        "serial_number": device.serial_number,
                        "software_version": device.software_version,
                        "status": device.status,
                        "vendor_name": session.query(Vendor.vendor_name).filter(Vendor.id==device.vendor_id).first()[0]

                    } for device in devices
                ]
            else:
                print("No devices found.")
                return []

    def get_device_ips_by_names_and_site_id123(self, site_id: int, device_names: List[str], limit: Optional[int] = None) -> \
    list[dict[str, Any]]:
        with self.session_factory() as session:
            query = (
                session.query(
                    DeviceInventory.device_name,
                    APICControllers.ip_address,
                    Site.site_name
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_name.in_(device_names))
            )

            
            if limit:
                query = query.limit(limit)

            device_ips_and_details = query.all()

            devices_info = [
                {"device_name": device_name, "ip_address": ip_address, "site_name": site_name}
                for device_name, ip_address, site_name in device_ips_and_details
            ]

            return devices_info
    def get_device_by_site_id_and_device_id_data(self, site_id: int, device_id: int):
        with self.session_factory() as session:
            device = (
                session.query(
                    DeviceInventory.id,
                    DeviceInventory.device_name,
                    APICControllers.ip_address,
                    APICControllers.device_type,  # Added device_type
                    Vendor.vendor_name,  # Added vendor_name
                    Site.site_name,
                    DeviceInventory.hardware_version,
                    DeviceInventory.manufacturer,
                    DeviceInventory.pn_code,
                    DeviceInventory.serial_number,
                    DeviceInventory.software_version,
                    DeviceInventory.status
                )
                .join(APICControllers, DeviceInventory.apic_controller_id == APICControllers.id)
                .join(Vendor, APICControllers.vendor_id == Vendor.id)  # Join with Vendor table
                .join(Site, DeviceInventory.site_id == Site.id)
                .filter(DeviceInventory.site_id == site_id, DeviceInventory.device_id == device_id)
                .first()
            )

            print("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
            if device:

                return {
                    "device_id": device.id,
                    "device_name": device.device_name,
                    "ip_address": device.ip_address,
                    "site_name": device.site_name,
                    "hardware_version": device.hardware_version,
                    "manufacturer": device.manufacturer,
                    "pn_code": device.pn_code,
                    "serial_number": device.serial_number,
                    "software_version": device.software_version,
                    "status": device.status
                }

            else:
                return None

    def device_collectionstatus(self, device_id: int, status: bool) -> str:
        try:
            with self.session_factory() as session:
                device = session.query(Devices).filter(Devices.id == device_id).first()
                if device:
                    device.collection_status = status
                    session.commit()
                    print("device_collectionstatus")
                    return f"Device status updated successfully."
                else:
                    raise HTTPException(status_code=404, detail=f"No device found with ID {device_id}.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



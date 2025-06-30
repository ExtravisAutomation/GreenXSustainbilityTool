import sys
from contextlib import AbstractContextManager
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Callable, List, Optional
from app.model.apic_controller import APICController
from app.model.device_inventory import DeviceInventory
from app.model.APIC_controllers import APICControllers as Devices
from app.repository.InfluxQuery import get_24h_rack_datatraffic, get_24hrack_power, get_rack_power, get_site_power_data_per_hour
from app.model.rack import Rack
from app.model.site import Site
from app.schema.rack_schema import RackCreate
from app.repository.base_repository import BaseRepository

from app.schema.rack_schema import RackUpdate

from app.model.rack import Building
from app.schema.building_schema import BuildingUpdate

from app.model.rack import rack_building_association

from app.schema.rack_schema import RackDetails

from app.schema.building_schema import BuildingCreate

from app.schema.building_schema import BuildingDetails


class RackRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        super().__init__(session_factory, Rack)
    def get_device_rack_id(self,rack_id):
        with (self.session_factory() as session):
            ips=session.query(Devices.ip_address).filter(
                rack_id == DeviceInventory.rack_id, Devices.id == DeviceInventory.device_id
            ) .filter(Devices.OnBoardingStatus==True).filter(Devices.collection_status==True).distinct().all()

            return ips

    def get_all_racks(self,site_id) -> List[RackDetails]:
        with (self.session_factory() as session):
            if site_id:
                racks = session.query(Rack).filter(Rack.site_id==site_id).all()
            else:
                racks = session.query(Rack).all()
            for rack in racks:
                building = (
                    session.query(Building.building_name)
                    .join(rack_building_association, Building.id == rack_building_association.c.building_id)
                    .filter(rack_building_association.c.rack_id == rack.id)
                    .first()
                )
                rack.building_name = building[0] if building else None  

                ips =self.get_device_rack_id(rack.id )
                # session.query(Devices.ip_address).filter(
                #     rack.id == DeviceInventory.rack_id, Devices.id == DeviceInventory.device_id
                # ).distinct().all()

                site_result = session.query(Site.site_name).filter(Site.id == rack.site_id).first()
                rack.site_name = site_result[0] if site_result else None

                num_devices = len(ips)
                rack.num_devices = num_devices
                rack_power_data =  get_24hrack_power(ips, rack.id)
                rack_traffic_data = get_24h_rack_datatraffic(ips, rack.id)

                if rack_power_data:
                    print("data")
                    print(rack_power_data)
                    energy_effieciency_values = [data.get('energy_effieciency', 0) for data in rack_power_data]
                    total_effieciency_values = sum(energy_effieciency_values)
                    print(total_effieciency_values)
                    print(len(energy_effieciency_values))

                    average_power_utilization = total_effieciency_values / len(energy_effieciency_values)
                    rack.power_utilization = round(average_power_utilization, 2)

                    pue_values = [data.get('pue', 0) for data in rack_power_data]
                    total_pue = sum(pue_values)
                    average_pue = total_pue / len(pue_values)
                    rack.pue = round(average_pue, 2)


                    power_input_values = [data.get('power_input', 0) for data in rack_power_data]
                    total_power_input = sum(power_input_values)
                    rack.power_input = round(total_power_input / 1000, 2)
                else:
                    rack.power_utilization = 0
                    rack.pue = 0
                    rack.power_input = 0

                
                if rack_traffic_data:
                    traffic_throughput_values = [data.get('traffic_through', 0) for data in rack_traffic_data]
                    total_traffic_throughput = sum(traffic_throughput_values)
                    rack.datatraffic = round(total_traffic_throughput / (1024 ** 3), 2)  
                else:
                    rack.datatraffic = 0

            return racks
        
    def get_specific_racks(self, rack_id: int, site_id: int):
        with self.session_factory() as session:
            racks = session.query(Rack).filter(Rack.id == rack_id and Rack.site_id == site_id).all()

            for rack in racks:
                apic_ips = session.query(APICController.ip_address).filter(
                    rack.id == DeviceInventory.rack_id,
                    APICController.id == DeviceInventory.apic_controller_id
                ).distinct().all()

                result = session.query(Site.site_name).filter(
                    Site.id == rack.site_id).first()
                num_devices = session.query(func.count(Devices.id)).filter(Devices.rack_id == rack.id).scalar()
                rack.site_name = result[0]
                rack_power_data = get_24hrack_power(apic_ips, rack.id)
                rack_traffic_data = get_24h_rack_datatraffic(apic_ips, rack.id)
                print(rack_traffic_data, "traffic data")
                print(rack_power_data, "Power_data")
                rack.num_devices = num_devices
                if rack_power_data:
                    power_utilization_values = [data.get('power_utilization', 0) for data in rack_power_data]
                    total_power_utilization = sum(power_utilization_values)
                    average_power_utilization = total_power_utilization / len(power_utilization_values)
                    rack.power_utilization = round(average_power_utilization, 2)

                    pue = [data.get('pue', 0) for data in rack_power_data]
                    total_pue = sum(pue)
                    average_pue = total_pue / len(pue)
                    rack.pue = round(average_pue, 2)

                    power_input_values = [data.get('power_input', 0) for data in rack_power_data]
                    total_power_input = sum(power_input_values)

                    rack.power_input = round(total_power_input / 1000, 2)
                else:
                    rack.power_utilization = 0
                    rack.power_input = 0
                    rack.pue = 0

                if rack_traffic_data:
                    traffic_throughput_values = [data.get('traffic_through', 0) for data in rack_traffic_data]
                    total_traffic_throughput = sum(traffic_throughput_values)
                    
                    datatraffic = total_traffic_throughput / (1024 ** 3)
                    rack.datatraffic = round(datatraffic, 2)

                else:
                    rack.datatraffic = 0

            return racks


    def add_rack(self, rack_data: RackCreate) -> Rack:
        with self.session_factory() as session:
            
            building = session.query(Building).filter_by(id=rack_data.building_id).first()
            if not building:
                raise ValueError("Building ID not found")
            new_rack = Rack(**rack_data.dict(exclude={"building_id"}))
            session.add(new_rack)
            session.commit()

            session.execute(
                rack_building_association.insert().values(rack_id=new_rack.id, building_id=rack_data.building_id))
            session.commit()

            session.refresh(new_rack)
            return new_rack

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> Rack:
        with self.session_factory() as session:
            rack = session.get(Rack, rack_id)
            if not rack:
                raise HTTPException(status_code=404, detail="Rack not found")

            
            if rack_data.building_id is not None:
                building = session.query(Building).filter_by(id=rack_data.building_id).first()
                if not building:
                    raise HTTPException(status_code=404, detail="Building ID not found")

                
                session.execute(
                    rack_building_association.delete().where(rack_building_association.c.rack_id == rack.id)
                )
                session.execute(
                    rack_building_association.insert().values(rack_id=rack.id, building_id=rack_data.building_id)
                )

            
            for key, value in rack_data.dict(exclude_unset=True).items():
                if key != "building_id":  
                    if value is not None and value != '' and value != 'string':  
                        setattr(rack, key, value)

            session.commit()
            session.refresh(rack)  
            return rack

    def delete_rack(self, rack_ids: List[int]):
        with self.session_factory() as session:
            
            
            
            
            
            rack = session.query(Rack).filter(Rack.id.in_(rack_ids)).delete(synchronize_session='fetch')
            session.commit()

    def delete_racks(self, rack_ids: List[int]):
        with self.session_factory() as session:
            session.query(Rack).filter(Rack.id.in_(rack_ids)).delete(synchronize_session='fetch')
            session.commit()
            
            
    def get_rack_last_power_utilization(self, rack_id: int):
        with self.session_factory() as session:
            apic_ips = session.query(Devices.ip_address).filter(
                Devices.rack_id == rack_id).distinct().all()
            print(apic_ips)

            response = []

            rack_data=get_rack_power(apic_ips,rack_id)
            if rack_data:
                total_power_utilization = sum(item['power_utilization'] for item in rack_data)
                average_power_utilization = total_power_utilization / len(rack_data)
            else:
                average_power_utilization = 0  

                
            response = {
                'Rack_id': rack_id,
                'power_utilization': round(average_power_utilization, 2)}
            
            
            
            
            
            return response
        
        
    def get_rack_power_utilization(self, rack_id: int):
        with self.session_factory() as session:
            apic_ips = session.query(Devices.ip_address).filter(
            Devices.rack_id == rack_id).distinct().all()


            print(apic_ips)

            hourly_data=get_site_power_data_per_hour(apic_ips,rack_id)

            response = []
            for data in hourly_data:
                response.append({
                    'Rack_id': rack_id,
                    'hour': data['hour'],
                    'energy_efficieny': data['average_power_utilization']
                })
            return response

    def create_building(self, building_data: BuildingCreate) -> Building:
        with self.session_factory() as session:
            new_building = Building(**building_data.dict())
            session.add(new_building)
            session.commit()
            session.refresh(new_building)
            return new_building

    def get_building(self, building_id: int) -> Optional[Building]:
        return self.session.query(Building).filter_by(id=building_id).first()

    def get_all_buildings(self) -> List[BuildingDetails]:
        with self.session_factory() as session:
            buildings = session.query(Building).all()
            return [BuildingDetails.from_orm(b) for b in buildings]

    def update_building(self, building_id: int, update_data: BuildingUpdate) -> Optional[Building]:
        building = self.get_building(building_id)
        if building:
            for key, value in update_data.dict(exclude_unset=True).items():
                setattr(building, key, value)
            self.session.commit()
            self.session.refresh(building)
        return building

    def delete_building(self, building_id: int) -> bool:
        building = self.get_building(building_id)
        if building:
            self.session.delete(building)
            self.session.commit()
            return True
        return False

    def delete_multiple_buildings(self, building_ids: List[int]) -> List[int]:
        deleted_ids = []
        for building_id in building_ids:
            if self.delete_building(building_id):
                deleted_ids.append(building_id)
        return deleted_ids

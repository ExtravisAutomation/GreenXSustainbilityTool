import sys
from contextlib import AbstractContextManager
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Callable, List
from app.model.apic_controller import APICController
from app.model.device_inventory import DeviceInventory
from app.model.APIC_controllers import APICControllers as Devices
from app.repository.InfluxQuery import get_24h_rack_datatraffic, get_24hrack_power, get_rack_power, get_site_power_data_per_hour
from app.model.rack import Rack
from app.model.site import Site
from app.schema.rack_schema import RackCreate
from app.repository.base_repository import BaseRepository

from app.schema.rack_schema import RackUpdate


class RackRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        super().__init__(session_factory, Rack)

    def get_all_racks(self) -> List[Rack]:
        with self.session_factory() as session:
            # Old Code
            # return list(session.query(Rack).all())
            
            # Converted code
            racks = session.query(Rack).all()

            for rack in racks:
                apic_ips = session.query(APICController.ip_address).filter(
                    rack.id==DeviceInventory.rack_id ,APICController.id==DeviceInventory.apic_controller_id).distinct().all()

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

                    rack.power_input = round(total_power_input/1000,2)
                else:
                    rack.power_utilization = 0
                    rack.power_input = 0
                    rack.pue=0

                if rack_traffic_data:
                    traffic_throughput_values = [data.get('traffic_through', 0) for data in rack_traffic_data]
                    total_traffic_throughput = sum(traffic_throughput_values)
                    # average_traffic_throughput = total_traffic_throughput / len(traffic_throughput_values)
                    datatraffic = total_traffic_throughput / (1024 ** 3)
                    rack.datatraffic = round(datatraffic, 2)

                else:
                    rack.datatraffic = 0


            return racks

    def add_rack(self, rack_data: RackCreate) -> Rack:
        with self.session_factory() as session:
            new_rack = Rack(**rack_data.dict())
            session.add(new_rack)
            session.commit()
            session.refresh(new_rack)
            return new_rack

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> Rack:
        with self.session_factory() as session:
            rack = session.get(Rack, rack_id)
            if not rack:
                raise HTTPException(status_code=404, detail="Rack not found")
            for key, value in rack_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(rack, key, value)

            session.commit()
            session.refresh(rack)  # Refresh the instance to ensure it's fully loaded
            return rack

    def delete_rack(self, rack_ids: List[int]):
        with self.session_factory() as session:
            # rack = session.query(Rack).filter(Rack.id == rack_ids).first()
            # if rack is None:
            #     raise HTTPException(status_code=404, detail="Rack not found")
            # session.delete(rack)
            # session.commit()
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
                average_power_utilization = 0  # Default to 0 if no data is available

                # Create a response that includes the rack ID and the average power utilization
            response = {
                'Rack_id': rack_id,
                'power_utilization': round(average_power_utilization, 2)}
            # for data in rack_data:
            #     response.append({
            #         'Rack_id': rack_id,
            #         'power_utilization': data['power_utilization']
            #     })
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
                    'power_utilization': data['average_power_utilization']
                })
            return response

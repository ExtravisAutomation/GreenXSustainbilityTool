from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session
from app.repository.InfluxQuery import get_power_data_per_hour, get_traffic_data_per_hour
from app.schema.perhr_schema import ApicControllerInput
from app.repository.base_repository import BaseRepository
from app.model.APIC_controllers import APICControllers as Devices


class PerhrRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        
        
        
    def device_power_perhr(self, apic_ip_data: ApicControllerInput):
        with self.session_factory() as session:
            print(apic_ip_data.apic_controller_ip)
            hourly_data = get_power_data_per_hour(apic_ip_data.apic_controller_ip)  

            response = []
            
            for data in hourly_data:
                result = session.query(Devices.device_name).filter(
                    Devices.ip_address == data['apic_controller_ip']).first()

                response.append({
                    'apic_controller_ip': apic_ip_data.apic_controller_ip,
                    'apic_controller_name':result[0],
                    'hour': data['hour'],
                    'power_utilization': data['power_utilization']
                })
                
            return response
        
        
        
    def device_traffic_perhr(self, apic_ip_data: ApicControllerInput):
        with self.session_factory() as session:
            hourly_data = get_traffic_data_per_hour(apic_ip_data.apic_controller_ip)  
            
            response = []
            
            for data in hourly_data:
                result =  session.query(Devices.device_name).filter(
                    Devices.ip_address == data['apic_controller_ip']).first()
                print(result[0])
                data_gb = data['traffic'] / (1024 ** 3)
                response.append({
                    'apic_controller_ip': data['apic_controller_ip'],
                    'apic_controller_name': result[0],
                    'hour': data['hour'],
                    'Byetrate': round(data_gb, 2) if data_gb is not None else 0
                })
                
            return response
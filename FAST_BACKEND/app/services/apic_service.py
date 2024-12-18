import sys
import traceback
from typing import List

from app.repository.apic_repository import APICRepository
from app.schema.fabric_node import FabricNodeCreate, ExtendedFabricNode
from fastapi import HTTPException
from sqlalchemy.orm import Session
import requests
import urllib3
from collections import defaultdict
from datetime import datetime

from app.repository.influxdb_repository import InfluxDBRepository

from app.schema.fabric_node import FabricNodeResponse

from app.model.fabric_node import FabricNode

from app.schema.fabric_node import HourlyPowerUtilizationResponse

from app.schema.data_traffic import DataTrafficResponse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from app.schema.fabric_node import FabricNodeDetails


class APICService:
    def __init__(self, apic_repository: APICRepository):
        self.apic_repository = apic_repository
        

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    def get_fabric_nodes(self) -> List[FabricNodeDetails]:
        fabric_nodes = self.apic_repository.get_all_fabric_nodes()
        result = []
        for node in fabric_nodes:
            node_dict = {
                "id": node.id,
                "name": node.name,
                "role": node.role,
                "adStatus": node.adStatus,
                "address": node.address,
                "model": node.model,
                "serial": node.serial,
                "version": node.version,
                "pod": node.pod,
                "node": node.node,
                "mod_ts": node.mod_ts,
                "status": node.status,
                "vendor": node.vendor,
                "last_state_mod_ts": node.last_state_mod_ts,
                "delayed_heartbeat": node.delayed_heartbeat,
                "fabric_status": node.fabric_status,
                "apic_controller_id": node.apic_controller_id,
                "apic_controller_ip": node.apic_controller.ip_address if node.apic_controller else None,
            }
            result.append(FabricNodeDetails(**node_dict))
        return result

    def get_fabric_nodes_with_power_utilization(self) -> List[FabricNodeDetails]:
        try:
            fabric_nodes = self.apic_repository.get_fabric_nodes_with_power_utilization()
            return [FabricNodeDetails.from_orm(node) for node in fabric_nodes]
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))

    def get_power_utilization_5min(self, apic_controller_ip: str, node: str) -> float:
        drawn_avg, supplied_avg = self.apic_repository.influxdb_repository.get_power_data_last_5min(apic_controller_ip,
                                                                                                    node)
        if drawn_avg and supplied_avg:
            return (drawn_avg / supplied_avg) * 100
        else:
            return 0

    def get_power_utilization_perday(self, apic_controller_ip: str, node: str) -> float:
        drawn_avg, supplied_avg = self.apic_repository.influxdb_repository.get_power_data_per_day(apic_controller_ip,
                                                                                                  node)
        if drawn_avg and supplied_avg:
            return (drawn_avg / supplied_avg) * 100
        else:
            return 0

    def get_hourly_power_utilization(self, apic_ip: str, node: str) -> List[HourlyPowerUtilizationResponse]:
        hourly_data = self.apic_repository.influxdb_repository.get_power_data_per_hour(apic_ip, node)
        response = [
            HourlyPowerUtilizationResponse(
                apic_controller_ip=apic_ip,
                node=node,
                hour=data['hour'],
                power_utilization=data['power_utilization']
            ) for data in hourly_data
        ]
        return response

    def get_fabric_nodes_with_power_utilization_top(self) -> List[FabricNodeDetails]:
        try:
            fabric_nodes = self.apic_repository.get_all_fabric_nodes()
            nodes_with_utilization = []

            for node in fabric_nodes:
                drawn_avg, supplied_avg = self.apic_repository.influxdb_repository.get_power_data(
                    node.apic_controller.ip_address,
                    str(node.node))
                print("REVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVv", drawn_avg, supplied_avg, file=sys.stderr)
                if drawn_avg is not None and supplied_avg is not None and supplied_avg > 0:
                    power_utilization = round((drawn_avg / supplied_avg) * 100, 2)
                    nodes_with_utilization.append((node, power_utilization))

            top_nodes_with_utilization = sorted(nodes_with_utilization, key=lambda x: x[1], reverse=True)[:10]

            top_nodes_details = []
            for node, power_utilization in top_nodes_with_utilization:
                node_detail = FabricNodeDetails(
                    id=node.id,
                    name=node.name,
                    role=node.role,
                    adStatus=node.adStatus,
                    address=node.address,
                    model=node.model,
                    serial=node.serial,
                    version=node.version,
                    pod=node.pod,
                    node=node.node,
                    mod_ts=node.mod_ts,
                    status=node.status,
                    vendor=node.vendor,
                    last_state_mod_ts=node.last_state_mod_ts,
                    delayed_heartbeat=node.delayed_heartbeat,
                    fabric_status=node.fabric_status,
                    apic_controller_id=node.apic_controller_id,
                    apic_controller_ip=node.apic_controller.ip_address if node.apic_controller else None,
                    power_utilization=power_utilization
                )
                top_nodes_details.append(node_detail)
                print("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ", top_nodes_details, file=sys.stderr)
            return top_nodes_details

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))

    def get_top_data_traffic_nodes(self) -> List[DataTrafficResponse]:
        raw_data = self.apic_repository.influxdb_repository.get_top_data_traffic_nodes()

        filtered_data = [item for item in raw_data if item['bytesRateAvg'] > 0]

        organized_data: dict[str, List[dict]] = defaultdict(list)
        for item in filtered_data:
            organized_data[item['controller']].append(item)

        for controller, nodes in organized_data.items():
            organized_data[controller] = sorted(nodes, key=lambda x: x['bytesRateAvg'], reverse=True)[:5]

        response = []
        for controller, nodes in organized_data.items():
            for node in nodes:
                response.append(DataTrafficResponse(
                    controller=controller,
                    highest_node=node['node'],
                    bytesRateAvg=round(node['bytesRateAvg'], 2)
                ))

        return response

    def get_top_data_traffic_nodes_with_device_name(self) -> List[DataTrafficResponse]:
        try:
            
            fabric_nodes = self.apic_repository.get_all_fabric_nodes()
            print(f"Fabric nodes fetched: {len(fabric_nodes)}", file=sys.stderr)


            controller_node_to_device_name = {
                (node.apic_controller.ip_address, str(node.node)): node.name for node in fabric_nodes
            }

            raw_data = self.apic_repository.influxdb_repository.get_top_data_traffic_nodes()
            print(f"Raw data fetched from InfluxDB: {len(raw_data)}", file=sys.stderr)


            filtered_data = [item for item in raw_data if item['bytesRateAvg'] > 0]
            print(f"Filtered data (bytesRateAvg > 0): {len(filtered_data)}", file=sys.stderr)

            organized_data: dict[str, List[dict]] = defaultdict(list)
            for item in filtered_data:
                organized_data[item['controller']].append(item)

            response = []
            for controller, nodes in organized_data.items():
                nodes = sorted(nodes, key=lambda x: x['bytesRateAvg'], reverse=True)[:5]
                for node in nodes:
                    device_name = controller_node_to_device_name.get((controller, node['node']))
                    if device_name:  
                        response.append(DataTrafficResponse(
                            controller=controller,
                            highest_node=node['node'],
                            device_name=device_name,
                            bytesRateAvg=round(node['bytesRateAvg'], 2)
                        ))

            print(f"Response prepared: {len(response)} items", file=sys.stderr)
            return response
        except Exception as e:
            traceback.print_exc(file=sys.stderr)
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    def get_fabric_nodes_with_power_utilization_top_drawnLast(self) -> List[FabricNodeDetails]:
        try:
            fabric_nodes = self.apic_repository.get_all_fabric_nodes()
            nodes_with_utilization = []

            for node in fabric_nodes:
                drawnLast = self.apic_repository.influxdb_repository.get_power_data_drawnLast(
                    node.apic_controller.ip_address,
                    str(node.node))
                print(f"Power utilization for {node.name}: {drawnLast}%", file=sys.stderr)

                if drawnLast is not None:
                    nodes_with_utilization.append((node, drawnLast))

            top_nodes_with_utilization = sorted(nodes_with_utilization, key=lambda x: x[1], reverse=True)[:5]

            top_nodes_details = []
            for node, power_utilization in top_nodes_with_utilization:
                node_detail = FabricNodeDetails(
                    id=node.id,
                    name=node.name,
                    role=node.role,
                    adStatus=node.adStatus,
                    address=node.address,
                    model=node.model,
                    serial=node.serial,
                    version=node.version,
                    pod=node.pod,
                    node=node.node,
                    mod_ts=node.mod_ts,
                    status=node.status,
                    vendor=node.vendor,
                    last_state_mod_ts=node.last_state_mod_ts,
                    delayed_heartbeat=node.delayed_heartbeat,
                    fabric_status=node.fabric_status,
                    apic_controller_id=node.apic_controller_id,
                    apic_controller_ip=node.apic_controller.ip_address if node.apic_controller else None,
                    power_utilization=round(power_utilization, 2)
                )
                top_nodes_details.append(node_detail)

            return top_nodes_details

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))

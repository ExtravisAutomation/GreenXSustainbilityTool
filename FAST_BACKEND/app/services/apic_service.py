import traceback
from typing import List

from app.repository.apic_repository import APICRepository
from app.schema.fabric_node import FabricNodeCreate, ExtendedFabricNode
from fastapi import HTTPException
from sqlalchemy.orm import Session
import requests
import urllib3
from datetime import datetime

from app.repository.influxdb_repository import InfluxDBRepository

from app.schema.fabric_node import FabricNodeResponse

from app.model.fabric_node import FabricNode

from app.schema.fabric_node import HourlyPowerUtilizationResponse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from app.schema.fabric_node import FabricNodeDetails


class APICService:
    def __init__(self, apic_repository: APICRepository):
        self.apic_repository = apic_repository
        # self.influxdb_repository = influxdb_repository

    # def collect_and_store_data(self, apic_ips, username, password):
    #     session = requests.Session()
    #     session.verify = False
    #
    #     for api_endpoint in apic_ips:
    #         try:
    #             login_url = f"https://{api_endpoint}/api/aaaLogin.json"
    #             login_payload = {"aaaUser": {"attributes": {"name": username, "pwd": password}}}
    #             login_response = session.post(login_url, json=login_payload, verify=False)
    #
    #             if login_response.status_code == 200:
    #                 token = login_response.json()["imdata"][0]["aaaLogin"]["attributes"]["token"]
    #                 fabric_url = f"https://{api_endpoint}/api/node/class/fabricNode.json"
    #                 headers = {"Cookie": f"APIC-cookie={token}"}
    #                 fabric_response = session.get(fabric_url, headers=headers, verify=False)
    #
    #                 if fabric_response.status_code == 200:
    #                     fabric_data = fabric_response.json()
    #                     self._process_and_store_fabric_data(fabric_data, api_endpoint)
    #             else:
    #                 print(f"Failed to authenticate with {api_endpoint}")
    #         except Exception as e:
    #             print(f"Error fetching data from {api_endpoint}: {e}")
    #         finally:
    #             session.close()

    # def _process_and_store_fabric_data(self, fabric_data, api_endpoint):
    #     apic_controller = self.apic_repository.get_or_create_apic_controller(api_endpoint)
    #     for item in fabric_data['imdata']:
    #         attributes = item['fabricNode']['attributes']
    #         fabric_node_data = FabricNodeCreate(
    #             name=attributes['name'],
    #             role=attributes['role'],
    #             adStatus=attributes['adSt'],
    #             address=attributes['address'],
    #             model=attributes['model'],
    #             serial=attributes['serial'],
    #             version=attributes['version'],
    #             pod=int(attributes['dn'].split("/")[1].split("-")[1]),
    #             node=int(attributes['dn'].split("/")[2].split("-")[1]),
    #             mod_ts=datetime.strptime(attributes['modTs'], "%Y-%m-%dT%H:%M:%S.%f%z"),
    #             status=attributes['status'],
    #             vendor=attributes['vendor'],
    #             last_state_mod_ts=datetime.strptime(attributes['lastStateModTs'], "%Y-%m-%dT%H:%M:%S.%f%z"),
    #             delayed_heartbeat=attributes['delayedHeartbeat'],
    #             fabric_status=attributes['fabricSt'],
    #             apic_controller_id=apic_controller.id
    #         )
    #         self.apic_repository.create_fabric_node(fabric_node_data)

    # def get_nodes_with_power_utilization(self) -> List[ExtendedFabricNode]:
    #     try:
    #         nodes = self.apic_repository.get_all_fabric_nodes()
    #         extended_nodes = []
    #
    #         for node in nodes:
    #             try:
    #                 drawnAvg, suppliedAvg = self.influxdb_repository.get_power_data(node.apic_controller.ip_address,
    #                                                                                 node.name)
    #                 power_utilization = None
    #                 if drawnAvg is not None and suppliedAvg is not None and suppliedAvg != 0:
    #                     power_utilization = (drawnAvg / suppliedAvg) * 100
    #             except Exception as e:
    #                 print(f"Failed to fetch or calculate power data for node {node.name} from InfluxDB: {e}")
    #                 power_utilization = None
    #
    #             extended_node = ExtendedFabricNode.from_orm(node)
    #             extended_node.power_utilization = power_utilization
    #             extended_nodes.append(extended_node)
    #
    #         return extended_nodes
    #     except Exception as e:
    #         print(f"Error retrieving nodes data or calculating power utilization: {e}")
    #         raise HTTPException(status_code=500,
    #                             detail="Internal Server Error while processing power utilization of nodes.")

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

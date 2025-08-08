from netmiko import ConnectHandler
from typing import Optional, Dict, Any
import re
from collections import defaultdict
import requests
from requests import Session as RequestsSession
from sqlalchemy.orm import Session as SQLAlchemySession
from collector.Models.model import DeviceInventory, Device


class Apic_DevicePowerStackUpdater:
    def __init__(self, device, device_inventory: DeviceInventory, password_group, session: SQLAlchemySession, ssh_timeout: int = 10):
        self.device = device
        self.device_inventory = device_inventory
        self.password_group = password_group
        self.db_session = session  # SQLAlchemy session
        self.ssh_timeout = ssh_timeout
        self.connection = None

    def fetch_psu_info(self, device) -> Dict[int, Dict[str, Any]]:
        """
        Fetch and summarize PSU info from ACI (APIC) per node.
        Returns a dict per node:
        {
            node_id: {
                "ipaddress": <apic_ip>,
                "psu_count": <count>,
                "psu_model": <model> or comma-joined list,
                "total_capacity": <sum of W>
            }
        }
        """
        login_url = f"https://{device.ip_address}/api/aaaLogin.json"
        req_session = RequestsSession()
        req_session.verify = False  # Disable SSL verification — for production, use certs!
        login_payload = {
            "aaaUser": {
                "attributes": {
                    "name": self.password_group.username,
                    "pwd": self.password_group.password
                }
            }
        }

        try:
            resp = req_session.post(login_url, json=login_payload)
            resp.raise_for_status()

            psu_url = f"https://{device.ip_address}/api/node/class/eqptPsu.json?&order-by=eqptPsu.modTs|desc"
            psu_response = req_session.get(psu_url)
            psu_response.raise_for_status()

            psu_data = psu_response.json().get("imdata", [])
            node_summary = defaultdict(lambda: {
                "psu_models": [],
                "total_capacity": 0,
                "psu_count": 0
            })

            for item in psu_data:
                attrs = item["eqptPsu"]["attributes"]
                dn = attrs.get("dn", "")
                prod_id = attrs.get("model", "")

                # Extract node ID
                node_match = re.search(r'node-(\d+)', dn)
                if not node_match:
                    continue
                node_id = int(node_match.group(1))

                # Extract power wattage (e.g. 1100 from NXA-PAC-1100W-PI)
                parts = prod_id.split('-')
                powerdata = int(''.join(filter(str.isdigit, parts[2]))) if len(parts) > 2 else 0

                node_summary[node_id]["psu_count"] += 1
                node_summary[node_id]["psu_models"].append(prod_id)
                node_summary[node_id]["total_capacity"] += powerdata

            # Format final output per node
            final_result = {}
            node_ip_map = self.get_mgmtRsOoBStNode_response(req_session)
            print("Node IP Mapping:", node_ip_map)
            updated = False

            for node_id, entry in node_summary.items():
                models = entry["psu_models"]
                unique_models = list(set(models))
                model_str = unique_models[0] if len(unique_models) == 1 else ','.join(unique_models)
                node_id_str = str(node_id)
                ip_address = node_ip_map.get(node_id_str, device.ip_address)  # fallback to device ip if missing

                final_result[node_id] = {
                    "ipaddress": ip_address,  # Use the specific IP, not the whole map
                    "psu_count": entry["psu_count"],
                    "psu_model": model_str,
                    "total_capacity": entry["total_capacity"]
                }

                # Find the device with this IP address
                device_to_update = self.db_session.query(Device,DeviceInventory)\
                    .join(DeviceInventory, Device.id == DeviceInventory.device_id)\
                    .filter(Device.ip_address == ip_address)\
                    .first()

                if device_to_update and device_to_update.DeviceInventory:
                    device_to_update.DeviceInventory.psu_model = model_str
                    device_to_update.DeviceInventory.psu_count = entry["psu_count"]
                    device_to_update.DeviceInventory.total_power_capacity = entry["total_capacity"] or ""
                    updated = True

            if updated:
                self.db_session.commit()
                print(f"Updated devices with power info.")
            else:
                print("No devices were updated.")
                self.device_inventory.error_message = "No matching devices found for update"
                self.db_session.commit()

            print("Final PSU Results:", final_result)
            return final_result

        except Exception as e:
            print(f"Error fetching PSU info: {e}")
            self.device_inventory.error_message = str(e)
            self.db_session.commit()
            return {}

    def get_mgmtRsOoBStNode_response(self, req_session: RequestsSession) -> dict:
        """
        Get management out-of-band IP address for each node.
        Returns a dict: { node_number (str) : ip_address (str) }
        """
        url = f"https://{self.device.ip_address}/api/node/class/mgmtRsOoBStNode.json?&order-by=mgmtRsOoBStNode.modTs|desc"
        try:
            response = req_session.get(url)
            response.raise_for_status()
            imdata = response.json().get("imdata", [])

            node_address_map = {}
            for item in imdata:
                node_info = item.get('mgmtRsOoBStNode', {}).get('attributes', {})
                dn = node_info.get('dn', '')
                addr = node_info.get('addr', '').split('/')[0]  # Extract IP (ignore subnet mask)
                # Extract node number from dn, e.g. 'topology/pod-1/node-201' → '201'
                node_number = ''
                if '/node-' in dn:
                    node_number = dn.split('/node-')[-1]
                    # Optional: strip trailing characters like ']' if present
                    node_number = node_number.strip(']')

                if node_number and addr:
                    node_address_map[node_number] = addr

            return node_address_map

        except Exception as e:
            print(f"Failed to get management OOB node response: {e}")
            return {}
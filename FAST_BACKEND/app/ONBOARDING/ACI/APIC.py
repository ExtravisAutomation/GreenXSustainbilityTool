import logging
from sqlalchemy.exc import SQLAlchemyError
import requests
from sqlalchemy.orm import sessionmaker
from app.ONBOARDING.Models.model import Device, PasswordGroup,APICController,DeviceInventory
from app.ONBOARDING.Database.db_connector import DBConnection
import random
from datetime import datetime
from app.ONBOARDING.datastorage.datastore import DataStorage
# Setup logging
import re
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='onboardingDevicesApIC.log',  # Specify the file to save the logs
    filemode='a'  # Use 'a' to append to the file or 'w' to write over it
)

class APIClient:
    def __init__(self, device, password_group):
        """
        Initialize the APIClient class with device and password group.
        """
        self.device = device
        self.password_group = password_group
        self.session = requests.Session()  # Correct initialization of the session
        self.base_url = f"https://{device.ip_address}/api"
        self.get_ipaddress_Response = None
        self.get_auth_token()
        self.db_connection = DBConnection()
        self.rack_id=device.rack_id
        self.site_id=device.site_id


        # In production, consider handling SSL certificate verification properly.
        self.session.verify = False  # Set this to the path of the CA bundle if SSL verification is required.

    def get_auth_token(self):
        """
        Authenticate and return the auth token.
        """
        login_url = f"{self.base_url}/aaaLogin.json"
        auth_data = {
            "aaaUser": {
                "attributes": {
                    "name": self.password_group.username,
                    "pwd": self.password_group.password
                }
            }
        }
        try:

            response = self.session.post(login_url, json=auth_data, verify=False)
            response.raise_for_status()
            print("Logged in successfully")
        except Exception as e:
            logging.error(f"Authentication failed at {login_url}: {e}")
            raise

    # def get_fabricNodes(self):
    #     """
    #     Make an authenticated API request and return the response.
    #     """
    #     try:
    #         token = self.get_auth_token()  # Ensure the token is used in the headers if needed
    #         path = '/node/class/fabricNode.json'
    #         url = f"{self.base_url}{path}"
    #         headers = {'Authorization': f"Bearer {token}"}
    #         response = self.session.get(url, headers=headers)
    #
    #         response.raise_for_status()
    #
    #         nodes = response.json()["imdata"]
    #         print(response)
    #         node_ips = {}
    #         for node in nodes:
    #             attributes = node["fabricNode"]["attributes"]
    #             node_info = {
    #                 "id": attributes["id"],
    #                 "address": self.get_ipaddress(attributes["id"]),
    #                 "serial": attributes["serial"],
    #                 "model": attributes["model"],
    #                 "name": attributes["name"],
    #                 "vendor": attributes["vendor"],
    #                 "version": attributes["version"],
    #                 "lastStateModTs": attributes["lastStateModTs"],
    #                 "status": attributes["status"],
    #             }
    #             node_ips[attributes["id"]] = node_info
    #         return node_ips
    #     except Exception as e:
    #         logging.error(f"Error fetching fabric nodes: {e}")
    #         raise
    def get_inventory(self):
        try:
            print("Fetching fabric nodes")
            path = '/node/class/fabricNode.json'
            url = f"{self.base_url}{path}"

            response = self.session.get(url, verify=False)
            response.raise_for_status()
            self.get_ipaddress_Response=self.get_mgmtRsOoBStNode_response()

            nodes = response.json()["imdata"]
            node_ips = {}
            node = 0
            for node in nodes:
                attributes = node["fabricNode"]["attributes"]


                node_id = attributes.get("id")

                node_info = {
                    "id": attributes.get("id"),
                    "address": self.get_ipaddress(node_id),
                    "serial": attributes.get("serial"),
                    "model": attributes.get("model"),
                    "name": attributes.get("name"),
                    "vendor": attributes.get("vendor"),
                    "version": attributes.get("version"),
                    "lastStateModTs": attributes.get("lastStateModTs"),
                    "status": attributes.get("status"),
                    "role": attributes.get("role"),
                }

                node_ips[node_id] = node_info



            # self.save_data(node_ips)
            dataStorage=DataStorage(node_ips,self.device, self.password_group.id)
            dataStorage.save_data()

            return f"Device Onboarded {self.device.ip_address} successfully"
        except Exception as e:
            logging.error(f"Error fetching fabric nodes: {e}")
            return f"Error in Onboarding {self.device.ip_address} device"
            raise

    def get_mgmtRsOoBStNode_response(self):
        """
        Get management out-of-band state node response.
        """
        path = '/node/class/mgmtRsOoBStNode.json?&order-by=mgmtRsOoBStNode.modTs|desc'
        url = f"{self.base_url}{path}"
        try:
            response = self.session.get(url, verify=False)
            response.raise_for_status()
            imdata=response.json()["imdata"]
            node_address_map = {}
            for item in imdata:
                node_info = item['mgmtRsOoBStNode']['attributes']
                dn = node_info['dn']
                addr = node_info['addr'].split('/')[0]
                node_number = dn.split('/node-')[-1].strip(']')
                node_address_map[node_number] = addr

            return node_address_map
        except Exception as e:
            logging.error(f"Error fetching management out-of-band state node response: {e}")
            raise

    def get_ipaddress(self, node_id):
        print('node_id: {}'.format(node_id))
        return self.get_ipaddress_Response.get(node_id, "Node not found")
        # for item in self.get_ipaddress_Response:
        #     # Check if the 'mgmtRsOoBStNode' key is in the item
        #     if 'mgmtRsOoBStNode' in item:
        #         node = item['mgmtRsOoBStNode']
        #         dn = node['attributes']['dn']
        #
        #         # Extract the node ID using regular expression
        #         match = re.search(r'node-(\d+)', dn)
        #         if match:
        #             extracted_node_id = match.group(1)
        #             print(f"Extracted node ID: {extracted_node_id}, Node ID to match: {node_id}")
        #             # Check if the extracted node ID matches the provided node_id
        #             if extracted_node_id == str(node_id):
        #                 ipaddress = node['attributes']['addr'].split('/')[0]
        #                 print(f"Found IP address: {ipaddress} for node ID: {node_id}")
        #                 return ipaddress
        #     print(f"No matching node found for node ID: {node_id}")
        #     return None
            # if 'mgmtRsOoBStNode' in item:
            #     node = item['mgmtRsOoBStNode']
            #     # Extract the 'dn' value and check if it contains the node_id
            #     if node_id in node['attributes']['dn']:
            #         print(node['attributes']['addr'])
            #         ipaddress=node['attributes']['addr'].split('/')[0]
            #         return ipaddress
            # # Return None if no match is found

    # def save_data(self, node_ips):
    #     print("Saving data",len(node_ips))
    #
    #     with self.db_connection.session_scope() as session:
    #         try:
    #             for node_id, node_info in node_ips.items():
    #                 logging.info(f"Processing node {node_id} with info {node_info}")
    #                 device = session.query(Device).filter(Device.ip_address == node_info['address']).first()
    #                 if not device:
    #                     device = Device(
    #                         ip_address=node_info['address'],
    #                         device_type='APIC',
    #                         device_name=node_info['name'],
    #                         site_id=self.site_id,
    #                         rack_id=self.rack_id,
    #                         rack_unit=2,
    #                         OnBoardingStatus=True
    #                     )
    #                     session.add(device)
    #                     session.flush()
    #                     logging.info(f"Added new device with IP: {node_info['address']}")
    #                 else:
    #                     # Only update if OnBoardingStatus is False
    #                     if not device.OnBoardingStatus:
    #                         device.OnBoardingStatus = True
    #                         device.device_name = node_info['name']
    #                         logging.info(f"Updated existing device with IP: {node_info['address']}")
    #                         session.flush()
    #                   # Ensure the device ID is available for further processing
    #
    #                 # Call deviceinventory function after device is added or updated
    #                 self.add_deviceinventory(device.id, node_info, session)
    #                 logging.info(f"Finished processing node {node_id}")
    #             session.commit()  # Commit the transaction
    #         except Exception as e:
    #             logging.error(f"Error saving data: {e}")
    #             print(f"Exception occurred: {e}")  # Temporarily add this to ensure visibility
    #             session.rollback() # Rollback the transaction in case of error
    # def save_data(self, node_ips):
    #     connection = self.db_connection.engine.connect()
    #     transaction = connection.begin()
    #     try:
    #         for node_id, node_info in node_ips.items():
    #             session = sessionmaker(bind=connection)()
    #             logging.info(f"Processing node {node_id} with info {node_info}")
    #             device = session.query(Device).filter(Device.ip_address == node_info['address']).first()
    #             if not device:
    #                 device = Device(
    #                     ip_address=node_info['address'],
    #                     device_type='APIC',
    #                     device_name=node_info['name'],
    #                     site_id=self.site_id,
    #                     rack_id=self.rack_id,
    #                     rack_unit=2,
    #                     OnBoardingStatus=True
    #                 )
    #                 session.add(device)
    #             else:
    #                 if not device.OnBoardingStatus:
    #                     device.OnBoardingStatus = True
    #                     device.device_name = node_info['name']
    #
    #             session.flush()  # Obtain the ID for the new or updated device
    #             self.add_deviceinventory(device.id, node_info, session)
    #             session.commit()
    #             logging.info(f"Finished processing node {node_id}")
    #
    #         transaction.commit()
    #     except SQLAlchemyError as e:
    #         logging.error(f"Error during transaction: {e}")
    #         transaction.rollback()
    #         raise
    #     finally:
    #         connection.close()
    def save_data(self, node_ips):
        print("Saving data", len(node_ips))

        for node_id, node_info in node_ips.items():
            try:
                with self.db_connection.session_scope() as session:
                    logging.info(f"Processing node {node_id} with info {node_info}")
                    device = session.query(Device).filter(Device.ip_address == node_info['address']).first()
                    if not device:
                        device = Device(
                            ip_address=node_info['address'],
                            device_type='APIC',
                            device_name=node_info['name'],
                            site_id=self.site_id,
                            rack_id=self.rack_id,
                            rack_unit=2,
                            OnBoardingStatus=True,
                            password_group_id=self.password_group.id,
                            node_id=node_info['id']


                        )
                        session.add(device)
                        logging.info(f"Added new device with IP: {node_info['address']}")
                    else:

                        device.OnBoardingStatus = True
                        device.device_name = node_info['name']
                        device.node_id=node_info['id']
                        logging.info(f"Updated existing device with IP: {node_info['address']}")

                    session.commit()  # Commit each device as it's processed
                    self.add_deviceinventory(device.id, node_info, session)

                    logging.info(f"Finished processing node {node_id}")
            except Exception as e:
                logging.error(f"Error saving data for node {node_id}: {e}")

    def add_deviceinventory(self, device_id, node_info, session):
        try:
            apic =session.query(DeviceInventory).filter(DeviceInventory.apic_controller_id == device_id).first()
            if not apic:
                new_apic = APICController(
                    id=device_id,
                    ip_address=node_info['address'],
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                session.add(new_apic)
                logging.info(f"Added new APIC controller with IP: {node_info['address']}")

                new_device = DeviceInventory(
                    pn_code=node_info['model'],
                    serial_number=node_info['serial'],
                    site_id=self.site_id,
                    rack_id=self.rack_id,
                    software_version=node_info['version'],
                    device_name=node_info['name'],  # Fixed typo
                    status=node_info['status'],
                    apic_controller_id=device_id,

                    role=node_info['role']
                )
                session.add(new_device)
                logging.info(f"Added new device inventory with IP: {node_info['address']}")
            session.commit()
        except Exception as e:
                logging.error(f"Error in add_deviceinventory: {e}")
                raise  # Raise the exception to handle it in the caller or let it propagate


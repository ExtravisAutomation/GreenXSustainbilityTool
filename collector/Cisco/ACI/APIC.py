from threading import Thread
import requests
import logging
from collector.Cisco.ACI.PowerUsage import Version4,Version5
from collector.Models.model import Device
from collector.Database.db_connector import DBConnection
from collections import defaultdict
from collector.Cisco.ACI.datatrafficdata import *
from collector.DataStore.datastore import DataStorage

# Setup logging
logger = logging.getLogger(__name__)


class APIClient:
    def __init__(self, device, deviceInventory, password_group,session):
        """
#         Initialize the APIClient class with device and password group.
#         """
        self.device = device
        self.deviceInventory = deviceInventory
        self.password_group = password_group
        self.session = requests.Session()
        self.base_url = f"https://{device.ip_address}/api"
        self.db_connection = DBConnection()
        self.rack_id = device.rack_id
        self.site_id = device.site_id
        self.version = deviceInventory.software_version
        self.power_data = 0
        self.traffic_data = 0
        self.req_power = 0
        self.error_message=''
        self.client = self.db_connection.influx_client
        self.write_api = self.db_connection.write_api
        self.query_api = self.db_connection.query_api

        # In production, consider handling SSL certificate verification properly.
        self.session.verify = False

        self.get_auth_token()

    def get_auth_token(self):
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
            response = self.session.post(login_url, json=auth_data)
            response.raise_for_status()
            logging.info("Logged in successfully")
        except requests.exceptions.RequestException as e:
            self.error_message=f"Authentication failed at {login_url}: {e}"
            logging.error(f"Authentication failed at {login_url}: {e}")
            raise


    def main(self):

        logging.info(f"Starting main process for device at {self.device.ip_address} with version {self.version}")

        def process_power_usage(version_instance):
            try:
                logging.info("Starting power usage processing.")
                self.error_message,self.power_data = version_instance.powerusage()

                logging.info(f"Power data retrieved: {self.power_data}")

                data = self.aggregate_Powerdata(self.power_data)  # # Aggregate power data
                logging.info(f"Aggregated power data: {data}")
                datastore = DataStorage()
                datastore.store_Powerdata(data)
                logging.info("Power usage data stored successfully.")
            except Exception as e:
                self.error_message=f"Error processing power usage: {e}"
                logging.error(f"Error processing power usage: {e}")

        def process_req_power(version_instance):
            try:
                logging.info("Starting required power processing.")
                self.req_power = version_instance.req_power()
                data = self.aggregate_RequiredPower(self.req_power) # Aggregate required power data
                logging.info(f"Aggregated required power data: {data}")
                datastore = DataStorage()
                datastore.store_ReqPowerdata(data)
                logging.info("Required power data stored successfully.")
            except Exception as e:
                logging.error(f"Error processing required power: {e}")

        def process_data_traffic():
            try:
                logging.info("Starting data traffic processing.")
                traffic_data = DataTraffic(self.device.ip_address, self.base_url, self.session)
                self.error_message,self.traffic_data = traffic_data.get_traffic_data()
                # print("datata")
                logging.info(f"Traffic data retrieved: {self.traffic_data}")

                # data = self.aggregate_DataTraffic(self.traffic_data) # Aggregate traffic data data

                logging.info(f"Aggregated data traffic: {self.traffic_data}")
                datastore = DataStorage()
                datastore.store_DataTraffic(self.traffic_data)
                logging.info("Data traffic stored successfully.")
            except Exception as e:
                self.error_message = f"Error processing data traffic {e}"
                logging.error(f"Error processing data traffic: {e}")
        try:
            if "4.2" in self.version:
                logging.info(f"Version 4.2(4c) detected for device at {self.device.ip_address}")
                version_instance = Version4(self.device.ip_address, self.base_url, self.session)
            elif "5.2" in self.version:
                logging.info(f"Version 5.2(5c) detected for device at {self.device.ip_address}")
                version_instance = Version5(self.device.ip_address, self.base_url, self.session)
            else:
                logging.error(f"Unsupported version {self.version} for device at {self.device.ip_address}")
                return
            power_usage_thread = Thread(target=process_power_usage, args=(version_instance,))
            # req_power_thread = Thread(target=process_req_power, args=(version_instance,))
            data_traffic_thread = Thread(target=process_data_traffic)

            # # Start the threads
            logging.info("Starting threads for power usage, required power, and data traffic processing.")
            power_usage_thread.start()
            # req_power_thread.start()
            data_traffic_thread.start()
            # # Wait for all threads to complete
            power_usage_thread.join()
            # req_power_thread.join()
            data_traffic_thread.join()
            logging.info("All threads have completed processing.")

        except Exception as e:
            logging.error(f"Error in main process: {e}")

    def get_ip(self, node):
        logging.info("Entering get_ip method.")
        try:
            with self.db_connection.session_scope() as session:
                # Log the node value being processed
                logging.info(f"Fetching IP for node: {node}")

                # Query the database for the device IP address
                devices = session.query(Device.ip_address).filter(Device.node_id == node).one()
                if devices:
                    logging.info(f"IP address found for node {node}: {devices.ip_address}")

                    return devices.ip_address
                else:
                    logging.warning(f"No IP address found for node {node}")
                    return None
        except Exception as e:
            logging.error(f"Error occurred while fetching IP for node {node}: {e}")
            raise

    def aggregate_DataTraffic(self, *data_sets: Dict) -> Dict[str, Dict[str, Any]]:
        """Aggregate multiple traffic data sets"""
        aggregated = {}

        for data in data_sets:

            for dn, metrics in data.items():

                node_value = metrics['node_value']  # Changed from node_id to node_value
                apic_ipaddress = metrics['apic_ipaddress']  # Get IP address from metrics

                if node_value not in aggregated:
                    aggregated[node_value] = {
                        'node_value': node_value,
                        'apic_ipaddress': apic_ipaddress,  # Use the IP from metrics
                        'bytesLast': 0,
                        'bytesRateLast': 0,
                        'pktsLast': 0,
                        'pktsRateLast': 0,
                    }

                # Sum all metrics
                aggregated[node_value]['bytesLast'] += float(metrics['bytesLast'])
                aggregated[node_value]['bytesRateLast'] += float(metrics['bytesRateLast'])
                aggregated[node_value]['pktsLast'] += float(metrics['pktsLast'])
                aggregated[node_value]['pktsRateLast'] += float(metrics['pktsRateLast'])

        return aggregated
    def aggregate_RequiredPower(self, requiredPower_data):
        """
            Aggregates required power data for each node.

            This function groups power usage data by 'node_value', calculates unique power values,
            and determines the total power required per node.
            """
        aggregated_reqPow_values = {}
        node_data = defaultdict(list)


        # Group data by node_value
        for dn, psu_info in requiredPower_data.items():
            node_data[psu_info['node_value']].append(psu_info)
        # Process each node

        for node, entries in node_data.items():
            apic_ipaddress = entries[0]['apic_ipaddress']


            # Initialize the dictionary for each node
            if node not in aggregated_reqPow_values:
                aggregated_reqPow_values[node] = {
                    'ip': apic_ipaddress,
                    'total_power': 0,
                    'unique_powers': set()
                }

            for psu_info in entries:
                # Add power data to a set to check for uniqueness
                aggregated_reqPow_values[node]['unique_powers'].add(int(psu_info['powerdata']))

            # Calculate total power based on the uniqueness of power values
            if len(aggregated_reqPow_values[node]['unique_powers']) == 1:
                # If all power values are the same, use one of them multiplied by the count of PSUs
                aggregated_reqPow_values[node]['total_power'] = next(
                    iter(aggregated_reqPow_values[node]['unique_powers']))
            else:
                # Sum all unique power values if they differ
                aggregated_reqPow_values[node]['total_power'] = sum(aggregated_reqPow_values[node]['unique_powers'])

            # Log the aggregated data
            logging.info(
                f"Processed node {node}: IP = {apic_ipaddress}, Total Power = {aggregated_reqPow_values[node]['total_power']}")

        return aggregated_reqPow_values

    def aggregate_Powerdata(self, psu_data):

        aggregated_pin_values = {}
        node_data = defaultdict(list)

        # Group data by node_value
        for path, info in psu_data.items():
            node_data[info['node_value']].append(info)

        # Process each node
        for node, entries in node_data.items():

            # Sum pIn and pOut for all entries of this node
            total_pIn = sum(entry['pIn'] for entry in entries)
            total_pOut = sum(entry['pOut'] for entry in entries)
            apic_ipaddress = entries[0]['apic_ipaddress']
            # Update the aggregated values dictionary
            aggregated_pin_values[node] = {

                'ip': apic_ipaddress,
                'total_pIn': int(total_pIn),
                'total_pOut': total_pOut
            }

            # Log the aggregated data
            logging.info(f"Processed node {node}: IP = {apic_ipaddress}, Total pIn = {total_pIn}, Total pOut = {total_pOut}")

        return aggregated_pin_values


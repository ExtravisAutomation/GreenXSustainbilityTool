import logging
from threading import Thread
from collector.ssh.show_interface_ssh import SSHCmd
import  re

from collector.DataStore import DataStorage
from collector.ssh.ssh_commands2 import sshCommand  # Assuming sshCommand class implementation

import  os
# Setup logging
logger = logging.getLogger(__name__)

class ios_DataTraffic:
    def __init__(self, device, device_inventory, password_group,session):
        self.device = device
        self.inventory = device_inventory
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = session
        self.rack_id = device.rack_id
        self.site_id = device.site_id
        self.message = ''
        self.error_message=''
        self.baseurl = '/home/dev/DCS-Project/Collectors/textfsm/'
        self.ip_list=[]

    def log_error(self, message):
        logging.error(message)


    def handle_traffic_data(self):
        if self.password_group_type.lower() == "ssh":
            ssh = SSHCmd(self.device, self.password_group)
            ssh.get_commands(["show interfaces"])
            template_paths = [
                os.path.join(self.baseurl, "show_interfaces_summary.textfsm"),

            ]
            self.error_message,data_traffic = ssh.get_traffic(template_paths)
            print(self.error_message, "Issue")
            print(data_traffic,"")
            data = self.extract_data_traffic(data_traffic)
            print(data)
            logging.info(f"Traffic data received: {data}")
            datastore = DataStorage()
            datastore.store_DataTraffic(data)

    def log_error(self, message):
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting main process for device at {self.device.ip_address}")
            threads = []

            thread2 = Thread(target=self.handle_traffic_data)

            threads.append(thread2)
            for thread in threads:
                thread.start()


            for thread in threads:
                thread.join()
            try:
                self.inventory.error_message = self.error_message
                self.session.commit()
                logging.info(f"Saved error message to DB for {self.device.ip_address}")
            except Exception as e:
                self.log_error(f"Failed to save error message for {self.device.ip_address}: {str(e)}")

        except Exception as e:
            self.log_error(f"Error in fetching data for device {self.device.ip_address}: {str(e)}")
            raise
        finally:
            logging.info("Process Completed.")



    def extract_data_traffic(self, data):
        if not data:
            return {}
        node = 1
        aggregated_data_traffic_values = {}
        # Directly accessing the values from the dictionary
        total_input_data = data.get("total_rxbs", 0)
        total_output_data = data.get("total_txbs", 0)
        total_input_packets = data.get("total_rxps", 0)
        total_output_packets = data.get("total_txps", 0)


        aggregated_data_traffic_values[node] = {
            'ip': self.device.ip_address,
            'bytesLast': 0,
            'total_input_bytes':total_input_data,
            'total_output_bytes':total_output_data,
            'bytesRateLast': total_input_data + total_output_data,
            'pktsLast': 0,
            'pktsRateLast': total_input_packets + total_output_packets,

        }
        return aggregated_data_traffic_values
    def get_node_info(self,tokenized_interface,tokenized_snmp_interface):
        interface_data = []

        total_input_packets = 0
        total_output_packets = 0
        total_input_data = 0
        total_output_data = 0
        total_bandwidth=0

        for interface_token in tokenized_interface:
            name = interface_token["INTERFACE"]
            if not self._is_physical_interface(name):
                logging.debug(f"Interface {name} is virtual. Skipping.")
                continue
            if "up" not in interface_token["LINK_STATUS"]:
                logging.debug(f"Interface {name} is down. Skipping")
                continue

            interface = {
                "name": name,
                "if-index": self._match_ifindex(name, tokenized_snmp_interface),
                "interface-type": interface_token["HARDWARE_TYPE"],
                "bandwidth": self._extract_bandwidth(interface_token["BANDWIDTH"]),
                "speed": self._extract_speed(interface_token["SPEED"]),
                "data_rates": self._extract_data_rates(interface_token)
            }

            # Accumulate total values
            total_input_packets += interface["data_rates"]["input_packet_rate"]
            total_output_packets += interface["data_rates"]["output_packet_rate"]
            total_input_data += interface["data_rates"]["input_data_rate"]
            total_output_data += interface["data_rates"]["output_data_rate"]
            total_bandwidth +=interface["bandwidth"]
            interface_data.append(interface)

        aggregated_data = {
            "total_input_packets": total_input_packets,
            "total_output_packets": total_output_packets,
            "total_input_data": total_input_data,
            "total_output_data": total_output_data,
            "total_bandwidth":total_bandwidth
        }

        logging.info(f"Collected interface data: {interface_data}")
        logging.info(f"Aggregated data traffic values: {aggregated_data}")
        return aggregated_data

    def _is_physical_interface(self, name):
        # This regex matches 'ethernet', 'gige', 'mgmteth', as well as 'fc' followed by digits and possibly slashes.
        return re.search(r'ethernet\s?[\d\/]+|gige\s?[\d\/]+|mgmteth|fc\s?[\d\/]+', name.lower()) is not None

    def _match_ifindex(self, ifname, tokenized):
        # Remove 'Ethernet' or 'eth' and 'FC' or 'fc' for uniformity in comparison
        modified_name = re.sub(r'(ethernet|eth|fc)', '', ifname.lower()).strip()

        for entry in tokenized:
            # Assuming entry['PORT'] is also normalized in a similar fashion before being tokenized
            entry_port_modified = re.sub(r'(ethernet|eth|fc)', '', entry['PORT'].lower()).strip()
            if modified_name == entry_port_modified:
                return entry['IFINDEX_HEX']
    def _extract_bandwidth(self, bandwidth_str):
        match = re.search(r"\d+", bandwidth_str)
        return int(match.group(0)) if match else 0

    def _extract_speed(self, speed_str):
        match = re.search(r"\d+", speed_str)
        if match:
            speed = int(match.group(0))
            if "kb" in speed_str.lower():
                return speed
            elif "mb" in speed_str.lower():
                return speed * 1000
            elif "gb" in speed_str.lower():
                return speed * 1000000
        return 0  # Default if no match or unrecognized units

    def kbps_to_bytes_per_second(self, kbps):
        return (kbps * 1000) // 8
    def _extract_data_rates(self, data):
        bps_to_kbps = 0.001
        def safe_int(value):
            try:
                return int(value)
            except ValueError:
                return 0
        def safe_float(value):
            try:
                return float(value)
            except ValueError:
                return 0
        input_kbps = int(safe_float(data.get("INPUT_RATE", 0)) * bps_to_kbps)
        output_kbps = int(safe_float(data.get("OUTPUT_RATE", 0)) * bps_to_kbps)

        return {
            "input_packet_rate": safe_int(data.get("INPUT_PACKETS", 0)),
            "input_data_rate": self.kbps_to_bytes_per_second(input_kbps),  # Converted to bytes per second
            "output_packet_rate": safe_int(data.get("OUTPUT_PACKETS", 0)),
            "output_data_rate": self.kbps_to_bytes_per_second(output_kbps)  # Converted to bytes per second
        }
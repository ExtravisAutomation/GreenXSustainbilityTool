import traceback
from netmiko import Netmiko
from datetime import datetime
import re, sys, time
import textfsm
import logging

class SSHCmd:

    def __init__(self, devicedata, passwordgroup):
        self.hostname = devicedata.ip_address
        self.username = passwordgroup.username
        self.password = passwordgroup.password
        self.device_type = devicedata.device_type
        self.commands = []
        self.device = None
        self.success_log = "commands.txt"
        self.templatelog = "template.txt"
        self.error_message = ''



    def connect(self):
        try:
            self.device = Netmiko(host=self.hostname, username=self.username, password=self.password,
                                  device_type=self.device_type, timeout=600, global_delay_factor=2)

            logging.info(f"Successfully connected to {self.hostname}")
            self.error_message = f"Successfully connected to {self.hostname}"
        except Exception as e:
            logging.error(f"Failed to connect to {self.hostname}: {str(e)}")
            self.error_message = f'Failed to connect to {self.hostname}'
            self.device = None

    def disconnect(self):
        if self.device:
            self.device.disconnect()
            logging.info(f"Disconnected from {self.hostname}")

    def get_commands(self, commands):
        logging.info("Adding commands: {}".format(commands))
        print(commands)
        self.commands.extend(commands)  # Append commands to the existing list
        print(self.commands)
    def execute_command(self, command):
        try:
            if self.device:
                logging.info(f"Executing command {command}")
                return self.device.send_command(command)
            else:
                logging.warning(f"No active connection for command execution: {command}")
                return ""
        except Exception as e:
            self.error_message=f"Error executing command {command}: {str(e)}"
            logging.error(f"Error executing command {command}: {str(e)}")
            return ""

    def parse_output(self, template_path, output):
        try:

            with open(template_path) as template_file:
                fsm = textfsm.TextFSM(template_file)
                parsed_output = fsm.ParseText(output)
                return [dict(zip(fsm.header, row)) for row in parsed_output]
        except Exception as e:
            self.error_message=f"Failed to parse output from {template_path}: {str(e)}"
            logging.error(f"Failed to parse output from {template_path}: {str(e)}")
            return []

    def execute_and_parse_commands(self, template_paths):
        parsed_results = []
        try:
            if not self.commands:
                logging.warning("No commands to execute.")
                self.error_message = "No commands to execute."
                return parsed_results

            if len(template_paths) != len(self.commands):
                self.error_message = "Number of commands does not match number of templates."
                logging.error("Number of commands does not match number of templates.")
                return parsed_results

            for command, template_path in zip(self.commands, template_paths):
                output = self.execute_command(command)
                print(output)
                # logging.info(output)
                # if output is None:

                parsed_output = self.parse_output(template_path, output)
                parsed_results.append({command: parsed_output})

            return parsed_results

        except Exception as e:
            logging.error(f"Error executing and parsing commands: {str(e)}")
            return []

        except Exception as e:
            logging.error(f"Error executing and parsing commands: {str(e)}")
            return []

    def get_traffic(self, template_paths):
        try:
            self.connect()
            if not self.device:
                msg = f"Failed to establish connection."
                logging.error(msg)
                self.error_message = msg
                return  msg ,{} # <- return two values

            parsed_results = self.execute_and_parse_commands(template_paths)
            interface_data = parsed_results[0].get(self.commands[0], [])

            numeric_fields = [ "RXBS", "RXPS", "TXBS", "TXPS"]

            interfaces_info = []
            total_rxbs = 0
            total_txbs = 0
            total_rxps = 0
            total_txps = 0
            for intf in interface_data:
                all_zero = all(int(intf[field]) == 0 for field in numeric_fields)
                status = "Down" if all_zero else "Up"

                rxbs = int(intf["RXBS"])
                txbs = int(intf["TXBS"])
                rxps=int(intf["RXPS"])
                txps =int(intf["TXPS"])
                total_rxbs += rxbs
                total_txbs += txbs
                total_rxps += rxps
                total_txps += txps

                interfaces_info.append({
                    "name": intf["INTERFACE"],
                    "status": status,
                    "rxbs": rxbs,
                    "txbs": txbs,
                    "rxps":rxps,
                    "txps":txps,
                    "ipaddress": self.hostname
                })

            return self.error_message,{
                "total_rxbs": total_rxbs,
                "total_txbs": total_txbs,
                "total_rxps":total_rxps,
                "total_txps":total_txps,
                "interfaces": interfaces_info
            }

        finally:
            self.disconnect()

    # def get_node_info(self, tokenized_interface, tokenized_snmp_interface):
    #     interface_data = []
    #
    #     total_input_packets = 0
    #     total_output_packets = 0
    #     total_input_data = 0
    #     total_output_data = 0
    #     total_bandwidth = 0
    #
    #     for interface_token in tokenized_interface:
    #         name = interface_token["INTERFACE"]
    #         if not self._is_physical_interface(name):
    #             logging.debug(f"Interface {name} is virtual. Skipping.")
    #             continue
    #         if "up" not in interface_token["LINK_STATUS"]:
    #             logging.debug(f"Interface {name} is down. Skipping")
    #             continue
    #
    #         interface = {
    #             "name": name,
    #             "if-index": self._match_ifindex(name, tokenized_snmp_interface),
    #             "interface-type": interface_token["HARDWARE_TYPE"],
    #             "bandwidth": self._extract_bandwidth(interface_token["BANDWIDTH"]),
    #             "speed": self._extract_speed(interface_token["SPEED"]),
    #             "data_rates": self._extract_data_rates(interface_token)
    #         }
    #
    #         # Accumulate total values
    #         total_input_packets += interface["data_rates"]["input_packet_rate"]
    #         total_output_packets += interface["data_rates"]["output_packet_rate"]
    #         total_input_data += interface["data_rates"]["input_data_rate"]
    #         total_output_data += interface["data_rates"]["output_data_rate"]
    #         total_bandwidth += interface["bandwidth"]
    #         interface_data.append(interface)
    #
    #     aggregated_data = {
    #         "total_input_packets": total_input_packets,
    #         "total_output_packets": total_output_packets,
    #         "total_input_data": total_input_data,
    #         "total_output_data": total_output_data,
    #         "total_bandwidth": total_bandwidth
    #     }
    #
    #     logging.info(f"Collected interface data: {interface_data}")
    #     logging.info(f"Aggregated data traffic values: {aggregated_data}")
    #     return aggregated_data
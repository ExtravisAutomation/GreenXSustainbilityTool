import json
import traceback
from netmiko import Netmiko
from datetime import datetime
import re, sys, time
import textfsm
import logging

from pyexpat.errors import messages


class sshCommand:
    def __init__(self, devicedata, passwordgroup):
        self.hostname = devicedata.ip_address
        self.username = passwordgroup.username
        self.password = passwordgroup.password
        self.device_type = devicedata.device_type
        self.commands = []  # Initialize an empty list for commands
        self.error_message=''
        self.success_log = f"success_log2.txt"
    def get_commands(self, commands):
        logging.info("Adding commands: {}".format(commands))
        self.commands.extend(commands)  # Append commands to the existing list

    def connect(self):
        try:
            self.device = Netmiko(host=self.hostname, username=self.username, password=self.password,
                                  device_type=self.device_type, timeout=900, global_delay_factor=2)

            logging.info(f"Successfully connected to {self.hostname}")
            self.error_message=f"Successfully connected to {self.hostname}"
        except Exception as e:
            logging.error(f"Failed to connect to {self.hostname}: {str(e)}")
            self.error_message=f'Failed to connect to {self.hostname}'
            self.device = None

    def disconnect(self):
        if self.device:
            self.device.disconnect()
            logging.info(f"Disconnected from {self.hostname}")

    def execute_command(self, command):
        try:
            if self.device:
                logging.info(f"Executing command {command}")
                return self.device.send_command(command)
            else:
                logging.warning(f"No active connection for command execution: {command}")
                return ""
        except Exception as e:
            logging.error(f"Error executing command {command}: {str(e)}")
            self.error_message=f"Error executing command {command}: {str(e)}"
            return ""

    def parse_output(self, template_path, output):
        try:

            with open(template_path) as template_file:
                fsm = textfsm.TextFSM(template_file)
                parsed_output = fsm.ParseText(output)
                return [dict(zip(fsm.header, row)) for row in parsed_output]
        except Exception as e:
            self.error_message =f"Failed to parse output from {template_path}: {str(e)}"
            logging.error(f"Failed to parse output from {template_path}: {str(e)}")
            return []
    def extract_power_info_t_V1(self,parsed_output):
        total_power_input = self.extract_float(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))

        # Extracting the numeric values from the strings and converting to float
        self.extract_float(parsed_output[0].get("PowerReserved", "0 W"))
        power_reserved = self.extract_float(parsed_output[0].get("PowerReserved", "0 W"))
        power_used_by_modules = self.extract_float(parsed_output[0].get("PowerUsedByModules", "0 W"))

        total_power_ouput = power_reserved + power_used_by_modules

        return total_power_input, total_power_ouput

    def extract_float(self,value):
        return float(value.split()[0])
    def extract_power_info_t_V2(self,parsed_output):

        # Extracting the values
        total_power_input = self.extract_float(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))
        total_power_output = self.extract_float(parsed_output[0].get("TOTAL_POWER_OUTPUT", "0 W"))

        return total_power_input, total_power_output

    def execute_commands(self):
        parsed_results = []
        if not self.commands:
            logging.warning("No commands to execute.")
            return parsed_results

        for command in self.commands:
            output = self.execute_command(command)
            print(output)
            logging.info(f"Command executed: {command}")
            logging.info(f"Command executed: {output}")
            # parsed_output = self.parse_output('your_template_path', output)  # Provide the correct path
            # parsed_results.extend(parsed_output)

        return output
    def execute_commandss(self):
        parsed_results = []
        if not self.commands:
            logging.warning("No commands to execute.")
            return parsed_results

        for command in self.commands:
            output = self.execute_command(command)
            if not output:
                print(f"Command failed: {command}")  # Or use logging
                continue
            print(output)
            logging.info(f"Command executed: {command}")
            return output
        print("All commands failed!")
        return None


            # parsed_output = self.parse_output('your_template_path', output)  # Provide the correct path
            # parsed_results.extend(parsed_output)



    def main(self,template):
        try:
            print(template)

            self.connect()
            if not self.device:

                logging.error(f"Failed to establish connection to {self.hostname}. Exiting.")
                return []

            command_output = self.execute_commands()

            if command_output is None:
                self.ip_list.append(self.hostname)
                with open(self.success_log, 'a') as f:
                    f.write(f"{self.hostname}\n")

            total_power_input, total_power_ouput = 0, 0

            tokenized_power = self.parse_output(template[0], command_output)
            if tokenized_power:  # Check if tokenized_power is not None or not an empty list
                total_power_input, total_power_ouput = self.extract_power_info_t_V2(tokenized_power)

            else:
                if len(template) > 1:
                    tokenized_power = self.parse_output(template[1],
                                                        command_output)

                    if tokenized_power:  # Check if the second template returns a non-empty list
                        total_power_input, total_power_ouput = self.extract_power_info_t_V1(tokenized_power)
            logging.info(f"Parsed results: {tokenized_power}")
            logging.info(f" {total_power_input}, {total_power_ouput}")

            # print(success_msg)
            return self.error_message, {"total_power_input":total_power_input,"total_power_output": total_power_ouput}
        finally:
            self.disconnect()
    def execute_and_parse_commands(self, template_paths):
        parsed_results = []
        try:
            if not self.commands:
                logging.warning("No commands to execute.")
                self.error_message="No commands to execute."
                return parsed_results

            if len(template_paths) != len(self.commands):
                logging.error("Number of commands does not match number of templates.")
                self.error_message='Number of commands does not match number of templates.'
                return parsed_results

            for command, template_path in zip(self.commands, template_paths):
                output = self.execute_command(command)
                logging.info(output)
                filename = f"{command}.txt"
                with open(filename, "w") as f:
                    f.write(json.dumps(output, indent=2))
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

    def main2(self, template_paths):
        try:
            self.connect()
            if not self.device:
                msg = f"Failed to establish connection."
                logging.error(msg)
                self.error_message = msg
                return {}, msg  # <- return two values

            parsed_results = self.execute_and_parse_commands(template_paths)
            if len(parsed_results) != 2:
                msg = f"Expected results for {len(self.commands)} commands, got {len(parsed_results)}"
                logging.error(msg)
                self.error_message = msg
                return {}, msg  # <- return two values

            interface_data = parsed_results[0].get(self.commands[0], [])
            snmp_data = parsed_results[1].get(self.commands[1], [])

            node_info = self.get_node_info(interface_data, snmp_data)
            return node_info, self.error_message

        finally:
            self.disconnect()

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



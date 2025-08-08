import traceback
from netmiko import Netmiko
from datetime import datetime
import re, sys, time
import textfsm
import logging
import  os
class sshCommand:
    def __init__(self, devicedata, passwordgroup):
        self.hostname = devicedata.ip_address
        self.username = passwordgroup.username
        self.password = passwordgroup.password
        self.device_type = devicedata.device_type
        self.commands = []  # Initialize an empty list for commands
        self.ip_list=[]
        self.error_message = ''
        self.success_log = f"commands.txt"
        self.templatelog=f"template.txt"
        self.message=''
    def get_commands(self, commands):
        logging.info("Adding commands: {}".format(commands))
        print(commands)
        self.commands.extend(commands)  # Append commands to the existing list
        print(self.commands)

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
            self.error_message = f"Error executing command {command}: {str(e)}"
            return ""

    def parse_output(self, template_path, output):
        try:

            with open(template_path) as template_file:
                fsm = textfsm.TextFSM(template_file)
                parsed_output = fsm.ParseText(output)
                return [dict(zip(fsm.header, row)) for row in parsed_output]
        except Exception as e:
            logging.error(f"Failed to parse output from {template_path}: {str(e)}")
            self.error_message = f"Failed to parse output from {template_path}: {str(e)}"
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
        # try:
        #     data=float(value.split()[0])
        # except Exception as e:
        #
        #     print(e)
        try:
            if not value or not value.strip():
                return 0
            data = float(value.split()[0])
        except Exception as e:
            print(f"extract_float error: {e} (value: {value})")
            data = 0
        return data


    def extract_power_info_t_V2(self,parsed_output):
        total_power_input,total_power_output=0,0
        print(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))
        print(parsed_output[0].get("TOTAL_POWER_OUTPUT", "0 W"))
        try:
        # Extracting the values
            total_power_input = self.extract_float(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))
            total_power_output = self.extract_float(parsed_output[0].get("TOTAL_POWER_OUTPUT", "0 W"))
            print(f"here we are {total_power_input} ,{total_power_output}" )
        except:
            print("werror")

        return total_power_input, total_power_output



    def extract_power_used_info(self,parsed_output):
        used_power,ava_power=0,0
        print(parsed_output[0].get("used_power", "0 W"))
        print(parsed_output[0].get("ava_power", "0 W"))
        try:
        # Extracting the values
            used_power = self.extract_float(parsed_output[0].get("used_power", "0 W"))
            ava_power = self.extract_float(parsed_output[0].get("ava_power", "0 W"))
            print(f"here we are {used_power} ,{ava_power}" )
        except:
            print("werror")
        return used_power, ava_power

    def extract_extract_port(self,parsed_output):
        total_power_input,total_power_output=0,0
        print(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))
        print(parsed_output[0].get("TOTAL_POWER_OUTPUT", "0 W"))
        try:
        # Extracting the values
            total_power_input = self.extract_float(parsed_output[0].get("TOTAL_POWER_INPUT", "0 W"))
            total_power_output = self.extract_float(parsed_output[0].get("TOTAL_POWER_OUTPUT", "0 W"))
            print(f"here we are {total_power_input} ,{total_power_output}" )
        except:
            print("werror")

        return total_power_input, total_power_output


    def execute_commands_new(self):
        parsed_results = []
        if not self.commands:

            logging.warning("No commands to execute.")
            return parsed_results
        print(self.commands)
        for command in self.commands:
            logging.info(f"Executing command: {command}")
            print(f'Executing command for {self.hostname} and command is  {command}')

            # Execute the command and print the output
            output = self.execute_command(command)
            print(f"Command Output: {output}")

            # Skip to next command if the output is empty
            error_signatures = [
                "%No inline power card on switch",
                "% Invalid input detected at '^' marker.",
                "% Incomplete command."
            ]

            if not output or any(err in output for err in error_signatures):
                logging.warning(f"Invalid or empty output for command: {command}")
                continue
            logging.info(f"Successfully executed command: {command} for {self.hostname}")
            # self.error_message
            # self.error_message = f"Successfully executed command: {command} for {self.hostname}}"
            return output

            # If the command output is available, proceed with template parsing

            # If no templates succeeded, return None
        logging.error(f"All commands failed or all templates failed to parse.")
        return None



    # def main(self,template):
    #     try:
    #         print(template)
    #         self.connect()
    #         if not self.device:
    #             logging.error(f"Failed to establish connection to {self.hostname}.")
    #             return []
    #
    #         for template_path in template:
    #             print(f"Using template: {template_path}")
    #             tokenized_power = self.parse_output(template_path)
    #             print("got tokenized power",tokenized_power)
    #
    #             # If parsing is successful, return the tokenized data and exit the loop
    #             if tokenized_power:
    #                 print("I am here")
    #                 total_power_input, total_power_output = self.extract_power_info_t_V2(tokenized_power)
    #                 print(f"after tokenization this is total_power_input: {total_power_input} {total_power_output}")
    #                 if total_power_input == 0 and total_power_output == 0:
    #                     print("youu got 0 value")
    #                     continue
    #                 logging.info(f" we got the data {total_power_input}, {total_power_output}")
    #                 # print(success_msg)
    #                 return self.error_message,{"total_power_input": total_power_input, "total_power_output": total_power_output}
    #             else:
    #                 self.error_message=f"Failed to parse with template: {template_path}"
    #                 return self.error_message, {"total_power_input": 0,
    #                                             "total_power_output": 0}
    #
    #                 logging.warning(f"Failed to parse with template: {template_path}")
    #
    #                 continue  # Move to the next template if parsing fails
    #
    #
    #     finally:
    #         self.disconnect()

    def main(self, templates):
        try:
            logging.info(f"Templates to process: {templates}")
            self.connect()
            if not self.device:
                msg = f"Failed to establish connection."
                logging.error(msg)
                self.error_message = msg
                return self.error_message, {"total_power_input": 0, "total_power_output": 0}
            command_output = self.execute_commands_new()
            print(command_output)

            for template_path in templates:
                logging.info(f"Trying template: {template_path}")
                tokenized_power = self.parse_output(template_path,command_output)
                logging.debug(f"Tokenized power data: {tokenized_power}")

                if tokenized_power:
                    total_power_input, total_power_output = self.extract_power_info_t_V2(tokenized_power)
                    logging.info(f"Extracted Power - Input: {total_power_input}, Output: {total_power_output}")

                    if total_power_input == 0 and total_power_output == 0:
                        logging.warning("Parsed values are both 0. Trying next template.")
                        continue

                    return self.error_message, {
                        "total_power_input": total_power_input,
                        "total_power_output": total_power_output
                    }

                logging.warning(f"Failed to parse with template: {template_path}")

            self.error_message = "All templates failed to parse or returned zero values."
            return self.error_message, {"total_power_input": 0, "total_power_output": 0}

        finally:
            self.disconnect()

    def templates_response2(self,template,output):
        try:
            print(template)
            self.connect()
            if not self.device:
                logging.error(f"Failed to establish connection to {self.hostname}. Exiting.")
                return []
            for template_path in template:
                print(f"Using template: {template_path}")
                tokenized_power = self.parse_output(template_path, output)
                print("got tokenized power",tokenized_power)

                # If parsing is successful, return the tokenized data and exit the loop
                if tokenized_power:
                    print("I am here")
                    total_power_input, total_power_output = self.extract_power_info_t_V2(tokenized_power)
                    print(f"after tokenization this is total_power_input: {total_power_input} {total_power_output}")
                    if total_power_input == 0 and total_power_output == 0:
                        print("youu got 0 value")
                        continue

                    logging.info(f" we got the data {total_power_input}, {total_power_output}")
                    # print(success_msg)
                    return {"total_power_input": total_power_input, "total_power_output": total_power_output}
                else:
                    # If parsing with this template failed, log it and try the next template
                    logging.warning(f"Failed to parse with template: {template_path}")
                    try:

                        with open("/home/dev/DCS-Project/Collectors/testing_dir/template.txt", 'a') as f:  # Opens file in append mode
                            f.write(f"  {template_path}\n")  # Writes the failed template and command
                    except IOError as e:
                        print(f"Failed to write to log file: {e}")  # Handles file errors
                    continue  # Move to the next template if parsing fails


        finally:
            self.disconnect()
    def execute_and_parse_commands(self, template_paths):
        parsed_results = []
        try:
            if not self.commands:
                logging.warning("No commands to execute.")
                return parsed_results

            if len(template_paths) != len(self.commands):
                logging.error("Number of commands does not match number of templates.")
                return parsed_results

            for command, template_path in zip(self.commands, template_paths):
                output = self.execute_command(command)
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


    def main2(self, template_paths):
        try:
            self.connect()
            if not self.device:
                logging.error(f"Failed to establish connection to {self.hostname}. Exiting.")
                return []

            parsed_results = self.execute_and_parse_commands(template_paths)
            if len(parsed_results) != 2:
                logging.error("Expected results for two commands.")
                return []

            interface_data = parsed_results[0].get(self.commands[0], [])
            snmp_data = parsed_results[1].get(self.commands[1], [])

            node_info = self.get_node_info(interface_data, snmp_data)
            print(node_info)
            return node_info

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



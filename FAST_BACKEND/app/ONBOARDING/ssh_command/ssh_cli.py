import traceback
from netmiko import Netmiko
from datetime import datetime
import re, sys, time
import textfsm
import logging


class sshCommand:
    def __init__(self, devicedata, passwordgroup):
        self.device_id = devicedata.id
        self.hostname = devicedata.ip_address
        self.username = passwordgroup.username
        self.password = passwordgroup.password
        self.device_type = devicedata.device_type
        self.commands = []  # Initialize an empty list for commands
        self.message = ""

    def getcommands(self, commands):
        print("Get commands", commands)
        self.commands.extend(commands)  # Append commands to the existing list

    def connect(self):
        try:
            self.device = Netmiko(host=self.hostname, username=self.username, password=self.password,
                                  device_type=self.device_type, timeout=600, global_delay_factor=2)
            logging.info(f"Successfully connected to {self.hostname}")
        except Exception as e:
            logging.error(f"Failed to connect to {self.hostname}: {str(e)}")
            self.device = None

    def disconnect(self):
        if self.device:
            self.device.disconnect()
            logging.info(f"Disconnected from {self.hostname}")

    def execute_command(self, command):
        try:
            if self.device:
                return self.device.send_command(command)
            else:
                logging.warning(f"No active connection for command execution: {command}")
                return ""
                self.message = "Command executed successfully"
        except Exception as e:
            self.messages = e
            logging.error(f"Error executing command '{command}': {str(e)}")
            return ""

    def parse_output(self, template_path, output):
        try:
            with open(template_path) as template_file:
                fsm = textfsm.TextFSM(template_file)
                parsed_output = fsm.ParseText(output)
                return [dict(zip(fsm.header, row)) for row in parsed_output]
        except Exception as e:
            logging.error(f"Failed to parse output from {template_path}: {str(e)}")
            return []

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
                print(output)

                parsed_output = self.parse_output(template_path, output)
                parsed_results.append({command: parsed_output})

            return parsed_results

        except Exception as e:
            self.message = "Error executing and parsing commands:"

            logging.error(f"Error executing and parsing commands: {str(e)}")
            return []

        except Exception as e:
            print(f"Error executing and parsing commands: {e}", file=sys.stderr)
            return []

    def get_node_info(self, version_data, inventory_data):
        try:
            version_info = version_data[0] if version_data else {}
            inventory_info = inventory_data[0] if inventory_data else {}
            node = 1
            inventory = {}
            node_info = {
                "id": self.device_id,
                "address": self.hostname,
                "serial": inventory_info.get("SN", ""),
                "model": inventory_info.get("PID", ""),
                "name": version_info.get("HOSTNAME", ""),
                "vendor": "Cisco",
                "version": version_info.get("OS", ""),
                "lastStateModTs": version_info.get("LAST_REBOOT_REASON", ""),
                "status": "Active",
                "role": "",
                "message": self.message
            }
            inventory[node] = node_info
            print(inventory)

            logging.info(f"Collected node information: {node_info}")
            return inventory
        except Exception as e:
            logging.error(f"Error while creating node information: {str(e)}")

            return {}

    def main(self, template_paths):
        try:
            self.connect()
            if not self.device:
                logging.error(f"Failed to establish connection to {self.hostname}. Exiting.")
                return []

            parsed_results = self.execute_and_parse_commands(template_paths)
            if len(parsed_results) != 2:
                logging.error("Expected results for two commands.")
                return []

            version_data = parsed_results[0].get(self.commands[0], [])
            inventory_data = parsed_results[1].get(self.commands[1], [])

            node_info = self.get_node_info(version_data, inventory_data)
            return node_info

        finally:
            self.disconnect()
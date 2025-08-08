from netmiko import ConnectHandler
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from collector.Models.model import DeviceInventory
import re
from collections import Counter


class DevicePowerStackUpdater:
    def __init__(self, device, device_inventory: DeviceInventory, password_group, session: Session, ssh_timeout: int = 10):
        self.device = device
        self.device_inventory = device_inventory
        self.password_group = password_group
        self.session = session
        self.ssh_timeout = ssh_timeout
        self.connection = None

    def connect(self) -> None:
        """Establish SSH connection using Netmiko."""
        device_params = {
            "device_type": "cisco_ios",  # adjust device_type as needed
            "host": self.device.ip_address,
            "username": self.password_group.username,
            "password": self.password_group.password,
            "timeout": self.ssh_timeout,
        }
        self.connection = ConnectHandler(**device_params)

    def disconnect(self) -> None:
        """Close SSH connection."""
        if self.connection:
            self.connection.disconnect()
            self.connection = None

    def run_command(self, command: str) -> str:
        """Run command via Netmiko and return output."""
        if not self.connection:
            raise RuntimeError("SSH session not active")
        return self.connection.send_command(command)

    @staticmethod
    def parse_stack_count(output: str) -> bool:
        switch_numbers = re.findall(r"^\*?(\d+)", output, re.MULTILINE)
        unique_switches = set(switch_numbers)
        return len(unique_switches) > 1  # True if stacked

    @staticmethod
    def parse_power_info(output: str) -> Optional[Dict[str, Any]]:
        pattern = re.compile(r"^\s*\S+\s+(PWR-[^\s]+)\s+", re.MULTILINE)
        models = pattern.findall(output.strip())

        if not models:
            return None

        num_supplies = len(models)
        unique_models = set(models)

        if len(unique_models) == 1:
            model = unique_models.pop()
            numbers = re.findall(r"\d+", model)
            power_rating = int(max(numbers, key=len)) if numbers else 0
            total_capacity = power_rating * num_supplies
            return {
                "psu_count": num_supplies,
                "psu_model": model,
                "total_capacity": total_capacity,
            }
        else:
            model_counts = Counter(models)
            total_capacity = 0
            for model, count in model_counts.items():
                numbers = re.findall(r"\d+", model)
                power_rating = int(max(numbers, key=len)) if numbers else 0
                total_capacity += power_rating * count

            return {
                "psu_count": num_supplies,
                "psu_model": ','.join(unique_models),
                "total_capacity": total_capacity,
            }

    def update_device_inventory(self) -> bool:
        try:
            self.connect()


            switch_output = self.run_command("show switch")
            print(switch_output)
            stack = self.parse_stack_count(switch_output)
            print("stacked value", stack)

            power_output = self.run_command("show env power")
            print(power_output)
            power_info = self.parse_power_info(power_output)

            updated = False
            if power_info and power_info["psu_count"] > 0:
                self.device_inventory.psu_model = power_info["psu_model"]
                self.device_inventory.psu_count = power_info["psu_count"]
                self.device_inventory.total_power_capacity = power_info["total_capacity"] or ""
                updated = True
            else:
                print(f"No valid PSU info found for {self.device.ip_address}")

            if stack:
                self.device_inventory.stack_count = 2  # or True? Depends on DB field type
                updated = True
            else:
                self.device_inventory.stack_count = 1
                updated = True

            if updated:
                self.session.commit()
                print(f"Updated {self.device.ip_address} with power info and stack count.")
                return True
            else:
                print(f"No updates performed for {self.device.ip_address}.")
                return False
                self.device_inventory.error_message = " No issue"
                self.session.commit()

        except Exception as e:
            max_length = 255  # adjust based on your DB schema
            error_msg = str(e)
            if len(error_msg) > max_length:
                error_msg = error_msg[:max_length] + "..."
            self.device_inventory.error_message = error_msg
            self.session.commit()

            print(f"Error for {self.device.ip_address}: {e}")
            return False

        finally:
            self.disconnect()

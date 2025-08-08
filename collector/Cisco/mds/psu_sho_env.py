import re
import paramiko
from sqlalchemy.orm import Session
from collector.Models.model import DeviceInventory

def get_power_info_mds(output: str):
    # Match power supply lines like: 1 DS-CAC97-3KW 207 W 3000 W Ok
    psu_pattern = re.compile(r'^\s*\d+\s+(DS-[\w\-]+)\s+\d+\s+W\s+(\d+)\s+W\s+Ok', re.MULTILINE)
    psus = psu_pattern.findall(output)

    psu_count = len(psus)
    total_capacity = sum(int(cap) for _, cap in psus)
    psu_model = psus[0][0] if psus else None

    # Extract redundancy mode
    redun_match = re.search(r'redundancy mode \(operational\)\s+([A-Za-z\-]+)', output)
    redundancy_mode = redun_match.group(1) if redun_match else "Unknown"

    # Extract total input power if available
    input_power_match = re.search(r'Total Power of all Inputs \(cumulative\)\s+(\d+)\s+W', output)
    total_input_power = int(input_power_match.group(1)) if input_power_match else 0

    return {
        "psu_model": psu_model,
        "psu_count": psu_count,
        "total_capacity": total_capacity,
        "redundancy_mode": redundancy_mode,
        "total_input_power": total_input_power
    }

def ssh_and_update_power_mds(device, device_inventory, password_group, session: Session):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(
            hostname=device.ip_address,
            username=password_group.username,
            password=password_group.password,
            timeout=10
        )
        stdin, stdout, stderr = ssh.exec_command("show environment power")
        output = stdout.read().decode()
        ssh.close()

        power_info = get_power_info_mds(output)

        if power_info["psu_count"] > 0:
            device_inventory.psu_model = power_info["psu_model"]
            device_inventory.psu_count = power_info["psu_count"]
            device_inventory.total_power_capacity = power_info["total_capacity"]
            session.commit()
            print(f"[OK] {device.ip_address} updated: {power_info}")
        else:
            print(f"[WARN] No PSU info found for {device.ip_address}")

    except Exception as e:
        print(f"[ERROR] {device.ip_address} - SSH/parse failed: {e}")

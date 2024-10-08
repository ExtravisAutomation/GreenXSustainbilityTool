from netmiko import ConnectHandler, NetMikoTimeoutException, NetMikoAuthenticationException


def get_devices(device,session,passwordgroup):
    devices = {
        'device_type': 'cisco_ios',  # Adjust based on your device (cisco_ios works for most)
        'host': device.ip_address,  # Replace with the device IP address
        'username': passwordgroup.username,  # Replace with your device username
        'password': passwordgroup.password,  # Replace with your device password
    }

    print(devices)
    try:
        # Connect to the device
        net_connect = ConnectHandler(**devices)

        # Enter enable mode if needed
        net_connect.enable()

        # Run 'show version' to get system information
        output = net_connect.send_command("show version")

        # Print the output (optional)
        print("Command Output:\n", output)

        # Determine and print the device's operating system
        device_os = get_device_os_version(output)
        print(f"Detected Cisco OS: {device_os}")

        # Close the connection
        net_connect.disconnect()
        return device_os
    except NetMikoTimeoutException:
        device.messages = "Connection timed out. Please check the device IP address."

    except NetMikoAuthenticationException:
        device.messages = "Authentication failed. Please check the username and password."

    except Exception as e:
        device.messages = f"An unexpected error occurred: {str(e)}"

    finally:
        # Commit the message to the database once, at the end
        session.commit()
        print(device.messages)

def get_device_os_version(output):
    if "IOS XR" in output:
        return "cisco_xr"
    elif "NX-OS" in output or "Nexus" in output:
        return "cisco_nxos"
    elif "IOS XE" in output:
        return "cisco_xe"
    elif "IOS" in output:
        return "cisco_ios"
    else:
        return "Unknown OS"




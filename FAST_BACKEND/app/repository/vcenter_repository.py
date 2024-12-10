from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session
from app.repository.base_repository import BaseRepository
from app.model.vcenter import HostStorageAdapters, HostPhysicalNetworkAdapters, HostDatastores, HostNetworking, HostAdapters, HostCPUModel, HostDetails, VCenterVMs, VMHardDisk, VMNetworkAdapters, VMOtherHardware, VMUSBController
from app.repository.InfluxQuery import get_all_vm, get_24_vm_stoage, get_24_vm_usage
from app.schema.vcenter_schema import hostnameInput


class VcenterRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        # super().__init__(session_factory, Reports)
        
        
    def get_host_details(self):
        with self.session_factory() as session:
            host_details_list = []
            hosts = session.query(HostDetails).filter().all()

            for host in hosts:
                storage_adapters = [
                    {"model": adapter.model, "driver": adapter.driver, "storage_key": adapter.storage_key}
                    for adapter in
                    session.query(HostStorageAdapters).filter(HostStorageAdapters.vcenter_id == host.vcenter_id).all()
                ]
                physical_network_adapters = [
                    {"device": adapter.device, "mac": adapter.mac, "driver": adapter.driver}
                    for adapter in session.query(HostPhysicalNetworkAdapters).filter(
                        HostPhysicalNetworkAdapters.vcenter_id == host.vcenter_id).all()
                ]
                datastores = [
                    {"name": datastore.name, "capacity": datastore.capacity, "free_space": datastore.free_space,
                    "type": datastore.type}
                    for datastore in session.query(HostDatastores).filter(HostDatastores.vcenter_id == host.vcenter_id).all()
                ]
                networkings = [
                    {"name": network.name}
                    for network in session.query(HostNetworking).filter(HostNetworking.vcenter_id == host.vcenter_id).all()
                ]
                adapters = [
                    {"adapter_id": adapter.adapter_id, "device_name": adapter.device_name}
                    for adapter in session.query(HostAdapters).filter(HostAdapters.vcenter_id == host.vcenter_id).all()
                ]
                cpu_models = [
                    {"name": cpu_model.name}
                    for cpu_model in session.query(HostCPUModel).filter(HostCPUModel.vcenter_id == host.vcenter_id).all()
                ]

                host_details = {
                    "host_name": host.host_name,
                    "name": host.name,
                    "ip_address": host.ip_address,
                    "dns_servers": host.dns_servers,
                    "default_gateway": host.default_gateway,
                    "ipv6_enabled": host.ipv6_enabled,
                    "version": host.version,
                    "state": host.state,
                    "manufacturer": host.manufacturer,
                    "model": host.model,
                    "total_cpu_mhz": round(host.total_cpu_mhz,2) if host.total_cpu_mhz is not None else 0,
                    "total_memory_gb": round(host.total_memory_gb,2) if host.total_memory_gb is not None else 0,
                    "virtual_flash": host.virtual_flash,
                    "storage_adapters": storage_adapters,
                    "physical_network_adapters": physical_network_adapters,
                    "datastores": datastores,
                    "networkings": networkings,
                    "adapters": adapters,
                    "cpu_models": cpu_models  # Include CPU models in the details
                }
                
                host_details_list.append(host_details)

            return host_details_list
        
        
    def get_all_vms(self):
        with self.session_factory() as session:
            VCenterVM = session.query(VCenterVMs).all()
            for vm in VCenterVM:
                data = get_all_vm(vm.hostname)

                if data:
                    used_cpu = data[0].get("used_cpu_MHz")
                    used_memory = data[0].get("used_memory_MB")
                    used_space = data[0].get("used_space_GB")
                    cpu_usage_percent = data[0].get("cpu_usage_percent")
                    memory_usage_percent=data[0].get("memory_usage_percent")

                    # Ensure the variables are not None and are numbers before rounding
                    vm.used_space_GB = round(float(used_space), 2) if used_space is not None else 0
                    vm.used_cpu_MHz = round(float(used_cpu), 2) if used_cpu is not None else 0
                    vm.used_memory_MB = round(float(used_memory), 2) if used_memory is not None else 0
                    vm.cpu_usage_percent = round(float(cpu_usage_percent), 2) if cpu_usage_percent is not None else 0
                    vm.memory_usage_percent = round(float(memory_usage_percent), 2) if memory_usage_percent is not None else 0
            return VCenterVM
        
        
    def get_hourly_storage(self, hostname_data: hostnameInput):
        hourly_data = get_24_vm_stoage(hostname_data.hostname)  # Assuming get_power_data_per_hour is an async function

        response = []
        for data in hourly_data:

            response.append({
                'hostname': hostname_data.hostname,
                'hour': data['hour'],
                "used_space_GB": data['Used_space_GB'],
            })
            
        return response
    
    
    def get_usages(self, hostname_data: hostnameInput):
        hourly_data = get_24_vm_usage(hostname_data.hostname)  # Assuming get_power_data_per_hour is an async function

        response = []
        for data in hourly_data:

            response.append({
                'hostname': hostname_data.hostname,
                'hour': data['hour'],
                "mem_usage_gb": data['mem_usage_gb'],
                "cpu_usage_percent": data['cpu_usage_percent'],
                "cpu_ready_percent":data['cpu_ready_percent'],
            })
            
        return response
    
    
    def get_vms_details(self, hostname_data: hostnameInput):
        with self.session_factory() as session:
            
            Hostname = hostname_data.hostname
            
            vm_details_list = []
            vms = session.query(VCenterVMs).filter(VCenterVMs.hostname==Hostname).all()
            for vm in vms:
                hard_disks = [
                    {"name": hd.name, "size_MB": hd.size_MB}
                    for hd in session.query(VMHardDisk).filter(VMHardDisk.vcenter_id == vm.vcenter_id).all()
                ]
                other_hardware = [
                    {"hardware_name": hw.hardware_name}
                    for hw in session.query(VMOtherHardware).filter(VMOtherHardware.vcenter_id == vm.vcenter_id).all()
                ]
                usb_controllers = [
                    {"name": usb.name}
                    for usb in session.query(VMUSBController).filter(VMUSBController.vcenter_id == vm.vcenter_id).all()
                ]
                network_adapters = [
                    {"name": na.name, "network": na.network}
                    for na in session.query(VMNetworkAdapters).filter(VMNetworkAdapters.vcenter_id == vm.vcenter_id).all()
                ]

                vm_details = {
                    "name": vm.name,
                    "status": vm.status,
                    "guest_os": vm.guest_os,
                    "hostname": vm.hostname,
                    "ip_address": vm.ip_address,
                    "num_cpus": vm.num_cpus,
                    "processor_type": vm.processor_type,
                    "num_disks": vm.num_disks,
                    "compatibility": vm.compatibility,
                    "total_memory_GB": vm.total_memory_GB,
                    "total_disk_GB": vm.total_disk_GB,
                    "vmware_tools": vm.vmware_tools,
                    "hard_disks": hard_disks,
                    "other_hardware": other_hardware,
                    "usb_controllers": usb_controllers,
                    "network_adapters": network_adapters
                }
                
                vm_details_list.append(vm_details)
                
            return vm_details_list

    
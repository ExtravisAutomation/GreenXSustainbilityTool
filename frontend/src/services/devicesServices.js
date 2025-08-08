import axiosInstance from '../utils/axios/axiosInstance';
import { FEATURE_FLAGS } from '../utils/featureFlags';

export const fetchPueDevice = async (siteId, deviceId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/average_energy_consumption_metrics/${siteId}?device_id=${deviceId}&duration=${duration}`
  );
  return response.data;
};

export const fetchDeviceThreshold = async (siteId, deviceId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/single_device_energy_consumption/${siteId}/${deviceId}?duration=${duration}`
  );
  return response.data;
};
// this is the same service as in the deshboard services for topDevices
export const fetchDeviceTrafficPerHour = async (controllerIp) => {
  const payload = {
    apic_controller_ip: controllerIp,
  };

  const response = await axiosInstance.post(`/devicetrafficperhr`, payload);
  return response.data;
};

export const fetchDevicePowerPerHour = async (controllerIp) => {
  const payload = {
    apic_controller_ip: controllerIp,
  };

  const response = await axiosInstance.post(`/devicePowerperhr`, payload);
  return response.data;
};

export const fetchDevicePowerUtilization = async (controllerIp) => {
  const response = await axiosInstance.post(
    `/device_inventory/deviceLastPowerUtiization?apic_api=${controllerIp}`
  );
  return response.data;
};

export const fetchDeviceInventory = async ({ page = 1, payload }) => {
  try {
    let response;
    if (FEATURE_FLAGS.Inventory_Filter) {
      response = await axiosInstance.post(
        '/device_inventory/get_all_device_inventory_with_filter',
        {
          ...payload,
        }
      );
    } else {
      response = await axiosInstance.post(
        `/device_inventory/get_all_device_inventory?page=${page}`
      );
    }
    return response?.data?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const fetchDeviceTypes = async (payload) => {
  try {
    const response = await axiosInstance.post(
      '/device_inventory/devicetype_count',
      { ...payload }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching device types:', error);
    throw error;
  }
};

export const fetchSoftwareVersion = async () => {
  try {
    const response = await axiosInstance.get(
      '/device_inventory/get_software_version'
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching software version:', error);
    throw error;
  }
};
export const fetchHardwareVersion = async () => {
  try {
    const response = await axiosInstance.get(
      '/device_inventory/get_hardware_version'
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching hardware version:', error);
    throw error;
  }
};

// Chesses file services:
export const fetchChassisDevices = async () => {
  const response = await axiosInstance.get(`/device_inventory/chasis`);
  return response.data;
};
// module file services
export const fetchDeviceModules = async () => {
  const response = await axiosInstance.get(`/device_inventory/modules`);
  //   console.log('device modules in services', response?.data);

  return response.data;
};
// power file services
export const fetchPowerSupplyData = async () => {
  const response = await axiosInstance.get('/device_inventory/powerSupply');
  console.log('device modules in services', response?.data);
  return response.data;
};
// fan file service
export const fetchFanData = async () => {
  const response = await axiosInstance.get('/device_inventory/fans');
  return response.data;
};

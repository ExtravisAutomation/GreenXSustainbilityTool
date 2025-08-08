// import { retry } from '@reduxjs/toolkit/query';
import axiosInstance from '../../utils/axios/axiosInstance';

export const fetchPcrData = async (siteId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/all_devices_pcr/${siteId}?duration=${duration}`
  );
  //   console.log('PCR in the service', response);

  return response;
};
export const fetchThreshholdData = async (siteId, deviceId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/single_device_energy_consumption/${siteId}/${deviceId}?duration=${duration}`
  );
  //   console.log('threshould in the service', response);
  return response;
};

export const fetchPueDeviceData = async (siteId, deviceId, duration) => {
  const response = await axiosInstance.get(
    // `/sites/sites/average_energy_consumption_metrics/${siteId}?device_id=${deviceId}&duration=${duration}`
    `/sites/energy_cost_summary/${siteId}?device_id=${deviceId}&duration=${duration}`
  );
  //   console.log('pue data in the service', response?.data?.data);
  return response;
};

// DetailsCards Services
export const fetchInventoryCount = async (siteId) => {
  const response = await axiosInstance.get(
    `/sites/get_inventory_count?site_id=${siteId}`
  );
  //   console.log('inventory count in the service', response);
  return response;
};
// Carbon Emission Card
export const fetchCarbonEmissionData = async (siteId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/carbon_emission_details/${siteId}?duration=${duration}`
  );
  //   console.log('carbon emission data in the service', response);
  return response;
};

//
export const fetchDevicesCarbonEmission = async (siteId, duration) => {
  const response = await axiosInstance.get(
    `/sites/sites/all_devices_carbon_emission/${siteId}?duration=${duration}`
  );
  return response?.data?.data;
};

export const fetchLast24HoursEnergyMetrics = async (siteId) => {
  const response = await axiosInstance.get(
    `/sites/sites/last_24_hours_energy_metrics/${siteId}`
  );
  return response?.data?.data;
};
export const fetchLast7DaysEnergyMetrics = async (siteId) => {
  const response = await axiosInstance.get(
    `/sites/sites/last_7_days_energy_metrics/${siteId}`
  );
  return response?.data?.data;
};
export const fetchAverageEnergyConsumptionMetrics = async (
  siteId,
  duration
) => {
  const response = await axiosInstance.get(
    `/sites/energy_cost_summary/${siteId}?duration=${duration}`
  );
  return response?.data?.data;
};
// pages services in Dashbaord Module
// export const fetchDeviceLevelAnalytics = (siteId, deviceId) => {
//   const response = axiosInstance.get(
//     `/sites/device_level_analytics/${siteId}?device_id=${deviceId}`
//   );
//   return response;
// };
//  for both api services conditionally based on duration
export const fetchDeviceLevelAnalytics = ({ siteId, deviceId, duration }) => {
  let url = `/sites/device_level_analytics/${siteId}?device_id=${deviceId}`;
  if (duration) {
    url += `&duration=${duration}`;
  }

  const response = axiosInstance.get(url);
  return response;
};

// scoreCard Modal on Inventory Dashboard:
export const fetchAvgEnergyConsumptionWithModelCount = (payload) => {
  const response = axiosInstance.post(
    `/sites/sites/avg_energy_consumption_with_model_count`,
    payload
  );
  return response;
};
// Top Devices
export const fetchDeviceTrafficPerHour = (payload) => {
  const response = axiosInstance.post('/devicetrafficperhr', payload);
  return response;
};

// import { retry } from '@reduxjs/toolkit/query';
import axiosInstance from '../../../utils/axios/axiosInstance';

export const fetchMetricsData = async (siteId, duration) => {
  const payload = {
    site_id: siteId,
    duration: duration,
  };
  const response = await axiosInstance.post(`/dashboard/metrics`, payload);
  console.log('Data in services', response);

  return response;
};

export const fetchDeviceCo2Pcr = async (siteId, duration, devicesIds = []) => {
  const payload = {
    site_id: siteId,
    duration: duration,
    device_ids: devicesIds,
    comparison: true,
  };
  const response = await axiosInstance.post(
    `/dashboard/get_devices_co2emmision_pcr`,
    payload
  );

  if (devicesIds?.length > 0) {
    const [device_one, device_two] = devicesIds;
    // console.log('Device One Data:', response.data.data?.[device_one]);
    // console.log('Device Two Data:', response.data.data?.[device_two]);
    const deviceOneData = response.data.data?.[device_one];
    const deviceTwoData = response.data.data?.[device_two];
    const compareResponse = [deviceOneData, deviceTwoData];
    return compareResponse;
  } else {
    return response;
  }
};

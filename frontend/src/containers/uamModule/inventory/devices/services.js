import axiosInstance from '../../../../utils/axios/axiosInstance.js';
import { FEATURE_FLAGS } from '../../../../utils/featureFlags.js';

export const getDeviceInventory = async ({ page = 1, payload }) => {
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

export const getDviceTypes = async (payload) => {
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

export const getSoftwareVersion = async () => {
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

export const getHardwareVersion = async () => {
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

// export const getVendors = async () => {
//   try {
//     const response = await axiosInstance.get('/device_inventory/get_vendors');
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching vendors:', error);
//     throw error;
//   }
// };

export const getSiteNames = async () => {
  try {
    const response = await axiosInstance.get('/sites/get_site_names');
    return response?.data;
  } catch (error) {
    console.error('Error fetching site names:', error);
    throw error;
  }
};

export const getRacksBySiteId = async (siteId) => {
  try {
    const response = await axiosInstance.get(
      `/racks/getallracks?site_id=${siteId}`
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching racks by site ID:', error);
    throw error;
  }
};

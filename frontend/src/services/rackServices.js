import axiosInstance from '../utils/axios/axiosInstance';

export const fetchPowerUtilization = async (rackId) => {
  const response = await axiosInstance.post(
    `/racks/rackPowerutilization?rack_id=${rackId}`
  );
  return response.data;
};

export const getRackLastPowerUtilization = async (rackId) => {
  const response = await axiosInstance.post(
    `/racks/rackLastPowerUtiization?rack_id=${rackId}`
  );
  return response.data;
};

export const getRackCo2emmission = async (rackId) => {
  const response = await axiosInstance.post(
    `/sites/site_Co2emmission?site_id=${rackId}`
  );
  return response.data;
};

// services used on rackForm file and many other modals
// export const fetchSiteNames = async () => {
//   const response = await axiosInstance.get('/sites/get_site_names');

//   return response.data?.data || [];
// };

export const getAllBuildings = async () => {
  const response = await axiosInstance.get('/racks/getallbuildings');
  return response.data || [];
};

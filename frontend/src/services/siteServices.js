import axiosInstance from '../utils/axios/axiosInstance';

export const getSiteCo2emmission = async (rackId) => {
  const response = await axiosInstance.post(
    `/sites/site_Co2emmission?site_id=${rackId}`
  );
  return response.data;
};

export const getSiteHourlyEER = async (siteId) => {
  const response = await axiosInstance.post(`/sites/site_hourly_eer/${siteId}`);
  return response.data;
};
export const fetchSiteEnergyEfficiency = async (siteId) => {
  const response = await axiosInstance.post(
    `/sites/siteEnergyEfficiency/${siteId}`
  );
  return response.data;
};

export const fetchSitePowerRequired = async (siteId) => {
  const response = await axiosInstance.post(
    `/sites/siteRequiredPower/${siteId}`
  );
  return response.data;
};

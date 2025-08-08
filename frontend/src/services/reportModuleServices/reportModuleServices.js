import axiosInstance from '../../utils/axios/axiosInstance';

export const fetchSwitchesPowerUtilization = (siteId) => {
  const response = axiosInstance.post(
    `/sites/sitePowerutilization?site_id=${siteId}`
  );
  return response;
};

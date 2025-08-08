// I will add commen services here

import axiosInstance from '../utils/axios/axiosInstance';

export const fetchSiteNames = async () => {
  const response = await axiosInstance.get('/sites/get_site_names');
  return response.data?.data || [];
};

export const fetchRacksBySiteId = async (siteId) => {
  const response = await axiosInstance.get(
    `/racks/getallracks?site_id=${siteId}`
  );
  return response;
};
export const fetchAllVendors = async () => {
  const response = await axiosInstance.get('/device_inventory/get_vendors');

  return response;
};

export const fetchAllPasswordGroups = async () => {
  // console.log('passwoed service called');

  const response = await axiosInstance.get(
    '/sites/sites/get_all_password_groups/'
  );

  // console.log('pass group from Service', response);

  return response;
};

import axiosInstance from '../utils/axios/axiosInstance';
// These are the services for inventory2 section in the UI
export const fetchSeeds = async () => {
  const response = await axiosInstance.get('/sites/devices/get_all_with_sntc');
  //   console.log('Seeds in services', response?.data);

  return response?.data;
};

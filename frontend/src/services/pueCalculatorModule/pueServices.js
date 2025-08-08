import axiosInstance from '../../utils/axios/axiosInstance';

export const fetchPueCalculatorData = async (payload) => {
  const response = await axiosInstance.post(
    `/comparison/compare_analytics`,
    payload
  );
  return response;
};

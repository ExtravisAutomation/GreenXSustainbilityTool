import axiosInstance from '../../utils/axios/axiosInstance';

export const fetchPowerOutputPrediction = async (siteId) => {
  const response = await axiosInstance.get(
    `/sites/sites/power_output_prediction/${siteId}`
  );
  return response;
};
const transformData = (data, valueKey) => {
  return data.map((item) => ({
    name: item.month,
    value: item[valueKey],
    prediction: item.Prediction.toLowerCase() === 'true',
  }));
};

export const fetchNextMonthData = async (device_id, valueKey = 'EER') => {
  try {
    const response = await axiosInstance.post(`/sites/get_next_month`, {
      device_id,
    });
    if (response?.data?.data) {
      return transformData(response?.data?.data, valueKey);
    }
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching next month data:', error);
    return null;
  }
};

export const getNextYearCO2 = async (site_id) => {
  try {
    const response = await axiosInstance.post(
      `/sites/get_next_year_co2?site_id=${site_id}`
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching next year CO2 data:', error);
    throw error;
  }
};

export const getNextYear = async (site_id) => {
  try {
    const response = await axiosInstance.post(
      `/sites/get_next_year?site_id=${site_id}`
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching next year data:', error);
    throw error;
  }
};

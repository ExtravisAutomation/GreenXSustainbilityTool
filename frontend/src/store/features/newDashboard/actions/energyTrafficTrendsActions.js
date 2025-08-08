import axiosInstance from '../../../../utils/axios/axiosInstance';
import {
  fetchEnergyTrendsFailure,
  fetchEnergyTrendsRequest,
  fetchEnergyTrendsSuccess,
} from '../slices/energyTrafficTrendsSlice';

// const access_token = localStorage.getItem("access_token");

export const fetchEnergyTrends = (siteId, duration) => async (dispatch) => {
  dispatch(fetchEnergyTrendsRequest());
  try {
    const payload = {
      site_id: siteId,
      duration: duration,
    };
    const response = await axiosInstance.post(
      `/dashboard/energy-traffic-trends`,
      payload
    );
    console.log(response, 'response energy data');
    dispatch(fetchEnergyTrendsSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchEnergyTrendsFailure(error));
  }
};

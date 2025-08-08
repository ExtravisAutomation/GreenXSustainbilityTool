import axiosInstance from '../../../../utils/axios/axiosInstance';
import {
  fetchTopFiveDevicesFailure,
  fetchTopFiveDevicesRequest,
  fetchTopFiveDevicesSuccess,
} from '../slices/topFiveDevicesSlice';

// const access_token = localStorage.getItem("access_token");

export const fetchTopFiveDevices = (siteId, duration) => async (dispatch) => {
  dispatch(fetchTopFiveDevicesRequest());
  try {
    const payload = {
      site_id: siteId,
      duration: duration,
    };
    const response = await axiosInstance.post(
      `/dashboard/peak_low_devices`,
      payload
    );
    console.log('Actions:::::::::::', response.data.data);
    dispatch(fetchTopFiveDevicesSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchTopFiveDevicesFailure(error));
  }
};

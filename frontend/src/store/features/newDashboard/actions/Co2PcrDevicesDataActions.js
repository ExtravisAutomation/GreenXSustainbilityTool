import {
  fetchCo2PcrDevicesDataFailure,
  fetchCo2PcrDevicesDataRequest,
  fetchCo2PcrDevicesDataSuccess,
} from '../slices/co2PcrDevicesDataSlice';
import axiosInstance from '../../../../utils/axios/axiosInstance';
// const access_token = localStorage.getItem("access_token");

export const fetchCo2PcrDevicesData =
  (siteId, duration) => async (dispatch) => {
    const payload = {
      site_id: siteId,
      duration: duration,
      comparison: false,
    };
    dispatch(fetchCo2PcrDevicesDataRequest());
    try {
      const response = await axiosInstance.post(
        `/dashboard/get_devices_co2emmision_pcr`,
        payload
      );
      console.log(response, 'response devices');
      dispatch(
        fetchCo2PcrDevicesDataSuccess(response?.data?.data?.devices_data)
      );
    } catch (error) {
      dispatch(fetchCo2PcrDevicesDataFailure(error));
    }
  };

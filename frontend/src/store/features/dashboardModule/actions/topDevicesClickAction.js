import {
  fetchTopDevicesClickDataRequest,
  fetchTopDevicesClickDataSuccess,
  fetchTopDevicesClickDataFailure,
} from "../slices/topDevicesClickSlice";
import { baseUrl } from "../../../../utils/axios";
import { BaseUrl } from "../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchTopDevicesClickData = (device_ip) => async (dispatch) => {
  dispatch(fetchTopDevicesClickDataRequest());
  try {
    const response = await axios.post(
      baseUrl +
        `/device_inventory/get_specific_device_inventory?device_ip=${device_ip}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response, "response");
    dispatch(fetchTopDevicesClickDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchTopDevicesClickDataFailure(error));
  }
};

import {
  fetchDevicesDataFailure,
  fetchDevicesDataRequest,
  fetchDevicesDataSuccess,
} from "../slices/devicesSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
// const access_token = localStorage.getItem("access_token");

export const fetchDevicesData = (siteId, access_token) => async (dispatch) => {
  dispatch(fetchDevicesDataRequest());
  try {
    const response = await axios.get(
      baseUrl + `/sites/site/devices_name/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response, "response devices");
    dispatch(fetchDevicesDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchDevicesDataFailure(error));
  }
};

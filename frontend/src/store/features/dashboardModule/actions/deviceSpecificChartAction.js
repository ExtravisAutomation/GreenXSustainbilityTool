import {
  fetchdeviceSpecificDataFailure,
  fetchdeviceSpecificDataRequest,
  fetchdeviceSpecificDataSuccess,
} from "../slices/deviceSpecificChartSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
// const access_token = localStorage.getItem("access_token");

export const fetchDeviceSpecificChartData =
  (siteId, access_token) => async (dispatch) => {
    dispatch(fetchdeviceSpecificDataRequest());
    try {
      const response = await axios.get(
        baseUrl + `/sites/site/device_specific_comparison/${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(response, "deviceSpecificChartData");
      dispatch(fetchdeviceSpecificDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchdeviceSpecificDataFailure(error));
    }
  };

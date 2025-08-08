import {
  fetchDeviceSpecificComparisonDataFailure,
  fetchDeviceSpecificComparisonDataRequest,
  fetchDeviceSpecificComparisonDataSuccess,
} from "../../slices/comparison/devicesComparisonSlice";
import { baseUrl } from "../../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchDeviceSpecificComparisonData =
  (siteId, device1, device2, duration) => async (dispatch) => {
    dispatch(fetchDeviceSpecificComparisonDataRequest());
    try {
      const response = await axios.get(
        baseUrl +
          `/sites/site/device_specific_comparison_WITH_FILTER/${siteId}`,
        {
          params: {
            device_name1: device1,
            device_name2: device2,
            duration: duration,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(response, "response");
      dispatch(fetchDeviceSpecificComparisonDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchDeviceSpecificComparisonDataFailure(error));
    }
  };

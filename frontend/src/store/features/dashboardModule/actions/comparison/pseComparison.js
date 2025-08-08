import {
  fetchPseDataFailure,
  fetchPseDataRequest,
  fetchPseDataSuccess,
} from "../../slices/comparison/pseSlice";
import { baseUrl } from "../../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchPseComparisonData =
  (siteId, device1, device2, duration) => async (dispatch) => {
    dispatch(fetchPseDataRequest());
    try {
      const response = await axios.get(
        baseUrl +
          `/sites/site/device_power_comparison_percentage_WITH_FILTER/${siteId}`,
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
      dispatch(fetchPseDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchPseDataFailure(error));
    }
  };

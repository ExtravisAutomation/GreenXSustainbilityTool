import {
  fetchTrafficThroughputDataFailure,
  fetchTrafficThroughputDataRequest,
  fetchTrafficThroughputDataSuccess,
} from "../slices/trafficThroughputSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
import axiosInstance from "../../../../utils/axios/axiosInstance";
// const access_token = localStorage.getItem("access_token");

export const fetchTrafficThroughputChartData =
  (siteId, deviceName, throuputOption, access_token) => async (dispatch) => {
    // console.log(throuputOption, "throuputOption in action");
    dispatch(fetchTrafficThroughputDataRequest());
    try {
      const payload = {
        device_name: deviceName,
        duration: throuputOption,
      };
      const response = await axiosInstance.get(
        baseUrl +
          `/sites/site/traffic_throughput_metrics_by_device_WITH_FILTER/${siteId}`,
        {
          params: {
            device_name: deviceName,
            duration: throuputOption,
          },
        }
      );
      // console.log(response, "response");
      dispatch(fetchTrafficThroughputDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchTrafficThroughputDataFailure(error));
    }
  };

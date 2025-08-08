import {
  fetchTrafficThroughputClickDataFailure,
  fetchTrafficThroughputClickDataRequest,
  fetchTrafficThroughputClickDataSuccess,
} from "../slices/trafficThroughputClickSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchTrafficData = (siteId) => async (dispatch) => {
  dispatch(fetchTrafficThroughputClickDataRequest());
  try {
    const response = await axios.get(
      baseUrl + `/sites/site/TRAFFIC_THROUGHPUT_on_click/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response, "response");
    dispatch(fetchTrafficThroughputClickDataSuccess(response.data.metrics));
  } catch (error) {
    dispatch(fetchTrafficThroughputClickDataFailure(error));
  }
};

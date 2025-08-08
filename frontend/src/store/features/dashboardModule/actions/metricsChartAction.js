// import {
//     fetchkpiDataFailure,
//     fetchkpiDataRequest,
//     fetchkpiDataSuccess,
//   } from "../slices/kpiChartSlice";
import {
  fetchmetricsChartDataFailure,
  fetchmetricsChartDataRequest,
  fetchmetricsChartDataSuccess,
} from "../slices/metricsChartSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
// const access_token = localStorage.getItem("access_token");

export const fetchMetricsChartData =
  (siteId, access_token) => async (dispatch) => {
    dispatch(fetchmetricsChartDataRequest());
    try {
      const response = await axios.get(
        baseUrl + `/sites/sites/power_summary_metrics/${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(response, "response");
      dispatch(fetchmetricsChartDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchmetricsChartDataFailure(error));
    }
  };

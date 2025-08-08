import {
  fetchpiDataRequest,
  fetchpiDataFailure,
  fetchpiDataSuccess,
} from "../slices/piChartSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
// const access_token = localStorage.getItem("access_token");

export const fetchPiChartData = (siteId, access_token) => async (dispatch) => {
  dispatch(fetchpiDataRequest());
  try {
    const response = await axios.get(
      baseUrl + `/sites/site/pie_chart/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response, "pi response");
    dispatch(fetchpiDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchpiDataFailure(error));
  }
};

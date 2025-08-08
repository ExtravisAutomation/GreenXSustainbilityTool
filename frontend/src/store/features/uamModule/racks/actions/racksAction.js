import {
  fetchKpiDataRequest,
  fetchKpiDataSuccess,
  fetchKpiDataFailure,
} from "../slices/racksSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchKpiData = (siteId) => async (dispatch) => {
  dispatch(fetchKpiDataRequest());
  try {
    const response = await axios.get(
      baseUrl + `/sites/site/KPI_on_click/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response, "response");
    dispatch(fetchKpiDataSuccess(response.data.metrics));
  } catch (error) {
    dispatch(fetchKpiDataFailure(error));
  }
};

import {
  fetchsavedReportsDataSuccess,
  fetchsavedReportsDataFailure,
  fetchsavedReportsDataRequest,
} from "../slices/savedreportsSlice";
import { baseUrl } from "../../../../utils/axios";

import { BaseUrl } from "../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchSavedReportsData = (siteId) => async (dispatch) => {
  dispatch(fetchsavedReportsDataRequest());
  try {
    const response = await axios.get(BaseUrl + `/reports/getallreports`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    // console.log(response, "response");
    dispatch(fetchsavedReportsDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchsavedReportsDataFailure(error));
  }
};

import {
  fetchHmRackClickDataFailure,
  fetchHmRackClickDataRequest,
  fetchHmRackClickDataSuccess,
} from "../slices/hmRackClickSlice";
import { BaseUrl, baseUrl } from "../../../../utils/axios";
import axios from "axios";
const access_token = localStorage.getItem("access_token");

export const fetchHmRackDetail = (rackId, siteId) => async (dispatch) => {
  dispatch(fetchHmRackClickDataRequest());
  try {
    const response = await axios.post(
      baseUrl + `/racks/rackbyid/${rackId}/${siteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response, "rack detailsssss");
    dispatch(fetchHmRackClickDataSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchHmRackClickDataFailure(error));
  }
};

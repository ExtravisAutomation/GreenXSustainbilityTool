import {
  fetchelectricityMapDataRequest,
  fetchelectricityMapDataFailure,
  fetchelectricityMapDataSuccess,
} from "../slices/electricityMapSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
// const access_token = localStorage.getItem("access_token");

export const fetchElectricityMapData =
  (siteId, access_token) => async (dispatch) => {
    dispatch(fetchelectricityMapDataRequest());
    try {
      const response = await axios.get(
        baseUrl + `/sites/sites/location_and_carbon/${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("location and carbon map:", response);
      dispatch(fetchelectricityMapDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchelectricityMapDataFailure(error));
    }
  };

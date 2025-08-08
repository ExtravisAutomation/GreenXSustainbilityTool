import {
  fetchelectricityMapPiDataFailure,
  fetchelectricityMapPiDataRequest,
  fetchelectricityMapPiDataSuccess,
} from "../slices/electricityMapPiSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
import axiosInstance from "../../../../utils/axios/axiosInstance";
// const access_token = localStorage.getItem("access_token");

export const fetchElectricityMapPiData =
  (siteId, duration, access_token) => async (dispatch) => {
    dispatch(fetchelectricityMapPiDataRequest());
    try {
      const response = await axiosInstance.get(
        baseUrl +
          `/sites/sites/electricity_map_piechart/${siteId}?duration=${duration}`,
      );
      // console.log(response, "response");
      dispatch(fetchelectricityMapPiDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchelectricityMapPiDataFailure(error));
    }
  };

import {
  fetchTopDevicesPowerCostDataFailure,
  fetchTopDevicesPowerCostDataRequest,
  fetchTopDevicesPowerCostDataSuccess,
} from "../slices/topDevicesPowerCostSlice";
import { baseUrl } from "../../../../utils/axios";
import axios from "axios";
import axiosInstance from "../../../../utils/axios/axiosInstance";
// const access_token = localStorage.getItem("access_token");

export const fetchTopDevicesPowerCostData =
  (siteId, topDevicesOption) => async (dispatch) => {
    dispatch(fetchTopDevicesPowerCostDataRequest());
    try {
      const response = await axiosInstance.get(`/sites/site/top_devices_power_cost_WITH_FILTER/${siteId}?duration=${topDevicesOption}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // }
      );
      // console.log(response, "response");
      dispatch(fetchTopDevicesPowerCostDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchTopDevicesPowerCostDataFailure(error));
    }
  };

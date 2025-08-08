import {
  fetchkpiDataFailure,
  fetchkpiDataRequest,
  fetchkpiDataSuccess,
} from '../slices/kpiChartSlice';
import { baseUrl } from '../../../../utils/axios';
import axios from 'axios';
import axiosInstance from '../../../../utils/axios/axiosInstance';
// const access_token = localStorage.getItem("access_token");

export const fetchKpiChartData =
  (siteId, kpiOption, access_token) => async (dispatch) => {
    dispatch(fetchkpiDataRequest());
    try {
      const response = await axiosInstance.get(
        baseUrl +
          `/sites/energy_efficiency_trends/${siteId}?duration=${kpiOption}`

        // {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // }
      );
      if (response?.status === 200) {
        dispatch(fetchkpiDataSuccess(response.data));
      } else {
        dispatch(fetchkpiDataSuccess([]));
      }
    } catch (error) {
      dispatch(fetchkpiDataFailure(error));
      dispatch(fetchkpiDataSuccess([]));
    }
  };

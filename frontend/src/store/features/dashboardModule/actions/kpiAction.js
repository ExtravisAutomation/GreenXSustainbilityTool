import {
  fetchKpiDataRequest,
  fetchKpiDataSuccess,
  fetchKpiDataFailure,
} from '../slices/kpiClickSlice';
import { baseUrl } from '../../../../utils/axios';
import axios from 'axios';
import axiosInstance from '../../../../utils/axios/axiosInstance';
const access_token = localStorage.getItem('access_token');

export const fetchKpiData =
  (siteId, time, access_token) => async (dispatch) => {
    dispatch(fetchKpiDataRequest());
    try {
      const response = await axiosInstance.get(
        `/sites/on_click_detailed_energy_efficiency/${siteId}?timestamp=${time}`
      );
      console.log(response, 'response kpi');
      dispatch(fetchKpiDataSuccess(response.data.data));
    } catch (error) {
      dispatch(fetchKpiDataFailure(error));
    }
  };

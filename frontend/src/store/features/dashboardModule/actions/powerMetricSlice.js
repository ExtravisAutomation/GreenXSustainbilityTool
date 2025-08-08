import {
  fetchpowerMetricDataRequest,
  fetchpowerMetricDataFailure,
  fetchpowerMetricDataSuccess,
} from '../slices/powerMetricsClickSlice';
import { baseUrl } from '../../../../utils/axios';
import axios from 'axios';
const access_token = localStorage.getItem('access_token');

export const fetchMetricsData =
  (siteId, device_id, time, access_token) => async (dispatch) => {
    dispatch(fetchpowerMetricDataRequest());
    try {
      // baseUrl + `/sites/site/POWER_METRICS_on_click/${siteId}`,
      const response = await axios.get(
        baseUrl +
          `/sites/site/detailed_energy_metrics/${siteId}?device_id=${device_id}&time=${time}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response, 'response metrics');
      dispatch(fetchpowerMetricDataSuccess(response.data?.data));
    } catch (error) {
      dispatch(fetchpowerMetricDataFailure(error));
    }
  };

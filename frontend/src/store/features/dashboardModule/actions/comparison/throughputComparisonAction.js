import {
  fetchThroughputComparisonDataFailure,
  fetchThroughputComparisonDataRequest,
  fetchThroughputComparisonDataSuccess,
} from '../../slices/comparison/comparisonThrouputSlice';
import { baseUrl } from '../../../../../utils/axios';
import axios from 'axios';
const access_token = localStorage.getItem('access_token');

export const fetchThroughputComparisonData =
  (siteId, device1, device2, duration) => async (dispatch) => {
    dispatch(fetchThroughputComparisonDataRequest());
    console.log('MyCode:::::::', device1 + 'device2::', device2);

    try {
      const response = await axios.get(
        baseUrl + `/sites/site/device_traffic_comparison_WITH_FILTER/${siteId}`,
        {
          params: {
            device_name1: device1,
            device_name2: device2,
            duration: duration,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(response, "response");
      dispatch(fetchThroughputComparisonDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchThroughputComparisonDataFailure(error));
    }
  };

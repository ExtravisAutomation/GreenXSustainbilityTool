// features/dashboardModule/actions/addReportsActions.js
// import { addReportRequest, addReportSuccess, addReportFailure } from "./addReportsSlice";
import {
  addReportRequest,
  addReportSuccess,
  addReportFailure,
} from '../slices/addReportsSlice';
import axios from 'axios';
import { BaseUrl } from '../../../../utils/axios';

const access_token = localStorage.getItem('access_token'); // Assuming access token retrieval

export const addReport = (reportData) => async (dispatch) => {
  dispatch(addReportRequest());
  try {
    const payload = {
      reportData: reportData,
    };
    const response = await axios.post(
      BaseUrl + '/reports/addReport/', // Replace with actual URL
      reportData
    );
    dispatch(
      addReportSuccess(response.data.message || 'Report added successfully')
    ); // Handle success message
  } catch (error) {
    dispatch(addReportFailure(error));
  }
};

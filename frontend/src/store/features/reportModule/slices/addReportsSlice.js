// features/dashboardModule/slices/addReportsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addingReport: false,
  error: null,
  successMessage: null, // Added for successful report addition
};

const addReportsSlice = createSlice({
  name: "addReports",
  initialState,
  reducers: {
    addReportRequest: (state) => {
      state.addingReport = true;
      state.error = null;
      state.successMessage = null;
    },
    addReportSuccess: (state, action) => {
      state.addingReport = false;
      state.successMessage = action.payload; // Added for success message
    },
    addReportFailure: (state, action) => {
      state.addingReport = false;
      state.error = action.payload;
    },
  },
});

export const { addReportRequest, addReportSuccess, addReportFailure } =
  addReportsSlice.actions;
export default addReportsSlice.reducer;

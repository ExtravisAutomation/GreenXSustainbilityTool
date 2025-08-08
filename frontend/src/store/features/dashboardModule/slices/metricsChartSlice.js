import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const metricsChartSlice = createSlice({
  name: "metricsChart",
  initialState,
  reducers: {
    fetchmetricsChartDataRequest: (state) => {
      state.loading = true;
    },
    fetchmetricsChartDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchmetricsChartDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchmetricsChartDataRequest,
  fetchmetricsChartDataSuccess,
  fetchmetricsChartDataFailure,
} = metricsChartSlice.actions;
export default metricsChartSlice.reducer;

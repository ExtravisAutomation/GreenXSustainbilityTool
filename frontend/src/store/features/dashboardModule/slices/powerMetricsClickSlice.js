import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const powerMetricSlice = createSlice({
  name: "kpi",
  initialState,
  reducers: {
    fetchpowerMetricDataRequest: (state) => {
      state.loading = true;
    },
    fetchpowerMetricDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchpowerMetricDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchpowerMetricDataRequest,
  fetchpowerMetricDataSuccess,
  fetchpowerMetricDataFailure,
} = powerMetricSlice.actions;
export default powerMetricSlice.reducer;

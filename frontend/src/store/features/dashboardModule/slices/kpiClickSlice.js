import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const kpiSlice = createSlice({
  name: "kpi",
  initialState,
  reducers: {
    fetchKpiDataRequest: (state) => {
      state.loading = true;
    },
    fetchKpiDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchKpiDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchKpiDataRequest, fetchKpiDataSuccess, fetchKpiDataFailure } =
  kpiSlice.actions;
export default kpiSlice.reducer;

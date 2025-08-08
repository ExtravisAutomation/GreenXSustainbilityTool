import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const comparisonThroughputSlice = createSlice({
  name: "throughputComparison",
  initialState,
  reducers: {
    fetchThroughputComparisonDataRequest: (state) => {
      state.loading = true;
    },
    fetchThroughputComparisonDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchThroughputComparisonDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchThroughputComparisonDataRequest,
  fetchThroughputComparisonDataSuccess,
  fetchThroughputComparisonDataFailure,
} = comparisonThroughputSlice.actions;
export default comparisonThroughputSlice.reducer;

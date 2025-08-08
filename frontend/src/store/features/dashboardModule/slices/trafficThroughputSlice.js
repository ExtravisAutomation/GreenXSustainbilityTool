import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const trafficThroughputSlice = createSlice({
  name: "trafficThroughput",
  initialState,
  reducers: {
    fetchTrafficThroughputDataRequest: (state) => {
      state.loading = true;
    },
    fetchTrafficThroughputDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTrafficThroughputDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTrafficThroughputDataRequest,
  fetchTrafficThroughputDataSuccess,
  fetchTrafficThroughputDataFailure,
} = trafficThroughputSlice.actions;
export default trafficThroughputSlice.reducer;

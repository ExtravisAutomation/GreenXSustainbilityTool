import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const trafficThroughputClickSlice = createSlice({
  name: "trafficThroughputClick",
  initialState,
  reducers: {
    fetchTrafficThroughputClickDataRequest: (state) => {
      state.loading = true;
    },
    fetchTrafficThroughputClickDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTrafficThroughputClickDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTrafficThroughputClickDataRequest,
  fetchTrafficThroughputClickDataSuccess,
  fetchTrafficThroughputClickDataFailure,
} = trafficThroughputClickSlice.actions;
export default trafficThroughputClickSlice.reducer;

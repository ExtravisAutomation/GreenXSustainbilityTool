import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const topDevicesClickSlice = createSlice({
  name: "topDevices",
  initialState,
  reducers: {
    fetchTopDevicesClickDataRequest: (state) => {
      state.loading = true;
    },
    fetchTopDevicesClickDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTopDevicesClickDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTopDevicesClickDataRequest,
  fetchTopDevicesClickDataSuccess,
  fetchTopDevicesClickDataFailure,
} = topDevicesClickSlice.actions;
export default topDevicesClickSlice.reducer;

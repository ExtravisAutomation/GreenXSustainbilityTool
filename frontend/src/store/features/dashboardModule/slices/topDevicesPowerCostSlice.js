import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const topDevicesPowerCostSlice = createSlice({
  name: "topDevicesPowerCost",
  initialState,
  reducers: {
    fetchTopDevicesPowerCostDataRequest: (state) => {
      state.loading = true;
    },
    fetchTopDevicesPowerCostDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTopDevicesPowerCostDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTopDevicesPowerCostDataRequest,
  fetchTopDevicesPowerCostDataSuccess,
  fetchTopDevicesPowerCostDataFailure,
} = topDevicesPowerCostSlice.actions;
export default topDevicesPowerCostSlice.reducer;

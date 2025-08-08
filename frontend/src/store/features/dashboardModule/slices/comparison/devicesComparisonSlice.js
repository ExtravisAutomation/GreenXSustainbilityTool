import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const devicesComparisonSlice = createSlice({
  name: "deviceSpecific",
  initialState,
  reducers: {
    fetchDeviceSpecificComparisonDataRequest: (state) => {
      state.loading = true;
    },
    fetchDeviceSpecificComparisonDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchDeviceSpecificComparisonDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchDeviceSpecificComparisonDataRequest,
  fetchDeviceSpecificComparisonDataSuccess,
  fetchDeviceSpecificComparisonDataFailure,
} = devicesComparisonSlice.actions;
export default devicesComparisonSlice.reducer;

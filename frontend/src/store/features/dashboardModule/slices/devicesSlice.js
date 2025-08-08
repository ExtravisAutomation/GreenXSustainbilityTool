import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    fetchDevicesDataRequest: (state) => {
      state.loading = true;
    },
    fetchDevicesDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchDevicesDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchDevicesDataRequest,
  fetchDevicesDataSuccess,
  fetchDevicesDataFailure,
} = devicesSlice.actions;
export default devicesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const co2PcrDevicesSlice = createSlice({
  name: 'co2_pcr_devices_data',
  initialState,
  reducers: {
    fetchCo2PcrDevicesDataRequest: (state) => {
      state.loading = true;
    },
    fetchCo2PcrDevicesDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchCo2PcrDevicesDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchCo2PcrDevicesDataRequest,
  fetchCo2PcrDevicesDataSuccess,
  fetchCo2PcrDevicesDataFailure,
} = co2PcrDevicesSlice.actions;
export default co2PcrDevicesSlice.reducer;

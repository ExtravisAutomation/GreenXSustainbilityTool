import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const topFiveDevicesSlice = createSlice({
  name: 'top_five_devices',
  initialState,
  reducers: {
    fetchTopFiveDevicesRequest: (state) => {
      state.loading = true;
    },
    fetchTopFiveDevicesSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchTopFiveDevicesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTopFiveDevicesRequest,
  fetchTopFiveDevicesSuccess,
  fetchTopFiveDevicesFailure,
} = topFiveDevicesSlice.actions;
export default topFiveDevicesSlice.reducer;

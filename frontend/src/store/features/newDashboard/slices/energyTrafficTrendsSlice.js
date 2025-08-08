import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const energyTrendsSlice = createSlice({
  name: 'energyTrends',
  initialState,
  reducers: {
    fetchEnergyTrendsRequest: (state) => {
      state.loading = true;
    },
    fetchEnergyTrendsSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchEnergyTrendsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchEnergyTrendsRequest,
  fetchEnergyTrendsSuccess,
  fetchEnergyTrendsFailure,
} = energyTrendsSlice.actions;
export default energyTrendsSlice.reducer;

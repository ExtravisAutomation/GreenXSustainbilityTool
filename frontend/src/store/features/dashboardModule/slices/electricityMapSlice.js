import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const electricityMapSlice = createSlice({
  name: "electricityMap",
  initialState,
  reducers: {
    fetchelectricityMapDataRequest: (state) => {
      state.loading = true;
    },
    fetchelectricityMapDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchelectricityMapDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchelectricityMapDataRequest,
  fetchelectricityMapDataSuccess,
  fetchelectricityMapDataFailure,
} = electricityMapSlice.actions;
export default electricityMapSlice.reducer;

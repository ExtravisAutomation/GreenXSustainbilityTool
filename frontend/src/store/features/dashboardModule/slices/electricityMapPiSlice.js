import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const electricityMapPiSlice = createSlice({
  name: "electricityMapPi",
  initialState,
  reducers: {
    fetchelectricityMapPiDataRequest: (state) => {
      state.loading = true;
    },
    fetchelectricityMapPiDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchelectricityMapPiDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchelectricityMapPiDataRequest,
  fetchelectricityMapPiDataSuccess,
  fetchelectricityMapPiDataFailure,
} = electricityMapPiSlice.actions;
export default electricityMapPiSlice.reducer;

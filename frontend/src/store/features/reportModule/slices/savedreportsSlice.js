import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const savedReportsSlice = createSlice({
  name: "savedReports",
  initialState,
  reducers: {
    fetchsavedReportsDataRequest: (state) => {
      state.loading = true;
    },
    fetchsavedReportsDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchsavedReportsDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchsavedReportsDataRequest,
  fetchsavedReportsDataSuccess,
  fetchsavedReportsDataFailure,
} = savedReportsSlice.actions;
export default savedReportsSlice.reducer;

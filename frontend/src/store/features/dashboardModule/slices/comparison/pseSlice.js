import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const comparisonPseSlice = createSlice({
  name: "Pse",
  initialState,
  reducers: {
    fetchPseDataRequest: (state) => {
      state.loading = true;
    },
    fetchPseDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchPseDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchPseDataRequest, fetchPseDataSuccess, fetchPseDataFailure } =
  comparisonPseSlice.actions;
export default comparisonPseSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const piSlice = createSlice({
  name: "pi",
  initialState,
  reducers: {
    fetchpiDataRequest: (state) => {
      state.loading = true;
    },
    fetchpiDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchpiDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchpiDataRequest, fetchpiDataSuccess, fetchpiDataFailure } =
  piSlice.actions;
export default piSlice.reducer;

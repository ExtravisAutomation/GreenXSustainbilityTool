import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const kpiSlice = createSlice({
  name: "kpi",
  initialState,
  reducers: {
    fetchkpiDataRequest: (state) => {
      state.loading = true;
    },
    fetchkpiDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchkpiDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchkpiDataRequest, fetchkpiDataSuccess, fetchkpiDataFailure } =
  kpiSlice.actions;
export default kpiSlice.reducer;

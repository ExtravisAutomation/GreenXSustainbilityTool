import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const hmRackClickSlice = createSlice({
  name: "hmRackClick",
  initialState,
  reducers: {
    fetchHmRackClickDataRequest: (state) => {
      state.loading = true;
    },
    fetchHmRackClickDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchHmRackClickDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchHmRackClickDataRequest,
  fetchHmRackClickDataSuccess,
  fetchHmRackClickDataFailure,
} = hmRackClickSlice.actions;
export default hmRackClickSlice.reducer;

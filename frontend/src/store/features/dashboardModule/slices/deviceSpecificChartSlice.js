import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const deviceSpecificSlice = createSlice({
  name: "deviceSpecific2",
  initialState,
  reducers: {
    fetchdeviceSpecificDataRequest: (state) => {
      state.loading = true;
    },
    fetchdeviceSpecificDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchdeviceSpecificDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchdeviceSpecificDataRequest,
  fetchdeviceSpecificDataSuccess,
  fetchdeviceSpecificDataFailure,
} = deviceSpecificSlice.actions;
export default deviceSpecificSlice.reducer;

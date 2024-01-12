import { extendedApi } from "./apis";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  site_names: [],
  rack_names: [],
  vendor_names: [],
  function_names: [],
  device_type_names: [],
  password_group_names: [],
  password_group_type_names: [],
};

const dropDownsSlice = createSlice({
  name: "drop_downs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchSiteNames.matchFulfilled,
        (state, action) => {
          state.site_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchRackNames.matchFulfilled,
        (state, action) => {
          state.rack_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchVendorNames.matchFulfilled,
        (state, action) => {
          state.vendor_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchFunctionNames.matchFulfilled,
        (state, action) => {
          state.function_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchDeviceTypeNames.matchFulfilled,
        (state, action) => {
          state.device_type_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroupNames.matchFulfilled,
        (state, action) => {
          state.password_group_names = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.fetchPasswordGroupTypeNames.matchFulfilled,
        (state, action) => {
          state.password_group_type_names = action.payload;
        }
      );
  },
});

export default dropDownsSlice.reducer;

import { extendedApi } from "./apis";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const sfpsSlice = createSlice({
  name: "sfps",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchSfps.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteSfps.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const shouldKeepItem = deletedIds.some((deletedId) => {
                return deletedId === item.site_id;
              });
              return !shouldKeepItem;
            });
          }
        }
      )
      .addMatcher(
        extendedApi.endpoints.addSfps.matchFulfilled,
        (state, action) => {
          state.all_data.push(action.payload.data);
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateSfps.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            if (item.site_id === objectToReplace.site_id) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

// export const { setNextPage, initiateItem } = passwordGroupSlice.actions;
export default sfpsSlice.reducer;

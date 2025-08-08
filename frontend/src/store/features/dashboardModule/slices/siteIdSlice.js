// idSlice.js
import { createSlice } from "@reduxjs/toolkit";

const siteIdSlice = createSlice({
  name: "id",
  initialState: null,
  reducers: {
    setSelectedSiteId(state, action) {
      return action.payload;
    },
  },
});

export const { setSelectedSiteId } = siteIdSlice.actions;

export default siteIdSlice.reducer;

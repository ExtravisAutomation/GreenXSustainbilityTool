import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSites, createSite, updateSite, deleteSite } from "../api";

export const fetchsitesAsync = createAsyncThunk(
  "sites/fetchsites",
  async () => {
    return fetchSites();
  }
);

export const createSiteAsync = createAsyncThunk(
  "/sites/addsite",
  async (newItem) => {
    return createSite(newItem);
  }
);

export const updateSiteAsync = createAsyncThunk(
  "/sites/updatesite/",
  async ({ itemId, values }) => {
    return updateSite(itemId, values);
  }
);

export const deleteSiteAsync = createAsyncThunk(
  "/sites/deletesite",
  async (itemId) => {
    await deleteSite(itemId);
    return itemId;
  }
);

const initialState = {
  sites: [],
  status: "idle",
  error: null,
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchsitesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchsitesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sites = action.payload;
      })
      .addCase(fetchsitesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSiteAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, "action payload");
        state.sites = [...state.sites, action.payload];
      })
      .addCase(createSiteAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSiteAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action, "action.payload update site");
        const { itemId, updatedItem } = action.payload;
        // console.log(itemId, updatedItem, "itemId,updatedItem");

        state.sites = state.sites.map((site) =>
          site.id === action.payload.data.id ? action.payload.data : site
        );
      })
      .addCase(updateSiteAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSiteAsync.fulfilled, (state, action) => {
        console.log("Before deletion:", state.sites);
        console.log("Deleting:", action.payload);
        state.status = "succeeded";
        state.sites = state.sites.filter((site) => site.id !== action.payload);
        console.log("After deletion:", state.sites);
      })

      .addCase(deleteSiteAsync.rejected, (state, action) => {
        console.log(action, "payload");
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default sitesSlice.reducer;

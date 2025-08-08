import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHosts, createSite, updateSite, deleteSite } from "../api";

export const fetchHostsAsync = createAsyncThunk(
  "/vcenter/gethostdetails/",
  async () => {
    return fetchHosts();
  }
);

export const createSiteAsync = createAsyncThunk(
  "/hosts/addsite",
  async (newItem) => {
    return createSite(newItem);
  }
);

export const updateSiteAsync = createAsyncThunk(
  "/hosts/updatesite/",
  async ({ itemId, values }) => {
    return updateSite(itemId, values);
  }
);

export const deleteSiteAsync = createAsyncThunk(
  "/hosts/deletesite",
  async (itemId) => {
    await deleteSite(itemId);
    return itemId;
  }
);

const initialState = {
  hosts: [],
  status: "idle",
  error: null,
};

const hostsSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHostsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHostsAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");
        state.status = "succeeded";
        state.hosts = action.payload;
      })
      .addCase(fetchHostsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSiteAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, "action payload");
        state.hosts = [...state.hosts, action.payload];
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

        state.hosts = state.hosts.map((site) =>
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
        console.log("Before deletion:", state.hosts);
        console.log("Deleting:", action.payload);
        state.status = "succeeded";
        state.hosts = state.hosts.filter((site) => site.id !== action.payload);
        console.log("After deletion:", state.hosts);
      })

      .addCase(deleteSiteAsync.rejected, (state, action) => {
        console.log(action, "payload");
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default hostsSlice.reducer;

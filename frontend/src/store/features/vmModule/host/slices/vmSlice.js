import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVMs, createSite, updateSite, deleteSite } from "../api";

export const fetchVMsAsync = createAsyncThunk(
  "vcenter/getallvms/",
  async () => {
    return fetchVMs();
  }
);

export const createSiteAsync = createAsyncThunk(
  "/vms/addsite",
  async (newItem) => {
    return createSite(newItem);
  }
);

export const updateSiteAsync = createAsyncThunk(
  "/vms/updatesite/",
  async ({ itemId, values }) => {
    return updateSite(itemId, values);
  }
);

export const deleteSiteAsync = createAsyncThunk(
  "/vms/deletesite",
  async (itemId) => {
    await deleteSite(itemId);
    return itemId;
  }
);

const initialState = {
  vms: [],
  status: "idle",
  error: null,
};

const vmsSlice = createSlice({
  name: "vms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVMsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVMsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vms = action.payload;
      })
      .addCase(fetchVMsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSiteAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, "action payload");
        state.vms = [...state.vms, action.payload];
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

        state.vms = state.vms.map((site) =>
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
        console.log("Before deletion:", state.vms);
        console.log("Deleting:", action.payload);
        state.status = "succeeded";
        state.vms = state.vms.filter((site) => site.id !== action.payload);
        console.log("After deletion:", state.vms);
      })

      .addCase(deleteSiteAsync.rejected, (state, action) => {
        console.log(action, "payload");
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default vmsSlice.reducer;

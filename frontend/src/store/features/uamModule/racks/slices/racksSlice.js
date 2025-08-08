import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRacks, createRack, updateRack, deleteRack } from "../api";

export const fetchRacksAsync = createAsyncThunk(
  "racks/fetchracks",
  async () => {
    return fetchRacks();
  }
);

export const createRackAsync = createAsyncThunk(
  "/racks/addrack",
  async ({ values }) => {
    console.log(values, "values in slice");
    return createRack(values);
  }
);

export const updateRackAsync = createAsyncThunk(
  "/racks/updaterack/",
  async ({ itemId, values }) => {
    return updateRack(itemId, values);
  }
);

export const deleteRackAsync = createAsyncThunk(
  "racks/deleteRack",
  async (itemId) => {
    await deleteRack(itemId);
    return itemId;
  }
);

const initialState = {
  racks: [],
  status: "idle",
  error: null,
};

const racksSlice = createSlice({
  name: "racks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRacksAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRacksAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.racks = action.payload;
      })
      .addCase(fetchRacksAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createRackAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRackAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, "action.payload create");
        state.racks = [...state.racks, action.payload];
      })
      .addCase(createRackAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateRackAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateRackAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.racks = state.racks.map((rack) =>
          rack.id === action.payload.data.id ? action.payload.data : rack
        );
      })
      .addCase(updateRackAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteRackAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRackAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.racks = state.racks.filter(
          (rack) => rack.id !== action.payload[0]
        );
      })

      .addCase(deleteRackAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default racksSlice.reducer;

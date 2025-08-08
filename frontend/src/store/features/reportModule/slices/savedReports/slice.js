import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteSavedReport,
  fetchSavedReports,
  updateSavedReport,
  createSavedReport,
} from "../../apis/savedReports/api";

export const fetchsavedReportsAsync = createAsyncThunk(
  "savedReports/fetchsavedReports",
  async () => {
    return fetchSavedReports();
  }
);

// export const createRackAsync = createAsyncThunk(
//   "/savedReports/addrack",
//   async ({ values }) => {
//     console.log(values, "values in slice");
//     return createRack(values);
//   }
// );

// export const updateRackAsync = createAsyncThunk(
//   "/savedReports/updaterack/",
//   async ({ itemId, values }) => {
//     return updateRack(itemId, values);
//   }
// );

export const deleteSavedReportAsync = createAsyncThunk(
  "/reports/deletereport",
  async (itemId) => {
    await deleteSavedReport(itemId);
    return itemId;
  }
);

const initialState = {
  savedReports: [],
  status: "idle",
  error: null,
};

const savedReportsSlice = createSlice({
  name: "savedReports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchsavedReportsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchsavedReportsAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload reports");
        state.status = "succeeded";
        state.savedReports = action.payload;
      })
      .addCase(fetchsavedReportsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      //   .addCase(createRackAsync.pending, (state) => {
      //     state.status = "loading";
      //   })
      //   .addCase(createRackAsync.fulfilled, (state, action) => {
      //     state.status = "succeeded";
      //     console.log(action.payload, "action.payload create");
      //     state.savedReports = [...state.savedReports, action.payload];
      //   })
      //   .addCase(createRackAsync.rejected, (state, action) => {
      //     state.status = "failed";
      //     state.error = action.error.message;
      //   })
      //   .addCase(updateRackAsync.pending, (state) => {
      //     state.status = "loading";
      //   })
      //   .addCase(updateRackAsync.fulfilled, (state, action) => {
      //     state.status = "succeeded";
      //     state.savedReports = state.savedReports.map((rack) =>
      //       rack.id === action.payload.data.id ? action.payload.data : rack
      //     );
      //   })
      //   .addCase(updateRackAsync.rejected, (state, action) => {
      //     state.status = "failed";
      //     state.error = action.error.message;
      //   })

      .addCase(deleteSavedReportAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSavedReportAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.savedReports = state.savedReports.filter(
          (reports) => reports.id !== action.payload[0]
        );
      })

      .addCase(deleteSavedReportAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default savedReportsSlice.reducer;

// import { monetxApi } from "../../apiSlice";
// import { dcsApi } from "../../apiSlice";
import { dcsApi } from "../../apiSlice";
export const extendedApi = dcsApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchRacks: builder.query({
      query: () => "/racks/getallracks",
    }),

    deleteRack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/delete_rack",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addRack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/add_rack",
        method: "POST",
        body: data,
      }),
    }),
    updateRack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/edit_rack",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchRacksQuery: useFetchRecordsQuery,
  useDeleteRackMutation: useDeleteRecordsMutation,
  // form apis
  useAddRackMutation: useAddRecordMutation,
  useUpdateRackMutation: useUpdateRecordMutation,
} = extendedApi;

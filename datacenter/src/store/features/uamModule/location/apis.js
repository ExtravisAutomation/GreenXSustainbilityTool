import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchLocations: builder.query({
      query: () => "/api/v1/uam/rack/get_all_racks",
    }),
   
    deleteLocation: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/delete_rack",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addLocation: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/add_rack",
        method: "POST",
        body: data,
      }),
    }),
    updateLocation: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/edit_rack",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchLocationsQuery: useFetchRecordsQuery,
  useDeleteLocationMutation: useDeleteRecordsMutation,
  // form apis
  useAddLocationMutation: useAddRecordMutation,
  useUpdateLocationMutation: useUpdateRecordMutation,
} = extendedApi;

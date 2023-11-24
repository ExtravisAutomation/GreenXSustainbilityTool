import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchInventories: builder.query({
      query: () => "/api/v1/uam/rack/get_all_racks",
    }),
   
    deleteInventory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/delete_rack",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addInventory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/add_rack",
        method: "POST",
        body: data,
      }),
    }),
    updateInventory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/rack/edit_rack",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchInventoriesQuery: useFetchRecordsQuery,
  useDeleteInventoryMutation: useDeleteRecordsMutation,
  // form apis
  useAddInventoryMutation: useAddRecordMutation,
  useUpdateInventoryMutation: useUpdateRecordMutation,
} = extendedApi;

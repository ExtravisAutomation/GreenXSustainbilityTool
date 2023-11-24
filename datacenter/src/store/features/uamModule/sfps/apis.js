import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchSfps: builder.query({
      query: () => "/api/v1/uam/uam-sfp/getAllSfps",
    }),
   
    deleteSfps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addSfps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateSfps: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchSfpsQuery: useFetchRecordsQuery,
  useDeleteSfpsMutation: useDeleteRecordsMutation,
  // form apis
  useAddSfpsMutation: useAddRecordMutation,
  useUpdateSfpsMutation: useUpdateRecordMutation,
} = extendedApi;

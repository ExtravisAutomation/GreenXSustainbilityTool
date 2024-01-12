import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchHwlivecycle: builder.query({
      query: () => "/api/v1/uam/uam-license/getAllLicenses",
    }),
   
    deleteHwlivecycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addHwlivecycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateHwlivecycle: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchHwlivecycleQuery: useFetchRecordsQuery,
  useDeleteHwlivecycleMutation: useDeleteRecordsMutation,
  // form apis
  useAddHwlivecycleMutation: useAddRecordMutation,
  useUpdateHwlivecycleMutation: useUpdateRecordMutation,
} = extendedApi;

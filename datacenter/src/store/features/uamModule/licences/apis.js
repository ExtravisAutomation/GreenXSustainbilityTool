import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchLicenses: builder.query({
      query: () => "/api/v1/uam/uam-license/getAllLicenses",
    }),
   
    deleteLicense: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addLicense: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateLicense: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchLicensesQuery: useFetchRecordsQuery,
  useDeleteLicenseMutation: useDeleteRecordsMutation,
  // form apis
  useAddLicenseMutation: useAddRecordMutation,
  useUpdateLicenseMutation: useUpdateRecordMutation,
} = extendedApi;

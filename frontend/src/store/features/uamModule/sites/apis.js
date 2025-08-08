// import { monetxApi } from "../../apiSlice";
import { dcsApi } from "../../apiSlice";
export const extendedApi = dcsApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchSites: builder.query({
      query: () => "/sites/getallsites",
    }),
    // fetchSites: builder.query({
    //   query: () => "/sites/getallsites",
    // }),

    deleteSite: builder.mutation({
      query: (data) => ({
        url: "/sites/deletesite",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addSite: builder.mutation({
      query: (data) => ({
        url: "/sites/addsite",
        method: "POST",
        body: data,
      }),
    }),
    updateSite: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/site/edit_site",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  // useFetchSitesQuery,
  useFetchSitesQuery: useFetchRecordsQuery,
  useDeleteSiteMutation: useDeleteRecordsMutation,
  // form apis
  useAddSiteMutation: useAddRecordMutation,
  useUpdateSiteMutation: useUpdateRecordMutation,
} = extendedApi;

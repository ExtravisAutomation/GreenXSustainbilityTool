import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchPasswordGroups: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_groups",
    }),
    addPasswordGroups: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_groups",
        method: "POST",
        body: data,
      }),
    }),
    deletePasswordGroups: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/delete_password_group",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addPasswordGroup: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/add_password_group",
        method: "POST",
        body: data,
      }),
    }),
    updatePasswordGroup: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/password_group/edit_password_group",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchPasswordGroupsQuery: useFetchRecordsQuery,
  useAddPasswordGroupsMutation: useAddRecordsMutation,
  useDeletePasswordGroupsMutation: useDeleteRecordsMutation,
  // form apis
  useAddPasswordGroupMutation: useAddRecordMutation,
  useUpdatePasswordGroupMutation: useUpdateRecordMutation,
} = extendedApi;

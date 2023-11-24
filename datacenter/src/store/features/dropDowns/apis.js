import { monetxApi } from "../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchSiteNames: builder.query({
      query: () => "/api/v1/uam/site/get_sites_dropdown",
    }),

    fetchRackNames: builder.query({
      query: (params) => ({
        url: `/api/v1/uam/rack/get_racks_by_site_dropdown`,
        params: { site_name: params.site_name },
      }),
    }),


    fetchVendorNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_vendor_list",
    }),

    fetchFunctionNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_function_list",
    }),

    fetchDeviceTypeNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_device_type_list",
    }),

    fetchPasswordGroupNames: builder.query({
      query: () => "/api/v1/atom/password_group/get_password_group_dropdown",
    }),

    fetchPasswordGroupTypeNames: builder.query({
      query: () => "/api/v1/atom/static_list/get_password_group_type_dropdown",
    }),
  }),
});

export const {
  useFetchSiteNamesQuery,
  useFetchRackNamesQuery,
  useFetchVendorNamesQuery,
  useFetchFunctionNamesQuery,
  useFetchDeviceTypeNamesQuery,
  useFetchPasswordGroupNamesQuery,
  useFetchPasswordGroupTypeNamesQuery,
} = extendedApi;

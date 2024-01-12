import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchDevices: builder.query({
      query: () => "/api/v1/uam/uam_device/get_all_devices",
    }),
   
    deleteDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam_device/delete_devices",
        method: "POST",
        body: data,
      }),
    }),
    // form apis
    addDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam_device/add_device_statically",
        method: "POST",
        body: data,
      }),
    }),
    updateDevice: builder.mutation({
      query: (data) => ({
        url: "/api/v1/uam/uam_device/edit_device",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useFetchDevicesQuery: useFetchRecordsQuery,
  useDeleteDeviceMutation: useDeleteRecordsMutation,
  // form apis
  useAddDeviceMutation: useAddRecordMutation,
  useUpdateDeviceMutation: useUpdateRecordMutation,
} = extendedApi;

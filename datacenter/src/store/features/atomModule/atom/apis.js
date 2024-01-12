import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    //table apis
    fetchAtoms: builder.query({
      query: () => "/api/v1/atom/atom/get_atoms",
    }),

    addAtoms: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_devices",
        method: "POST",
        body: data,
      }),
    }),

    deleteAtoms: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/delete_atom",
        method: "POST",
        body: data,
      }),
    }),

    // form apis
    addAtom: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/add_atom_device",
        method: "POST",
        body: data,
      }),
    }),

    updateAtom: builder.mutation({
      query: (data) => ({
        url: "/api/v1/atom/atom/edit_atom",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchAtomsQuery: useFetchRecordsQuery,
  useAddAtomsMutation: useAddRecordsMutation,
  useDeleteAtomsMutation: useDeleteRecordsMutation,
  // form apis
  useAddAtomMutation: useAddRecordMutation,
  useUpdateAtomMutation: useUpdateRecordMutation,
} = extendedApi;

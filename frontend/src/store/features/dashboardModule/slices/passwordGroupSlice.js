import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const passwordGroupSlice = createSlice({
  name: 'passwordGroup',
  initialState,
  reducers: {
    fetchPasswordGroupRequest: (state) => {
      state.loading = true;
    },
    fetchPasswordGroupSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchPasswordGroupFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // addPasswordGroupSuccess: (state, action) => {
    //   if (state.data) {
    //     state.data = state.data.push(action.payload);
    //   }
    // },
    addPasswordGroupSuccess: (state, action) => {
      const newGroup = action.payload;

      if (Array.isArray(state.data)) {
        state.data.push(newGroup); // Add to existing list
      } else {
        state.data = [newGroup]; // Initialize if data was null or not an array
      }
    },
    editPasswordGroupSuccess: (state, action) => {
      const updatedGroup = action.payload;

      if (Array.isArray(state.data)) {
        state.data = state.data.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );
      }
    },
    deletePasswordGroupSuccess: (state, action) => {
      if (state.data) {
        state.data = state.data.filter((item) => item.id !== action.payload);
      }
    },
  },
});

export const {
  fetchPasswordGroupRequest,
  fetchPasswordGroupSuccess,
  fetchPasswordGroupFailure,
  deletePasswordGroupSuccess,
  addPasswordGroupSuccess,
  editPasswordGroupSuccess,
} = passwordGroupSlice.actions;
export default passwordGroupSlice.reducer;

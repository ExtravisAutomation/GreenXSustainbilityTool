import { createSlice } from '@reduxjs/toolkit';

const userRole = localStorage.getItem('user_role');
const storedModule = localStorage.getItem('selectedModule');

// change the new Dashbaord to Dashbaord if you want to change the module
const initialState = {
  selectedModule:
    storedModule || (userRole === 'superadmin' ? 'Users' : 'New Dashboard'),
};

const SidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
      localStorage.setItem('selectedModule', action.payload);
    },
    resetSelectedModule: (state, action) => {
      const userRole = action.payload;
      state.selectedModule =
        userRole === 'superadmin' ? 'Users' : 'New Dashboard';
    },
  },
});

export const { setSelectedModule, resetSelectedModule } = SidebarSlice.actions;
export default SidebarSlice.reducer;

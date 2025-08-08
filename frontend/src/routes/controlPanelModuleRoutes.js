// routes/controlPanelModuleRoutes.js
import React from 'react';
import ControlPanelLayout from '../containers/controlPanel'; // layout for control panel section
import { Navigate } from 'react-router-dom';
import AllUsers from '../containers/controlPanel/allUsers/AllUsers';
import RoleManagement from '../containers/controlPanel/roleManagement/RoleManagement';
import ViewUser from '../containers/controlPanel/allUsers/ViewUser';

const ControlPanelRoutes = {
  path: 'control-panel',
  element: <ControlPanelLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="all-users" replace />,
    },
    {
      path: 'all-users',
      element: <AllUsers />,
    },
    {
      path: 'roles-management',
      element: <RoleManagement />,
    },
    {
      path: 'view-user/:id',
      element: <ViewUser />,
    },
  ],
};

export default ControlPanelRoutes;

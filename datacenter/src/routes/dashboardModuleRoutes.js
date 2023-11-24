import React from "react";
import DashboardModule from "../containers/dashboardModule"
import Dashboard from "../containers/dashboardModule/dashboard"
import Other from "../containers/dashboardModule/other"
import { Navigate } from "react-router-dom";

const routes = {
  path: "/dashboard_module",
  element: <DashboardModule />,
  children: [
    {
      path: "/dashboard_module", // Set the default path to "atom"
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    // {
    //   path: "other",
    //   element: <Other />,
    // },
//     {
//       path: "password_group",
//       element: <PasswordGroup />,
//     },
  ],
};

export default routes;

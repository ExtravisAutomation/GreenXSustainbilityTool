import React from "react";
import DashboardModule from "../containers/dashboardModule";
import Dashboard from "../containers/dashboardModule/dashboard";
import { Navigate } from "react-router-dom";

const routes = {
  path: "dashboard_module",
  element: <DashboardModule />,
  children: [
    {
      path: "",
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ],
};

export default routes;

import React from "react";
import DashboardModule from "../containers/dashboardModule";
import Dashboard from "../containers/dashboardModule/dashboard";
import Other from "../containers/dashboardModule/other";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "", // Set the default path to "atom"
    element: <Navigate to="" replace />,
  },
  {
    path: "",
    element: <Dashboard />,
  },
];

export default routes;

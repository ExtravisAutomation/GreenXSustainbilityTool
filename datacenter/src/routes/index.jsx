import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import DashboardModuleRoutes from "./dashboardModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import DefaultFallbackUI from "../components/fallbackUI";
import Login from "../containers/login";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="login" replace />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/main_layout",
    element: <MainLayout />,
    children: [
      {
        path: "", // Change the path to an empty string
        element: <Navigate to="dashboard_module" replace />, // Use the updated path
      },
      DashboardModuleRoutes,
      UamModuleRoutes,
    ],
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;

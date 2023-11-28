import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import DashboardModuleRoutes from "./dashboardModuleRoutes"
import DefaultFallbackUI from "../components/fallbackUI";
import Login from "../containers/login"
import Dashboard from "../containers/dashboardModule/dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    // children: [DashboardModuleRoutes,AtomModuleRoutes, UamModuleRoutes],
    errorElement: <DefaultFallbackUI />,
  },
  {
    path: "/dashboard_module/dashboard",
    element: <MainLayout />,
    children: DashboardModuleRoutes
      // AtomModuleRoutes, UamModuleRoutes
    ,
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;

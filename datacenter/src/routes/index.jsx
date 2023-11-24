import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AtomModuleRoutes from "./atomModuleRoutes";
import UamModuleRoutes from "./uamModuleRoutes";
import DashboardModuleRoutes from "./dashboardModuleRoutes"
import DefaultFallbackUI from "../components/fallbackUI";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [DashboardModuleRoutes,AtomModuleRoutes, UamModuleRoutes],
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;

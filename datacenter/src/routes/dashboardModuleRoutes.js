import React from "react";
import DashboardModule from "../containers/dashboardModule";
import Dashboard from "../containers/dashboardModule/dashboard";
import { Navigate } from "react-router-dom";
import InventoryDetail from "../containers/uamModule/inventory/inventoryDetail"
import RedrackDetail from "../containers/uamModule/inventory/redrackDetail"
import GreenrackDetail from "../containers/uamModule/inventory/greenrackDetail"
import BluerackDetail from "../containers/uamModule/inventory/bluerackDetail"
import SiteDetail from "../containers/uamModule/sites/siteDetail";


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
    {
      path: "dashboard/inventorydetail",
      element: <InventoryDetail />,
    },
    {
      path: "dashboard/redrackdetail",
      element: <RedrackDetail />,
    },
    {
      path: "dashboard/greenrackdetail",
      element: <GreenrackDetail />,
    },
    {
      path: "dashboard/bluerackdetail",
      element: <BluerackDetail />,
    },
    {
      path: "dashboard/sitedetail",
      element: <SiteDetail />,
    },
  ],
};

export default routes;

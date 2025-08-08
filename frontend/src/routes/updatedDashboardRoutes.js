import React from 'react';
import { Navigate } from 'react-router-dom';
import UpdatedDashboardModule from '../containers/newDashboard/UpdatedDashboardModule';
import UpdatedDashboard from '../containers/newDashboard/UpdatedDashboard';
import DevicesDetailsTable from '../containers/newDashboard/components/devicesDetails/DevicesDetailsTable';
// import DashboardModule from '../containers/dashboardModule';
// import { Navigate } from 'react-router-dom';
// // import MainDashboard from "../containers/dashboardModule/dashboard";
// import InventoryDetail from '../containers/uamModule/inventory/inventoryDetail';
// import RedrackDetail from '../containers/uamModule/inventory/redrackDetail';
// import GreenrackDetail from '../containers/uamModule/inventory/greenrackDetail';
// import BluerackDetail from '../containers/uamModule/inventory/bluerackDetail';
// import SiteDetail from '../containers/uamModule/sites/siteDetail';
// import Dashboard from '../containers/dashboardModule/dashboard/Dashboard';
// import GraphDetail from '../containers/dashboardModule/dashboard/graphDetail';
// import TopDevicesDetail from '../containers/dashboardModule/dashboard/topDevicesDetail';
// import DeviceSpecificComparison from '../containers/dashboardModule/dashboard/deviceSpecificComparison';
// import Devices from '../containers/uamModule/inventory/devices';
// import Co2EmissionDetails from '../containers/dashboardModule/dashboard/co2EmissionDetail/co2EmissionDetails';
// import DeviceCo2DetailPage from '../containers/dashboardModule/dashboard/pages/deviceCo2Detail';
// import DevicePueDetailPage from '../containers/dashboardModule/dashboard/pages/devicePueDetail';
const updatedDashboardRoutes = {
  path: 'updated_dashboard_module',
  element: <UpdatedDashboardModule />,
  children: [
    {
      path: '',
      element: <Navigate to="updated_dashboard" replace />,
    },
    {
      path: 'updated_dashboard',
      element: <UpdatedDashboard />,
    },
    {
      path: 'updated_dashboard/device_details',
      element: <DevicesDetailsTable />,
    },
    // {
    //   path: 'dashboard/device-pue-detail',
    //   element: <DevicePueDetailPage />,
    // },
    // {
    //   path: 'dashboard/co2-emission-details',
    //   element: <Co2EmissionDetails />,
    // },

    // {
    //   path: 'dashboard/graph-detail/:id',
    //   element: <GraphDetail />,
    // },
    // {
    //   path: 'dashboard/device-detail/:id',
    //   element: <TopDevicesDetail />,
    // },
    // {
    //   path: 'dashboard/device-specific-comparison',
    //   element: <DeviceSpecificComparison />,
    // },
    // {
    //   // sites inventory Details
    //   path: 'dashboard/inventorydetail',
    //   element: <InventoryDetail />,
    // },
    // {
    //   path: 'dashboard/redrackdetail',
    //   element: <RedrackDetail />,
    // },
    // {
    //   path: 'dashboard/greenrackdetail',
    //   element: <GreenrackDetail />,
    // },
    // {
    //   path: 'dashboard/bluerackdetail',
    //   element: <BluerackDetail />,
    // },
    // {
    //   path: 'dashboard/sitedetail',
    //   element: <SiteDetail />,
    // },
  ],
};

export default updatedDashboardRoutes;

import React from 'react';
// import UamModule from '../containers/uamModule';
// import ReportsModule from "../containers/ReportsModule";
import ReportsModule, { ReportsSection } from '../containers/reportsModule';
// import Sites from '../containers/uamModule/sites';
// import ReportLaunchPad from '../containers/reportsModule/ReportLaunchPad';
// import CustomReports from '../containers/reportsModule/customReports';
// import NewReport from '../containers/reportsModule/customReports/newReport';
// import Racks from '../containers/uamModule/racks';
// import Location from '../containers/uamModule/location';
// // import Inventory from "../containers/uamModule/inventory";
// import SchedualeRunResult from '../containers/reportsModule/schedualeResults';
// import Devices from "../containers/uamModule/devices";
// import Boards from '../containers/uamModule/boards';
// import SubBoards from '../containers/uamModule/subBoards';
// import Sfps from '../containers/uamModule/sfps';
// import Licenses from '../containers/uamModule/licences';
// import Aps from '../containers/uamModule/aps';
// import Hwlifecycle from '../containers/uamModule/hwLiveCycle';
// import SiteDetail from '../containers/uamModule/sites/siteDetail';
// import SavedReportsTemplate from '../containers/reportsModule/savedReportsTemplate';
// import RackDetail from '../containers/uamModule/racks/rackDetail';
// import InventoryDetail from '../containers/uamModule/inventory/inventoryDetail';
// import { Navigate } from 'react-router-dom';
// import ScheduleReport from '../containers/reportsModule/customReports/scheduleReport';

const routes = {
  path: 'reports_module',
  element: <ReportsModule />,
  children: [
    {
      index: true, // Set the default path to "atom"
      element: <ReportsSection />,
    },
    // {
    //   path: 'saved-report-templates',
    //   element: <SavedReportsTemplate />,
    // },
    // {
    //   path: 'report-launch-pad',
    //   element: <ReportLaunchPad />,
    // },
    // {
    //   path: "custom-reports",
    //   element: <CustomReports />,
    // },
    // {
    //   path: "custom-reports",
    //   element: <CustomReports />,
    //   children: [
    //     {
    //       path: "", // Set the default path to "atom"
    //       element: <Navigate to="new-report" replace />,
    //     },
    //     {
    //       path: "new-report",
    //       element: <NewReport />,
    //     },
    //     {
    //       path: "schedule-report",
    //       element: <ScheduleReport />,
    //     },
    //   ],
    // },
    // {
    //   path: "scheduled-run-results",
    //   element: <SchedualeRunResult />,
    // },
    // {
    //   path: "sites/sitedetail",
    //   element: <SiteDetail />,
    // },
    // {
    //   path: "racks/rackdetail",
    //   element: <RackDetail />,
    // },
    // {
    //   // Report Modules inventory Details
    //   path: 'inventorydetail',
    //   element: <InventoryDetail />,
    // },
  ],
};

export default routes;

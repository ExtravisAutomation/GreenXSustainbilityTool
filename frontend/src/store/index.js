import { configureStore } from '@reduxjs/toolkit';
import { monetxApi } from './features/apiSlice';
import { dcsApi } from './features/apiSlice';
import atomReducer from './features/atomModule/atom';
import { setupListeners } from '@reduxjs/toolkit/query';
// import passwordGroupReducer from "./features/atomModule/passwordGroup";
import siteReducer from './features/uamModule/sites';
import rackReducer from './features/uamModule/racks';
import locationReducer from './features/uamModule/location';
import inventoryReducer from './features/uamModule/inventory';
import deviceReducer from './features/uamModule/devices';
import boardReducer from './features/uamModule/boards';
import subBoardReducer from './features/uamModule/subBoards';
import sfpsReducer from './features/uamModule/sfps';
import licenseReducer from './features/uamModule/licences';
import apsReducer from './features/uamModule/aps';
import hwLiveCycleReducer from './features/uamModule/hwLiveCycle';
import dropDownsReducer from './features/dropDowns';
// ===============
import sitesReducer from './features/uamModule/sites/slices/sitesSlice';
import racksReducer from './features/uamModule/racks/slices/racksSlice';

// ======
import metricsChartReducer from './features/dashboardModule/slices/metricsChartSlice';
import kpiReducer from './features/dashboardModule/slices/kpiClickSlice';
import metricsReducer from './features/dashboardModule/slices/powerMetricsClickSlice';
import piReducer from './features/dashboardModule/slices/piChartSlice';
import kpiChartReducer from './features/dashboardModule/slices/kpiChartSlice';
import deviceSpecificChartReducer from './features/dashboardModule/slices/deviceSpecificChartSlice';
import trafficThroughputReducer from './features/dashboardModule/slices/trafficThroughputSlice';
import trafficThroughputClickReducer from './features/dashboardModule/slices/trafficThroughputClickSlice';
import topDevicesPowerCostReducer from './features/dashboardModule/slices/topDevicesPowerCostSlice';
import topDevicesPowerCostClickReducer from './features/dashboardModule/slices/topDevicesClickSlice';
// import savedReportsReducer from "./features/reportModule/slices/savedreportsSlice";
import addReportReducer from './features/reportModule/slices/addReportsSlice';
import devicesReducer from './features/dashboardModule/slices/devicesSlice';
import passwordGroupReducer from './features/dashboardModule/slices/passwordGroupSlice';
import hmRackReducer from './features/dashboardModule/slices/hmRackClickSlice';
import siteIdReducer from './features/dashboardModule/slices/siteIdSlice';
import devicesComparisonReducer from './features/dashboardModule/slices/comparison/devicesComparisonSlice';
import throughputComparisonReducer from './features/dashboardModule/slices/comparison/comparisonThrouputSlice';
import pseComparisonReducer from './features/dashboardModule/slices/comparison/pseSlice';
import vmSReducer from './features/vmModule/vm/slices/vmSlice';
import hostReducer from './features/vmModule/host/slices/hostSlice';
import electricityMapPiReducer from './features/dashboardModule/slices/electricityMapPiSlice';
import electricityMapReducer from './features/dashboardModule/slices/electricityMapSlice';
import carbonEmissionReducer from './features/dashboardModule/slices/electricityMapPiSlice';
import rootReducer from './features/dashboardModule/slices/electricityMapPiSlice';
// reports

import savedReportReducer from './features/reportModule/slices/savedReports/slice';
import notificationReducer from './features/notificationslice';
import sidebarReducer from './features/sidebarMenu/SidebarSlice';
// ========
// new Dashboard(updated Dashboard)

import energyTrendsReducer from './features/newDashboard/slices/energyTrafficTrendsSlice';
import topFiveDevicesReducer from './features/newDashboard/slices/topFiveDevicesSlice';
import co2PcrDevicesReducer from './features/newDashboard/slices/co2PcrDevicesDataSlice';
export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    atom: atomReducer,
    password_group: passwordGroupReducer,
    site: siteReducer,
    rack: rackReducer,
    location: locationReducer,
    inventory: inventoryReducer,
    device: deviceReducer,
    board: boardReducer,
    sub_board: subBoardReducer,
    sfps: sfpsReducer,
    license: licenseReducer,
    aps: apsReducer,
    hwlivecycle: hwLiveCycleReducer,
    drop_downs: dropDownsReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
    [dcsApi.reducerPath]: dcsApi.reducer,
    sites: sitesReducer,
    racks: racksReducer,

    kpi: kpiReducer,
    metrics: metricsReducer,
    pi: piReducer,
    kpiChartData: kpiChartReducer,
    deviceSpecificData: deviceSpecificChartReducer,
    metricsChartData: metricsChartReducer,
    savedReportsData: savedReportReducer,
    addReportData: addReportReducer,
    trafficThroughPutChartData: trafficThroughputReducer,
    topDevicesPowerCostData: topDevicesPowerCostReducer,
    topDevicesPowerCostClickData: topDevicesPowerCostClickReducer,
    trafficThroughPutDetail: trafficThroughputClickReducer,
    devices: devicesReducer,
    hmRackDetail: hmRackReducer,
    siteId: siteIdReducer,
    comparedDevicesData: devicesComparisonReducer,
    comparedThroughputData: throughputComparisonReducer,
    comparedPseData: pseComparisonReducer,
    electricityMapPiData: electricityMapPiReducer,
    electricityMapData: electricityMapReducer,
    carbonEmissionData: carbonEmissionReducer,
    // vmModule
    vmsData: vmSReducer,
    hostsData: hostReducer,
    notification: notificationReducer,
    // New Dashboard (updated)
    energyTrends: energyTrendsReducer,
    topFiveDevices: topFiveDevicesReducer,
    co2PcrDevices: co2PcrDevicesReducer,
  },

  // middleware: (getDefaultMiddleware) =>
  //   // getDefaultMiddleware().concat(monetxApi.middleware),
  //   getDefaultMiddleware().concat(dcsApi.middleware),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware, dcsApi.middleware),
});
setupListeners(store.dispatch);

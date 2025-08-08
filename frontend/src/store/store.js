import { configureStore } from '@reduxjs/toolkit';
import kpiReducer from './features/dashboardModule/slices/kpiClickSlice';
import metricsReducer from './features/dashboardModule/slices/powerMetricsClickSlice';
import piReducer from './features/dashboardModule/slices/piChartSlice';
import kpiChartReducer from './features/dashboardModule/slices/kpiChartSlice';
import deviceSpecificChartReducer from './features/dashboardModule/slices/deviceSpecificChartSlice';
import sidebarReducer from './features/sidebarMenu/SidebarSlice';

const store2 = configureStore({
  reducer: {
    kpi: kpiReducer,
    metrics: metricsReducer,
    pi: piReducer,
    kpiChartData: kpiChartReducer,
    deviceSpecificData: deviceSpecificChartReducer,
    sidebar: sidebarReducer,
  },
});

export default store2;

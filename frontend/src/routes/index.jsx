import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/mainLayout';
// import DashboardModuleRoutes from "./dashboardModuleRoutes";
import AdminDashboardModuleRoutes from './adminModuleRoutes';

import NewDashboardModuleRoutes from './newDashboardModuleRoutes';
import UamModuleRoutes from './uamModuleRoutes';

import ReportsModuleRoutes from './reportsModuleRoutes';
import AdminModuleRoutes from './adminModuleRoutes';

import DefaultFallbackUI from '../components/fallbackUI';
import Login from '../containers/login';
import SignUp from '../containers/signUp';

import { Navigate } from 'react-router-dom';
import OnBoardingDevices from '../containers/onboardingDevices/devices';
import Devices from '../containers/onboardingDevices/devices/devices';
import PasswordGroup from '../containers/onboardingDevices/devices/passwordGroup';
import About from '../containers/about';
import TourModule from '../containers/tour';
import Members from '../containers/admin/members';
import AiEngin from '../containers/aiEngine';
import DashboardInventory from '../containers/uamModule/dashboard';
import Users from '../containers/users';
import LandingPageLayout from '../pages/public/LandingPage';
import { FEATURE_FLAGS } from '../utils/featureFlags';
import { AboutUsPage, HomePage, SolutionPage } from '../containers/landingPage';
import ControlPanelRoutes from './controlPanelModuleRoutes';
import PueModule from '../containers/pueModule/PueModule';
import NewDashboard from '../containers/newDashboard/UpdatedDashboard';
import DevicesDetailsTable from '../containers/newDashboard/components/devicesDetails/DevicesDetailsTable';
import updatedDashboardRoutes from './updatedDashboardRoutes';

const loginData = JSON.parse(localStorage.getItem('loginData'));
// console.log(loginData, "login data in routes");
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Navigate
        to={FEATURE_FLAGS.LANDING_PAGE ? '/landingpage' : '/login'}
        replace
      />
    ),
  },
  {
    path: 'landingpage',
    element: <LandingPageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'aboutus', element: <AboutUsPage /> },
      { path: 'solution', element: <SolutionPage /> },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'sign-up',
    element: <SignUp />,
  },

  {
    path: '/main_layout',
    element: <MainLayout />,
    children:
      // loginData?.user_info.is_superuser === false
      //   ?
      [
        // Old before cPanel
        // {
        //   path: '',
        //   element: <Navigate to="dashboard_module" replace />,
        // },
        {
          path: '',
          element: (
            <Navigate
              to={
                loginData?.user_info?.user_role === 'superadmin'
                  ? 'control-panel'
                  : 'updated-dashboard'
                // : 'new-dashboard'
              }
              replace
            />
          ),
        },

        // {
        //   path: "",
        //   element: <Navigate to="admin-dashboard" replace />,
        // },

        // DashboardModuleRoutes,
        // AdminDashboardModuleRoutes,
        NewDashboardModuleRoutes,
        UamModuleRoutes,
        ReportsModuleRoutes,
        AdminModuleRoutes,
        ControlPanelRoutes,
        updatedDashboardRoutes,

        {
          path: 'inventoy-dashboard',
          element: <DashboardInventory />,
        },

        {
          path: 'onboarding-devices',
          element: <OnBoardingDevices />,
          children: [
            {
              path: '',
              element: <Navigate to="devices" replace />,
            },
            {
              path: 'devices',
              element: <Devices />,
            },
            {
              path: 'password-group',
              element: <PasswordGroup />,
            },
          ],
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: 'members',
          element: <Members />,
        },
        {
          path: 'users',
          element: <Users />,
        },
        {
          path: 'AI-Engine',
          element: <AiEngin />,
        },
        {
          path: 'tour-module',
          element: <TourModule />,
        },
        {
          path: 'pue-calculator',
          element: <PueModule />,
        },
        // {
        //   path: 'new-dashboard',
        //   element: <NewDashboard />,
        // },
      ],
    // : [

    //     {
    //       path: "",
    //       element: <Navigate to="admin-dashboard" replace />,
    //     },

    //     AdminModuleRoutes,
    //   ]
    errorElement: <DefaultFallbackUI />,
  },
]);

export default router;

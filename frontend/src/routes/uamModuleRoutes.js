import React from 'react';
import UamModule from '../containers/uamModule';
import Sites from '../containers/uamModule/sites';
import Racks from '../containers/uamModule/racks';
import Location from '../containers/uamModule/location';
import Inventory from '../containers/uamModule/inventory';
import Inventory2 from '../containers/uamModule/inventory2/index';

// import Devices from "../containers/uamModule/devices";

import Boards from '../containers/uamModule/boards';
import SubBoards from '../containers/uamModule/subBoards';
import Sfps from '../containers/uamModule/sfps';
import Licenses from '../containers/uamModule/licences';
import Aps from '../containers/uamModule/aps';
import Hwlifecycle from '../containers/uamModule/hwLiveCycle';
import SiteDetail from '../containers/uamModule/sites/siteDetail';
import RackDetail from '../containers/uamModule/racks/rackDetail';
import InventoryDetail from '../containers/uamModule/inventory/inventoryDetail';
import Devices from '../containers/uamModule/inventory/devices';
import Devicess from '../containers/uamModule/inventory/devices/devices';
import PasswordGroup from '../containers/uamModule/inventory/devices/passwordGroup';
import Fan from '../containers/uamModule/inventory/fan';
import Power from '../containers/uamModule/inventory/power';
import Chasis from '../containers/uamModule/inventory/chasis';
import Module from '../containers/uamModule/inventory/module';
import { Navigate } from 'react-router-dom';
import Cisco from '../containers/uamModule/inventory2/cisco';
import NonCisco from '../containers/uamModule/inventory2/nonCisco';
import DashboardInventory from '../containers/uamModule/dashboard';

const routes = {
  path: 'uam_module',
  element: <UamModule />,
  children: [
    {
      path: '',
      element: <Navigate to="dashboard" replace />,
    },

    {
      path: 'sites',
      element: <Sites />,
    },
    {
      path: 'racks',
      element: <Racks />,
    },
    {
      path: 'location',
      element: <Location />,
    },
    {
      path: 'inventory',
      element: <Inventory />,
    },
    {
      path: 'inventory2',
      element: <Inventory2 />,

      children: [
        {
          path: '',
          element: <Navigate to="cisco" replace />,
        },
        {
          path: 'cisco',
          element: <Cisco />,
        },
        {
          path: 'non-cisco',
          element: <NonCisco />,
        },
      ],
    },
    {
      path: 'devices',
      element: <Inventory />,
      children: [
        {
          path: '',
          element: <Navigate to="devices" replace />,
        },
        {
          path: 'chassis',
          element: <Chasis />,
        },
        {
          path: 'module',
          element: <Module />,
        },
        {
          path: 'fan',
          element: <Fan />,
        },
        {
          path: 'devices',
          element: <Devices />,
          children: [
            {
              path: '',
              element: <Navigate to="devices" replace />,
            },

            {
              path: 'devices',
              element: <Devicess />,
            },
            {
              path: 'password-group',
              element: <PasswordGroup />,
            },
          ],
        },
        {
          path: 'power',
          element: <Power />,
        },
      ],
    },
    {
      path: 'sites/sitedetail',
      element: <SiteDetail />,
    },
    {
      path: 'racks/rackdetail',
      element: <RackDetail />,
    },
    {
      // OnBoarding Devices inventory Details
      path: 'devices/devices/inventorydetail',
      element: <InventoryDetail />,
    },
  ],
};

export default routes;

import React from "react";
import UamModule from "../containers/uamModule";
import Sites from "../containers/uamModule/sites";
import Racks from "../containers/uamModule/racks";
import Location from "../containers/uamModule/location"
import Inventory from "../containers/uamModule/inventory";
import Devices from "../containers/uamModule/devices";
import Boards from "../containers/uamModule/boards";
import SubBoards from "../containers/uamModule/subBoards"
import Sfps from "../containers/uamModule/sfps";
import Licenses from "../containers/uamModule/licences";
import Aps from "../containers/uamModule/aps";
import Hwlifecycle from "../containers/uamModule/hwLiveCycle";
import { Navigate } from "react-router-dom";

const routes = {
  path: "uam_module",
  element: <UamModule />,
  children: [
    {
      path: "/uam_module", // Set the default path to "atom"
      element: <Navigate to="sites" replace />,
    },
    {
      path: "sites",
      element: <Sites />,
    },
    {
      path: "racks",
      element: <Racks />,
    },
    {
      path: "location",
      element: <Location />,
    },
   {
    path:"inventory",
    element:<Inventory/>,
   }
    // {
    //   path: "boards",
    //   element: <Boards />,
    // },
    // {
    //   path: "sub_boards",
    //   element: <SubBoards />,
    // },
    // {
    //   path: "sfps",
    //   element: <Sfps />,
    // },
    // {
    //   path: "licenses",
    //   element: <Licenses />,
    // },
    // {
    //   path: "aps",
    //   element: <Aps />,
    // },
    // {
    //   path: "hw_lifecycle",
    //   element: <Hwlifecycle />,
    // },
  ],
};

export default routes;

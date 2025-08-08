import React from "react";
import AdminModule from "../containers/adminModule";
import AdminDashboard from "../containers/adminModule";
import Hosts from "../containers/adminModule/hosts";
import HostDetails from "../containers/adminModule/hosts/hostDetails";
import VirtualMachines from "../containers/adminModule/virtualMachines";
import Roles from "../containers/adminModule/roles";
import VmDetails from "../containers/adminModule/virtualMachines/vmDetails";
// import Atom from "../containers/atomModule/atom";
// import PasswordGroup from "../containers/atomModule/passwordGroup";
import { Navigate } from "react-router-dom";

const routes = {
  path: "admin-dashboard",
  element: <AdminDashboard />,

  children: [
    {
      path: "",
      element: <Navigate to="hosts" replace />,
    },
    {
      path: "hosts",
      element: <Hosts />,
    },

    {
      path: "hosts/host-details",
      element: <HostDetails />,
    },

    {
      path: "virtual-machines",
      element: <VirtualMachines />,
    },
    {
      path: "virtual-machines/vm-details",
      element: <VmDetails />,
    },

    {
      path: "roles",
      element: <Roles />,
    },
  ],
};

export default routes;

import React from "react";
import AdminModule from "../containers/adminModule";
import Atom from "../containers/atomModule/atom";
import PasswordGroup from "../containers/atomModule/passwordGroup";
import { Navigate } from "react-router-dom";

const routes = {
  path: "admin_module",
  element: <AdminModule />,
  children: [
    {
      path: "/admin_module", // Set the default path to "atom"
      element: <Navigate to="" replace />,
    },
    {
      path: "atom",
      element: <Atom />,
    },
    {
      path: "password_group",
      element: <PasswordGroup />,
    },
  ],
};

export default routes;

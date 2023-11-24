import React from "react";
import AtomModule from "../containers/atomModule";
import Atom from "../containers/atomModule/atom";
import PasswordGroup from "../containers/atomModule/passwordGroup";
import { Navigate } from "react-router-dom";

const routes = {
  path: "atom_module",
  element: <AtomModule />,
  children: [
    {
      path: "/atom_module", // Set the default path to "atom"
      element: <Navigate to="atom" replace />,
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

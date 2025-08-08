import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "dashboard", name: "Dashboard", path: "dashboard" },
  // { id: "adminDashboard", name: "Admin Dashboard", path: "admin-dashboard" },
];

function Index(props) {
  return (
    <>
      {/* <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage="dashboard" />
      </Card> */}
      <Outlet />
    </>
  );
}

export default Index;

import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "dashboard", name: "Dashboard", path: "dashboard" },
  // { id: "other", name: "other", path: "other" },
];

function Index(props) {
  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage="dashboard" />
      </Card>
      <Outlet />
      
    </>
  );
}

export default Index;

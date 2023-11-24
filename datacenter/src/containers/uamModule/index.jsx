import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "sites", name: "Sites", path: "sites" },
  { id: "racks", name: "Racks", path: "racks" },
  { id: "location", name: "Location", path: "location" },
  { id: "inventory", name: "Inventory", path: "inventory" },
 
];

function Index(props) {
  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
          boxShadow: "unset !important",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage="sites" />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;

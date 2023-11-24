import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "atom", name: "Data Center Sustainability", path: "atom" },
  { id: "password_group", name: "Password Group", path: "password_group" },
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
        <HorizontalMenu menuItems={menuItems} defaultPage="atom" />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;

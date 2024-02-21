import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import { Button } from "@mui/material";
import { Modal } from "antd";
import { Icon } from "@iconify/react";
import CustomForm from "../../components/customForm";
import axios from "axios";
import { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";

const menuItems = [
  { id: "sites", name: "Sites", path: "sites" },
  { id: "racks", name: "Racks", path: "racks" },
  // { id: "location", name: "Location", path: "location" },
  { id: "seeds", name: "Seeds", path: "inventory" },
];

const access_token = localStorage.getItem("access_token");
console.log(access_token, "access toke");
function Index(props) {
  // const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const showModal = () => {
  //   setOpen(true);
  // };
  // const handleOk = async (values) => {
  //   console.log(values, "values in modal");
  //   setLoading(true);
  //   setOpen(false);
  //   const res = await axios.post(baseUrl + "/sites/addsite", values, {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //   });
  //   if (res.status == "200") {
  //     Swal.fire({
  //       title: res.data.message,
  //       icon: "success",
  //       confirmButtonText: "OK",
  //       timer: 2000,
  //       timerProgressBar: true,
  //       onClose: () => {
  //         console.log("Popup closed");
  //       },
  //     });
  //   }
  //   console.log(res, "response");
  //   // setTimeout(() => {
  //   //   setLoading(false);
  //   //   setOpen(false);
  //   // }, 1000);
  // };

  // const handleCancel = (e) => {
  //   console.log(e);
  //   setOpen(false);
  // };
  return (
    <>
      {/* <Modal
        width={650}
        style={{ color: "white" }}
        open={open}
        title={<h3 style={{ color: "white" }}>Add Site</h3>}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<CustomCloseIcon />}
        footer={false}
      >
        <CustomForm submit={handleOk} />
      </Modal> */}
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
          boxShadow: "unset !important",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HorizontalMenu menuItems={menuItems} defaultPage="sites" />

          {/* <Button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "#0490E7",
              color: "white",
              fontSize: "14px",
              padding: "0px 10px 0px 10px",
              height: "33px",
            }}
            onClick={showModal}
          >
            <Icon icon="lucide:plus" />
            <p
              style={{
                marginBottom: "0px",
                marginTop: "0px",
                textTransform: "capitalize",
              }}
            >
              Add Site
            </p>
          </Button> */}
        </div>
      </Card>
      <Outlet />
    </>
  );
}

const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);

export default Index;

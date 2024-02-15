import React, { useEffect, useState } from "react";
import CustomForm from "../../../components/customForm";
import CustomFormRacks from "./form";
import { Icon } from "@iconify/react";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import { Modal } from "antd";
import dayjs from "dayjs";
const access_token = localStorage.getItem("access_token");
console.log(access_token, "access toke");
const CustomModalRacks = ({ handleClose, open, recordToEdit, fetchRacks }) => {
  //   const [open, setOpen] = useState(false);

  const handleOk = async (values) => {
    console.log(values, "values in modal");
    // setLoading(true);
    // setOpen(false);
    values.manufacture_date = dayjs(values.manufacture_date).format(
      "YYYY-MM-DD"
    );
    values.site_id = Number(values.site_id);
    values.unit_position = Number(values.unit_position);
    values.Ru = Number(values.Ru);
    values.Height = Number(values.Height);
    values.Width = Number(values.Width);
    values.Depth = Number(values.Depth);
    values.floor = Number(values.floor);
    values.total_devices = Number(values.total_devices);

    const res = await axios.post(baseUrl + "/racks/addrack", values, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res.status == "200") {
      handleCancel();

      Swal.fire({
        title: res.data.message,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        onClose: () => {
          console.log("Popup closed");
        },
      });
      fetchRacks();
    }
    console.log(res, "response");
  };

  const handleCancel = (e) => {
    console.log(e);
    handleClose();
  };
  return (
    <Modal
      width={"auto"}
      style={{ color: "white" }}
      open={open}
      title={
        <h3 style={{ color: "white" }}>
          {recordToEdit ? "Update Rack" : "Add Rack"}
        </h3>
      }
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CustomCloseIcon />}
      footer={false}
    >
      <CustomFormRacks
        onCancel={handleCancel}
        submit={handleOk}
        recordToEdit={recordToEdit}
        fetchRacks={fetchRacks}
      />
    </Modal>
  );
};

export default CustomModalRacks;
const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);

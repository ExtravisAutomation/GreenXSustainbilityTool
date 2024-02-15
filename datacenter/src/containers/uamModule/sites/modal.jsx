import React, { useEffect, useState } from "react";
import CustomForm from "../../../components/customForm";
import { Icon } from "@iconify/react";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import { Modal } from "antd";

const access_token = localStorage.getItem("access_token");
console.log(access_token, "access toke");
const CustomModal = ({
  handleClose,
  open,
  recordToEdit,
  fetchSites,
  fetchRacks,
}) => {
  //   const [open, setOpen] = useState(false);

  const handleOk = async (values) => {
    console.log(values, "values in modal");
    values.total_devices = 60;

    const res = await axios.post(baseUrl + "/sites/addsite", values, {
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
      fetchSites();
    }
    console.log(res, "response");
  };

  const handleCancel = (e) => {
    console.log(e);
    // setOpen(false);
    handleClose();
  };
  return (
    <Modal
      width={650}
      style={{ color: "white" }}
      open={open}
      title={
        <h3 style={{ color: "white" }}>
          {recordToEdit ? "Update Site" : "Add Site"}
        </h3>
      }
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CustomCloseIcon />}
      footer={false}
    >
      <CustomForm
        onCancel={handleCancel}
        submit={handleOk}
        recordToEdit={recordToEdit}
        fetchSites={fetchSites}
        fetchRacks={fetchRacks}
      />
    </Modal>
  );
};

export default CustomModal;
const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);

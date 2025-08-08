import styled from "styled-components";
import React from "react";
import CustomForm from "../../../components/customForm";
import { createSiteAsync } from "../../../store/features/uamModule/sites/slices/sitesSlice";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";

const access_token = localStorage.getItem("access_token");

const CustomModal = ({
  handleClose,
  open,
  recordToEdit,
  fetchSites,
  fetchRacks,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const StyledModal = styled(Modal)`
    width: 650px !important;
    color: white;
    top: 20px;

    .ant-modal {
      border-radius: 10px !important;
    }

    .ant-modal-header {
      background-color: transparent !important;
    }

    .ant-modal-content {
      background-color: ${theme?.palette?.default_card?.background} !important;
      border-radius: 10px !important;
    }

    .tour_modal .ant-modal-content {
      background-color: ${theme?.palette?.default_card?.background} !important;
      backdrop-filter: blur(10.4px) !important;
      -webkit-backdrop-filter: blur(10.4px) !important;
    }

    .pdf_file_modal .ant-modal-content {
      background-color: white !important;
      padding: 50px !important;
    }
  `;

  const CustomCloseIcon = styled.span`
    color: red;
    font-size: 25px;
  `;
  const handleOk = (values) => {
    try {
      dispatch(createSiteAsync(values));
      Swal.fire({
        title: "Site added successfully",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        onClose: () => {
          console.log("Popup closed");
        },
        // customClass: {
        //   container: "custom-swal-container",
        //   title: "custom-swal-title",
        //   confirmButton: "custom-swal-button",
        // },
        // add site modal inventory page
        customClass: {
          container: theme?.mode =="light"? "custom-swal-container" : "custom-swal-container-dark",
          title: "custom-swal-title",
          confirmButton: theme?.name?.includes('Purple')?"custom-swal-button-purple":theme?.name?.includes('Green')?"custom-swal-button-green":"custom-swal-button-blue" ,
        },
      });
      setTimeout(() => {
        fetchSites();
      }, 1000);
      handleCancel();
    } catch (error) {
      console.error("Error adding site:", error.message);
    }
  };

  const handleCancel = (e) => {
    console.log(e);
    handleClose();
  };

  return (
    <StyledModal
      open={open}
      title={
        <h3 style={{ color: theme?.palette?.default_card?.color }}>
          {recordToEdit ? "Update Site" : "Add Site"}
        </h3>
      }
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={
        <CustomCloseIcon>
          <Icon icon="material-symbols:close" />
        </CustomCloseIcon>
      }
      footer={false}
    >
      <CustomForm
        onCancel={handleCancel}
        submit={handleOk}
        recordToEdit={recordToEdit}
        fetchSites={fetchSites}
        fetchRacks={fetchRacks}
      />
    </StyledModal>
  );
};

export default CustomModal;

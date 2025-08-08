import React, { useState } from "react";
import { Modal } from "antd";
import { useTheme } from "@mui/material/styles";

import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  UserOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import SiteTour from "./tour";
import TourModule from ".";
const TourModal = ({ modalTour, setModalTour }) => {
  const theme = useTheme();

  return (
    <Modal
      // className="tour_modal"
      title={
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            color: "#FFFFFF",
            background: theme?.palette?.main_layout?.background,

            fontWeight: 700,
          }}
        >
          DC Sustainability Admin / User Guide
        </div>
      }
      width={"87%"}
      style={{
        top: 0,
        // width: 200,
      }}
      // centered
      open={modalTour}
      onOk={() => setModalTour(false)}
      onCancel={() => setModalTour(false)}
      footer={null}
      closeIcon={<CloseOutlined style={{ color: "gray" }} />}
    >
      <TourModule setModalTour={setModalTour} />
    </Modal>
  );
};

export default TourModal;

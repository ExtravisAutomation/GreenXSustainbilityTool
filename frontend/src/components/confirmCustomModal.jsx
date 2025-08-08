import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { AiOutlineLogout } from 'react-icons/ai';
import { useTheme } from '@mui/material/styles';

const { confirm } = Modal;

const ConfirmCustomModal = () => {
  const theme = useTheme();
  const CustomModalContent = styled.div`
    .ant-modal-content {
      backgroundcolor: ${theme?.palette?.graph?.toolTip_bg} !important;
      border: 1px solid ${theme?.palette?.graph?.tooltip_border};
      border-radius: 10px !important;
    }

    .ant-modal-header {
      background-color: #1f2c37 !important;
      border-bottom: none;
    }

    .ant-modal-title {
      color: #f0f0f0;
    }

    .ant-modal-footer {
      background-color: #1f2c37;
      border-top: none;
    }

    .ant-btn-primary {
      background-color: #1890ff;
      border-color: #1890ff;
    }

    .ant-btn-default {
      background-color: #3a4b59;
      border-color: #3a4b59;
      color: #f0f0f0;
    }
  `;
  const showCustomModal = () => {
    confirm({
      title: (
        <span style={{ color: 'gray' }}>Are you sure you want to log out?</span>
      ),
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: (
        <span style={{ color: 'gray' }}>
          Logging out will end your current session. Are you sure you want to
          proceed?
        </span>
      ),
      okText: 'Yes',
      cancelText: 'No',
      okType: 'primary',
      onOk() {
        // Your logout logic here
        console.log('Logged out');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  return (
    <CustomModalContent>
      <div
        onClick={showCustomModal}
        style={{
          color: '#a64629',
          background: theme?.palette?.page_header?.icons_bg,
          padding: '10px',
          borderRadius: '100%',
          width: '20px',
          height: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          // marginRight: "15px",
        }}
      >
        <AiOutlineLogout />
      </div>
    </CustomModalContent>
  );
};

export default ConfirmCustomModal;

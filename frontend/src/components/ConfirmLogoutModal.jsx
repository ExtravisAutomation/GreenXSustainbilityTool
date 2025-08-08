// ConfirmLogoutModal.jsx
import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@mui/material';

// Styled modal with custom background and text color
// const StyledModal = styled(Modal)`
//   .ant-modal-content .ant-modal-header {
//     background-color: ${({ theme }) =>
//       theme?.palette?.default_card?.background};
//     color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
//   }

//   .ant-modal-footer {
//     display: flex;
//     justify-content: flex-end;
//     gap: 10px;
//   }
// `;
const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
    border: 1px solid ${({ theme }) => theme?.palette?.default_card?.border};
  }

  .ant-modal-header {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-title {
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-body {
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
  }
`;

const ConfirmLogoutModal = ({
  isOpen,
  onCancel,
  onLogout,
  content,
  isDelete = false,
}) => {
  const theme = useTheme();
  return (
    <StyledModal
      theme={theme}
      title={content ? content.title : 'Are you sure you want to log-out?'}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button
          key="no"
          style={{
            background: theme?.palette?.available_options?.card_bg,
            color: theme?.palette?.main_layout?.primary_text,
            border: 'none',
            outline: 'none',
          }}
          onClick={onCancel}
        >
          No
        </Button>,
        <Button key="logout" type="primary" danger onClick={onLogout}>
          {isDelete ? 'Delete' : 'Logout'}
        </Button>,
      ]}
    >
      <span style={{ color: 'gray' }}>
        {isDelete
          ? content.text
          : ' Logging out will end your current session. Are you sure you want to proceed'}
      </span>
    </StyledModal>
  );
};

export default ConfirmLogoutModal;

// SubscriptionModal.jsx
import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled modal with theme-aware colors
const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
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
`;

// Flex wrapper for buttons
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const SubscriptionModal = ({ open, onClose, theme, handleClick }) => {
  const navigate = useNavigate();

  return (
    <StyledModal
      theme={theme}
      title="The module is a premium feature."
      centered
      open={open}
      footer={null}
      onCancel={onClose}
    >
      <p style={{ color: theme?.palette?.default_table?.header_text }}>
        If you have questions about pricing or want to enable this module for
        your account, contact our support team at{' '}
        <a style={{ marginLeft: '6px' }} href="mailto:support@extravis.co">
          {' '}
          support@extravis.co
        </a>
        .
      </p>

      <ButtonWrapper>
        <Button type="primary" onClick={() => handleClick()}>
          Contact Support
        </Button>

        <Button
          onClick={() => {
            onClose();
            navigate(-1);
          }}
          danger
          type="primary"
        >
          Cancel
        </Button>
      </ButtonWrapper>
    </StyledModal>
  );
};

export default SubscriptionModal;

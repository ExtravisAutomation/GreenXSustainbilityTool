import React, { useContext, useEffect, useState } from 'react';
import pueCalculatorImg from '../../resources/images/pue-cal-blur.png';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { restrictedRoutes } from '../../routes/restrictedRoutes';
import { Button, Modal } from 'antd';
import { useTheme } from '@mui/material';
import SubscriptionModal from '../../components/SubscriptionModal';

const ImageWrapper = styled.div`
  max-height: 100vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  background: black; /* mimic dark editor bg */
  padding: 20px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* mimic scrolling */
  scrollbar-width: thin;
  scrollbar-color: #888 #1e1e1e;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const BlurredOverlay = styled.div`
  filter: blur(5px);
  pointer-events: none;
`;
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
const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
function PueModule() {
  const theme = useTheme();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [restricted, setRestricted] = useState(false);

  const handleClick = () => {
    window.location.href = 'https://extravis.co/contact-us/';
    // window.location.href = 'mailto:support@extravis.co';
  };

  useEffect(() => {
    if (restrictedRoutes.includes(location.pathname)) {
      setRestricted(true);
      setModalOpen(true);
    }
  }, [location.pathname]);

  return (
    <ImageWrapper>
      {restricted ? (
        <BlurredOverlay>
          <img src={pueCalculatorImg} alt="PUE Code" />
        </BlurredOverlay>
      ) : (
        <img src={pueCalculatorImg} alt="PUE Code" />
      )}
      {/* <StyledModal
        theme={theme}
        title="The module is a premium feature."
        centered
        open={modalOpen} // `visible` is deprecated, use `open`
        footer={null}
        onCancel={() => setModalOpen(false)}
      >
        

        <p style={{ color: theme?.palette?.default_table?.header_text }}>
          If you have questions about pricing or want to enable this module for
          your account, click the button below to contact our support team.
        </p>
        <ButtonWrapper>
          <Button type="primary"> Contact Support</Button>
          <Button
            onClick={() => {
              setModalOpen(false);
              navigate(-1);
            }}
            danger
            type="primary"
          >
            {' '}
            Cancel
          </Button>
        </ButtonWrapper>
      </StyledModal> */}
      <SubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        handleClick={handleClick}
        theme={theme}
      />
    </ImageWrapper>
  );
}

export default PueModule;

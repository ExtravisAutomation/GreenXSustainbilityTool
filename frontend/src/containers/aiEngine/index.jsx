import React, { useContext, useEffect, useState } from 'react';
import aiEngineImg from '../../resources/images/engine.png';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { restrictedRoutes } from '../../routes/restrictedRoutes';
import { Button, Modal } from 'antd';
import SubscriptionModal from '../../components/SubscriptionModal';
import { useTheme } from '@mui/material';

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

function AiEngin() {
  const theme = useTheme();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [restricted, setRestricted] = useState(false);

  const handleClick = () => {
    alert('Subscribed');
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
          <img src={aiEngineImg} alt="PUE Code" />
        </BlurredOverlay>
      ) : (
        <img src={aiEngineImg} alt="PUE Code" />
      )}
      <SubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        handleClick={handleClick}
        theme={theme}
      />
    </ImageWrapper>
  );
}

export default AiEngin;

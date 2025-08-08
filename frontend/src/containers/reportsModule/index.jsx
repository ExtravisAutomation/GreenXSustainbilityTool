import { FEATURE_FLAGS } from '../../utils/featureFlags';

// For blur images:
import React, { useContext, useEffect, useState } from 'react';
import reportImg from '../../resources/images/report.png';
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

const menuItems = [
  // {
  //   id: "Report Launch Pad",
  //   name: "Report Launch Pad",
  //   path: "report-launch-pad",
  // },
  { id: 'custom-reports', name: 'Reports', path: '' },

  // {
  //   id: "scheduled-run-results",
  //   name: "Scheduled Reports",
  //   path: "scheduled-run-results",
  // },
  {
    id: 'saved-report',
    name: 'View Reports ',
    path: 'saved-report-templates',
  },
];

function Index(props) {
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
    // <div style={{ position: 'relative' }}>
    //   {isMenuVisible ? (
    //     <Card
    //       sx={{
    //         marginBottom: '10px',
    //         // height: '50px',
    //         boxShadow: 'unset !important',
    //       }}
    //     >

    //       <SubHorizontalMenu menuItems={menuItems} />
    //     </Card>
    //   ) : (
    //     <BackButton style={{ margin: '15px 15px 0px 20px' }} />
    //   )}
    //   {/* <Card
    //     sx={{
    //       marginBottom: '10px',
    //       height: '50px',
    //       boxShadow: 'unset !important',
    //     }}
    //   >
    //     <HorizontalMenu menuItems={menuItems} />{' '}
    //   </Card> */}
    //   {/* <HorizontalSubTabs tabs={tabs} /> */}
    //   <Outlet />
    // </div>
    <ImageWrapper>
      {restricted ? (
        <BlurredOverlay>
          <img src={reportImg} alt="Report Code" />
        </BlurredOverlay>
      ) : (
        <img src={reportImg} alt="Report Code" />
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

export default Index;

// const tabs = [
//   { label: 'Generate PDF Report', content: <NewReport /> },
//   { label: 'Generate CSV Report', content: <Devices /> },
// ];

export const ReportsSection = () => {};
// FEATURE_FLAGS.Reports_Experimental ? (
//   <HorizontalSubTabs tabs={tabs} />
// ) : (
//   <NewReport />
// );

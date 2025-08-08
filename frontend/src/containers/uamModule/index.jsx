import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Card from '../../components/cards';
import HorizontalMenu from '../../components/horizontalMenu';

import { Icon } from '@iconify/react';
import BackButton from '../../components/backButton';
import { AppContext } from '../../context/appContext';
import { Padding } from '@mui/icons-material';

// mycode: UAM module dashbard header
const menuItems = [
  { id: 'sites', name: 'Sites', path: 'sites' },
  { id: 'racks', name: 'Racks', path: 'racks' },
  {
    id: 'devices',
    name: 'Devices',
    path: 'devices',
  },
];

function Index(props) {
  const { isMenuVisible } = useContext(AppContext);
  // console.log('menuVisible', isMenuVisible);

  return (
    <>
      {/* <BackButton style={{ marginLeft: '14px' }}></BackButton> */}
      {isMenuVisible ? (
        <Card
          sx={{
            padding: '0px 10px ',
            boxShadow: 'unset !important',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <HorizontalMenu menuItems={menuItems} defaultPage="sites" />
          </div>
        </Card>
      ) : (
        <BackButton style={{ margin: '15px 15px 0px 20px' }} />
      )}

      <Outlet />
    </>
  );
}

export default Index;

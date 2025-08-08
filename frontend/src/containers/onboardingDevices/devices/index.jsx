import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Outlet } from 'react-router-dom';
import HorizontalMenu from '../../../components/horizontalMenu';
import SubHorizontalMenu from '../../../components/subHorizontalMenu';
import Card from '../../../components/cards';

const Index = () => {
  const menuItems = [
    { id: 'devices', name: 'Devices', path: 'devices' },
    { id: 'password-group', name: 'Password Group', path: 'password-group' },
  ];
  return (
    <>
      <div style={{ width: '100%', margin: '0 auto', marginBottom: '20px' }}>
        {/* <HorizontalMenu
          menuItems={menuItems}
          parent="onboardingDevices"
          defaultPage="devices"
        /> */}
        <Card
          sx={{
            marginBottom: '10px',
            // height: '50px',
            boxShadow: 'unset !important',
          }}
        >
          <SubHorizontalMenu menuItems={menuItems} />
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Index;

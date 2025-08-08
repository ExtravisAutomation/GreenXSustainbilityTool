import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import HorizontalMenu from '../../../components/horizontalMenu.jsx';
import SubHorizontalMenu from '../../../components/subHorizontalMenu.jsx';

const Index = () => {
  const menuItems = [
    {
      id: 'cisco',
      name: 'Cisco',
      path: 'cisco',
    },

    {
      id: 'noncisco',
      name: 'Non Cisco',
      path: 'non-cisco',
    },
  ];

  return (
    <div>
      <div style={{ width: '97.5%', margin: '0 auto' }}>
        {/* <HorizontalMenu menuItems={menuItems} /> */}
        <SubHorizontalMenu menuItems={menuItems} />
      </div>

      <Outlet />
    </div>
  );
};

export default Index;

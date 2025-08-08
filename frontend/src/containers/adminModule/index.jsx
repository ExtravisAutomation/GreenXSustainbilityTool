import React, { useState } from 'react';
import HorizontalMenu from '../../components/horizontalMenu';
import { Outlet } from 'react-router-dom';
const AdminDashboard = () => {
  const menuItems = [
    { id: 'hosts', name: 'Hosts', path: 'hosts' },
    {
      id: 'virtual-machines',
      name: 'Virtual Machines',
      path: 'virtual-machines',
    },
  ];
  return (
    <>
      <div
        style={{
          height: '50px',
          width: '96%',
          margin: '0 auto',
          marginTop: '20px',
        }}
      >
        <HorizontalMenu
          menuItems={menuItems}
          parent="adminModule"
          defaultPage="hosts"
        />
      </div>
      <Outlet />
    </>
  );
};

export default AdminDashboard;

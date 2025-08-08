import React from 'react';
import { Outlet } from 'react-router-dom';

function index() {
  return (
    <div style={{ padding: '10px' }}>
      <Outlet />
    </div>
  );
}

export default index;

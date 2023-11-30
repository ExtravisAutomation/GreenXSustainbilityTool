import React from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';

const handleButtonClick = (e) => {
  message.info('Click on left button.');
  console.log('click left button', e);
};

const handleMenuClick = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

const items = [
  {
    label: 'SJH',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: 'AUH',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: 'FUJ',
    key: '3',
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: 'RAK',
    key: '4',
    icon: <UserOutlined />,
    danger: true,
   
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const Dropdownbutton = () => (
  <Space wrap>
    <Dropdown menu={menuProps}>
      <Button style={{ backgroundColor: "rgba(5, 3, 34, 0.87)", color: "#e5e5e5", border: "1px solid #474747" }}>
        <Space>
          DBX
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  </Space>
);

export default Dropdownbutton;

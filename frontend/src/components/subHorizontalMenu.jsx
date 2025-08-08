// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { styled, useTheme } from '@mui/material/styles';
// import MenuItem from '@mui/material/MenuItem';

// const SubHorizontalMenu = ({ menuItems }) => {
//   const theme = useTheme();
//   const [selectedItem, setSelectedItem] = useState('');

//   useEffect(() => {
//     if (menuItems && menuItems.length > 0) {
//       setSelectedItem(menuItems[0].id); // Select first item by default
//     }
//   }, []);

//   const StyledMenuItem = styled(MenuItem)(({ theme, sx }) => ({
//     fontSize: '14px',
//     padding: '10px 0px 0px',
//     margin: '10px 10px',
//     color: sx.isSelected
//       ? `${theme?.palette?.main_layout?.secondary_text}`
//       : `${theme?.palette?.main_layout?.primary_text}`,
//     borderBottom: sx.isSelected
//       ? `2px solid ${theme?.palette?.main_layout?.secondary_text}`
//       : 'none',
//     '&:hover': {
//       color: `${theme?.palette?.main_layout?.secondary_text}`,
//       backgroundColor: 'transparent',
//     },
//   }));

//   return (
//     <div style={{ display: 'flex' }}>
//       {menuItems.map((item) => (
//         <StyledMenuItem
//           key={item.id}
//           component={Link}
//           to={item.path}
//           onClick={() => setSelectedItem(item.id)}
//           sx={{ isSelected: selectedItem === item.id }}
//           theme={theme}
//         >
//           {item.name}
//         </StyledMenuItem>
//       ))}
//     </div>
//   );
// };

// export default SubHorizontalMenu;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { styled, useTheme } from '@mui/material/styles';
// import styled from 'styled-components';
const SubHorizontalMenu = ({ menuItems }) => {
  const StyledTabs = styled(Tabs)`
    .ant-tabs-nav {
      margin-bottom: 10px;

      background-color: transparent;
      padding: 0 10px;
      border-bottom: none !important;
    }
    .ant-tabs-nav::before {
      border-bottom: none !important;
    }

    .ant-tabs-tab {
      font-size: 14px;
      margin: 10px 10px;
      padding: 10px 0px 0px;
      color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
      border: none;
      background-color: transparent;
      transition: none !important;
      &:hover {
        color: ${({ theme }) => theme?.palette?.main_layout?.secondary_text};
      }
    }

    .ant-tabs-tab-active {
      color: ${({ theme }) =>
        theme?.palette?.main_layout?.secondary_text} !important;
      // border-bottom: 2px solid
      //   ${({ theme }) => theme?.palette?.main_layout?.secondary_text};
      transition: none !important;
    }

    .ant-tabs-ink-bar {
      background-color: ${({ theme }) =>
        theme?.palette?.main_layout?.secondary_text};
      transition: none !important;
    }
    .ant-tabs-tab-btn {
      transition: none !important;
    }
  `;

  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('');
  const theme = useTheme();

  // Automatically detect the current path to set active tab
  useEffect(() => {
    const currentPath = location.pathname.split('/').pop(); // Get last segment
    const matchedItem = menuItems.find((item) => item.path === currentPath);
    if (matchedItem) {
      setActiveKey(matchedItem.id);
    } else if (menuItems.length > 0) {
      setActiveKey(menuItems[0].id);
    }
  }, [location.pathname, menuItems]);

  const handleTabChange = (key) => {
    const selected = menuItems.find((item) => item.id === key);
    if (selected) {
      navigate(selected.path); // navigate to route
      setActiveKey(key);
    }
  };

  return (
    <StyledTabs
      activeKey={activeKey}
      onChange={handleTabChange}
      type="line"
      items={menuItems.map((item) => ({
        label: (
          <span
            style={{
              color:
                activeKey === item.id
                  ? theme?.palette?.main_layout?.secondary_text
                  : theme?.palette?.main_layout?.primary_text,
            }}
          >
            {item.name}
          </span>
        ),
        key: item.id,
      }))}
      theme={theme}
    />
  );
};

export default SubHorizontalMenu;

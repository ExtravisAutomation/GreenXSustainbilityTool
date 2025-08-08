// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import { useTheme, styled } from '@mui/material/styles';
// import { useLocation } from 'react-router-dom';
// import { AppContext } from '../context/appContext';

// export default function HorizontalMenu({
//   menuItems,
//   defaultPage,
//   cutomReport,
//   parent,
// }) {
//   console.log('default:::::::', defaultPage);
//   const { selectedContextItem, handleSetMenu } = useContext(AppContext);
//   const theme = useTheme();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [openSubmenus, setOpenSubmenus] = useState({});

//   useEffect(() => {
//     const getFirstLeafId = (items, path = '') => {
//       const first = items[0];
//       const currentPath = path ? `${path}-${first.id}` : first.id;
//       return first.children?.length
//         ? getFirstLeafId(first.children, currentPath)
//         : currentPath;
//     };

//     const findItemPath = (items, targetId, path = '') => {
//       for (const item of items) {
//         const currentPath = path ? `${path}-${item.id}` : item.id;
//         if (item.id === targetId && !item.children) return currentPath;
//         if (item.children) {
//           const result = findItemPath(item.children, targetId, currentPath);
//           if (result) return result;
//         }
//       }
//       return null;
//     };

//     const storedItem = localStorage.getItem('selectedContextItem');

//     if (storedItem) {
//       handleSetMenu(storedItem); // sets context and localStorage
//     }

//     if (menuItems?.length > 0) {
//       const alreadySelected = storedItem || selectedContextItem;
//       const foundInMenu = findItemPath(menuItems, alreadySelected);

//       if (foundInMenu) {
//         // If stored/current item is valid, we already called handleSetMenu
//         return;
//       }

//       // Fallback: defaultPage > first leaf
//       const selected = defaultPage
//         ? findItemPath(menuItems, defaultPage)
//         : getFirstLeafId(menuItems);

//       handleSetMenu(selected);
//     }
//   }, []);

//   // console.log('menu in reports:::::', menuItems);
//   // console.log('selcted ', selectedContextItem);
//   const StyledMenuItem = styled(MenuItem)(({ theme, sx }) => ({
//     letterSpacing: '1px',
//     padding:
//       defaultPage == 'Report Launch Pad'
//         ? '20px 0px'
//         : cutomReport === 'true'
//           ? '13px 12px 11px 12px'
//           : '20px 0px 15px 0px',
//     marginRight:
//       defaultPage == 'Report Launch Pad' || defaultPage == 'Devices'
//         ? '20px'
//         : '30px',
//     height: '32px !important',
//     color: sx.color,
//     marginBottom:
//       defaultPage == 'Report Launch Pad'
//         ? '20px'
//         : defaultPage == 'Devices'
//           ? '10px'
//           : '',

//     borderRadius: cutomReport == 'true' ? '5px 5px 0px 0px' : '',
//     backgroundColor:
//       sx.isClicked && cutomReport == 'true'
//         ? '#16212A'
//         : 'transparent !important',
//     fontSize: '14px',
//     fontWeight: 400,
//     borderBottom: sx.isClicked && !cutomReport ? `2px solid  ${sx.color}` : '',

//     '&:hover': {
//       color:
//         cutomReport == 'true'
//           ? theme?.palette?.main_layout?.color
//           : `${theme?.palette?.horizontal_menu?.secondary_text} !important`,
//       borderBottom:
//         cutomReport == 'true'
//           ? ''
//           : `3px solid ${theme?.palette?.horizontal_menu?.secondary_text} !important`,

//       backgroundColor:
//         sx.isClicked && cutomReport == 'true'
//           ? theme?.palette?.main_layout?.background
//           : 'transparent !important',
//     },
//   }));

//   const handleMenuClick = (event, id) => {
//     // console.log(id, 'ddd');
//     setOpenSubmenus((prevOpenSubmenus) => ({
//       ...prevOpenSubmenus,
//       [id]: !prevOpenSubmenus[id],
//     }));
//     handleSetMenu(id);
//     // setSelectedMenuItem(id);
//     // localStorage.setItem('selectedMenuItem', id);
//     // localStorage.setItem("selectedMenuItem", id);
//   };

//   const renderMenuItems = (
//     items,
//     parentId = null,
//     position = { top: 125, left: 0 }
//   ) => {
//     return items?.map((item) => {
//       const id = parentId ? `${parentId}-${item.id}` : item.id;
//       const isClicked = id === selectedContextItem;
//       if (item.children) {
//         return (
//           <div
//             key={id}
//             style={{
//               position: 'relative',
//               height: '50px',
//             }}
//           >
//             <StyledMenuItem
//               key={id}
//               id={id}
//               onClick={(event) => handleMenuClick(event, id)}
//               sx={{
//                 color: isClicked
//                   ? theme?.palette?.horizontal_menu?.secondary_text
//                   : theme?.palette?.horizontal_menu?.primary_text,
//               }}
//             >
//               {item.name}
//             </StyledMenuItem>
//             <Menu
//               anchorEl={document.getElementById(id)}
//               open={openSubmenus[id]}
//               onClose={(event) => handleMenuClick(event, id)}
//               anchorReference="anchorPosition"
//               anchorPosition={{
//                 top: position.top,
//                 left:
//                   position.left +
//                     document.getElementById(id)?.offsetWidth +
//                     10 || 0,
//               }}
//               sx={{
//                 '& .MuiPaper-root': {
//                   backgroundColor: theme?.palette?.default_card?.background,
//                   border: `1px solid ${theme?.palette?.default_card?.border}`,
//                   paddingLeft: '10px',
//                 },
//               }}
//             >
//               {renderMenuItems(item.children, id, {
//                 top: 215,
//                 left: 160,
//               })}
//             </Menu>
//           </div>
//         );
//       } else {
//         return (
//           <StyledMenuItem
//             id={id}
//             key={id}
//             component={Link}
//             to={item.path}
//             onClick={(event) => handleMenuClick(event, id)}
//             sx={{
//               fontSize: '14px',
//               backgroundColor:
//                 isClicked && cutomReport == 'true'
//                   ? theme?.palette?.main_layout?.background
//                   : // : isClicked && defaultPage == "Devices"
//                     // ? "#16212A"
//                     '',
//               color:
//                 isClicked && !cutomReport
//                   ? theme?.palette?.horizontal_menu?.secondary_text
//                   : isClicked && cutomReport == 'true'
//                     ? theme?.palette?.main_layout?.primary_text
//                     : // : cutomReport == "true"
//                       // ? "#697588"
//                       theme?.palette?.horizontal_menu?.primary_text,
//               isClicked: isClicked,
//             }}
//           >
//             {item.name}
//           </StyledMenuItem>
//         );
//       }
//     });
//   };

//   return <div style={{ display: 'flex' }}>{renderMenuItems(menuItems)}</div>;
// }

//  tabs working version
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { styled, useTheme } from '@mui/material/styles';

export default function HorizontalMenu({ menuItems = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeKey, setActiveKey] = useState('');

  const StyledTabs = styled(Tabs)`
    .ant-tabs-nav {
      margin-bottom: 0;
      padding: 0 10px;
      background: transparent;
      border-bottom: none !important;
      transition: none;
    }
    .ant-tabs-nav::before {
      border-bottom: none !important;
    }

    .ant-tabs-tab {
      letter-spacing: 1px;
      font-size: 14px;
      font-weight: 400;
      padding: 10px 0px 10px;
      color: ${({ theme }) => theme?.palette?.horizontal_menu?.primary_text};
      background: transparent !important;
      border: none;
      transition: none !important;
      &:hover {
        color: ${({ theme }) =>
          theme?.palette?.horizontal_menu?.secondary_text} !important;
        // border-bottom: 3px solid
        //   ${({ theme }) =>
          theme?.palette?.horizontal_menu?.secondary_text} !important;
      }
    }

    .ant-tabs-tab-active {
      color: ${({ theme }) =>
        theme?.palette?.horizontal_menu?.secondary_text} !important;
      border-bottom: 2px solid
        ${({ theme }) => theme?.palette?.horizontal_menu?.secondary_text} !important;
    }

    .ant-tabs-ink-bar {
      background-color: ${({ theme }) =>
        theme?.palette?.horizontal_menu?.secondary_text};
      transition: none !important;
    }
    .ant-tabs-tab-btn {
      transition: none !important;
    }
  `;

  const findActiveTabKey = (path) => {
    for (const item of menuItems) {
      if (item.path && path.includes(item.path)) return item.id;
      if (item.children) {
        for (const child of item.children) {
          if (path.includes(child.path)) {
            return `${item.id}-${child.id}`;
          }
        }
      }
    }
    return menuItems[0]?.id || '';
  };

  useEffect(() => {
    const pathKey = findActiveTabKey(location.pathname);
    setActiveKey(pathKey);
  }, [location.pathname, menuItems]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    const [parentId, childId] = key.split('-');
    const parent = menuItems.find((item) => item.id === parentId);
    const selected = childId
      ? parent?.children?.find((c) => c.id === childId)
      : parent;

    if (selected?.path) {
      navigate(selected.path);
    }
  };

  // const handleTabChange = (key) => {
  //   setActiveKey(key);
  //   const selected = menuItems.find((item) => item.id === key);

  //   if (selected?.path) {
  //     const baseRoute = location.pathname.split('/').slice(0, -1).join('/');
  //     navigate(`${baseRoute}/${selected.path}`);
  //   }
  // };

  // const renderTabs = () =>
  //   menuItems
  //     .map((item) => {
  //       if (item.children?.length) {
  //         return item.children.map((child) => ({
  //           label: child.name,
  //           key: `${item.id}-${child.id}`,
  //         }));
  //       }
  //       return {
  //         label: item.name,
  //         key: item.id,
  //       };
  //     })
  //     .flat();

  return (
    <StyledTabs
      activeKey={activeKey}
      onChange={handleTabChange}
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
      type="line"
      theme={theme}
    />
  );
}

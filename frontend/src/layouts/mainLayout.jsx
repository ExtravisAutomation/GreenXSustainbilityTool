import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { baseUrl } from '../utils/axios';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet } from 'react-router-dom';
// import Tooltip from "@mui/material/Tooltip";
import { AppContext } from '../context/appContext';
import dashboardInactiveIcon from '../resources/svgs/dashboardInactiveIcon.svg';
import dashboardActiveIcon from '../resources/svgs/dashboard-icon.png';
import monitoringInactiveIcon from '../resources/svgs/monitoringInactiveIcon.svg';
import monitoringActiveIcon from '../resources/svgs/monitoringActiveIcon.svg';
import atomInactiveIcon from '../resources/svgs/atomInactiveIcon.svg';
import atomActiveIcon from '../resources/svgs/atomActiveIcon.svg';
import ipamInactiveIcon from '../resources/svgs/ipamInactiveIcon.svg';
import ipamActiveIcon from '../resources/svgs/ipamActiveIcon.svg';
import networkMappingInactiveIcon from '../resources/svgs/networkMappingInactiveIcon.svg';
import networkMappingActiveIcon from '../resources/svgs/networkMappingActiveIcon.svg';
import autoDiscoveryInactiveIcon from '../resources/svgs/autoDiscoveryInactiveIcon.svg';
import autoDiscoveryActiveIcon from '../resources/svgs/autoDiscoveryActiveIcon.svg';
import uamInactiveIcon from '../resources/svgs/sites.svg';
import uamActiveIcon from '../resources/svgs/sitesActive.png';
import reportInActive from '../resources/svgs/Reports.png';
import customReportActive from '../resources/svgs/customReportActive.png';
import ncmInactiveIcon from '../resources/svgs/ncmInactiveIcon.svg';
import ncmActiveIcon from '../resources/svgs/ncmActiveIcon.svg';
import logo from '../resources/svgs/logo.svg';
import logogreen from '../resources/images/logogreen.png';
import logoDark from '../resources/images/logoDark.png';
import logoPurple from '../resources/images/logo_purple.png';

import logoblueLight from '../resources/images/greenXBlueLight.png';

import dayModeIcon from '../resources/svgs/dayModeIcon.svg';
import nightModeIcon from '../resources/svgs/nightModeIcon.svg';
import profileimage from '../resources/svgs/profileimage.png';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { message, Button, Modal, Dropdown, Space, Tooltip, Menu } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PiChalkboardTeacherDuotone } from 'react-icons/pi';
import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  UserOutlined,
  DesktopOutlined,
  DownOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MdOutlineQuestionMark, MdSpaceDashboard } from 'react-icons/md';
import { GiDetour } from 'react-icons/gi';
import SiteTour from '../containers/tour';
import TourModal from '../containers/tour/tourModal';
import { GiArtificialHive } from 'react-icons/gi';
import { AiOutlineLogout } from 'react-icons/ai';
import { RxDashboard } from 'react-icons/rx';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { MdDevices } from 'react-icons/md';
import { TbReportSearch } from 'react-icons/tb';
import ConfirmCustomModal from '../components/confirmCustomModal';
import CustomDropdown from '../components/customDropDown';
import { FaAffiliatetheme } from 'react-icons/fa';
import HorizontalMenu from '../components/horizontalMenu';
import { MdOutlineInventory2 } from 'react-icons/md';
import CustomModal from '../components/customModal';
import ScoringCards from '../components/scoringCards';
import { SiSecurityscorecard } from 'react-icons/si';
// import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoMdNotifications, IoMdPower } from 'react-icons/io';
import { THEME_LABELS } from '../App';
import { darkTheme, darkPurpleTheme, darkGreenTheme } from '../themes';
import axiosInstance from '../utils/axios/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetSelectedModule,
  setSelectedModule,
} from '../store/features/sidebarMenu/SidebarSlice';
import { IoLogoCodepen } from 'react-icons/io5';
import ConfirmLogoutModal from '../components/ConfirmLogoutModal';
// import LoadingSpinne
const uname = localStorage.getItem('user_name');
const auth_token = localStorage.getItem('auth_token');
const access_token = localStorage.getItem('access_token');
// console.log(access_token, 'access_token');

// console.log(auth_token, 'user auth_token');
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 0px',
  backgroundColor: theme?.palette?.main_layout?.background,
  borderBottom: `1px solid ${theme?.palette?.default_card?.border}`,

  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  backgroundColor: theme?.palette?.main_layout?.background,
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      backgroundColor: theme?.palette?.main_layout?.background,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      backgroundColor: theme?.palette?.main_layout?.background, // Set open state background color here
    },
  }),
}));

const StyledParagraph = styled('p')(({ theme }) => ({
  color: theme?.palette?.main_layout?.primary_text,
  fontWeight: 500,
  marginBottom: '6px',
  marginTop: '6px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme?.palette?.main_layout?.secondary_text,
  },
}));

export default function Index() {
  const loginData = JSON.parse(localStorage.getItem('loginData'));
  console.log('Login Data:', loginData);

  const accessModules = loginData?.user_info?.accessible_modules;

  const theme = useTheme();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const location = useLocation();

  const { themeMode } = useContext(AppContext);
  const { changeThemeMode } = useContext(AppContext);
  const { isMenuVisible, setMenuVisible } = useContext(AppContext);
  // const { selectedContextItem, handleSetMenu } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [access_token, setAccessToken] = useState();
  const [openRightDrawer, setOpenRightDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationData, setNotificationData] = useState([]);
  const selectedModule = useSelector((state) => state.sidebar.selectedModule);
  const dispatch = useDispatch();
  // const [selectedModule, setSelectedModule] = useState('');
  // const [expandedItem, setExpandedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal2Open, setModal2Open] = useState(false);
  const [token, setToken] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [modalTour, setModalTour] = useState(false);
  const [openModalScore, setOpenModalScore] = useState(false);
  const role = localStorage.getItem('role');
  console.log('role:::', role);
  const userRole = localStorage.getItem('user_role');
  console.log('userRole', userRole);
  console.log('Selected Module:::', selectedModule);
  // logout modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showConfirmModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    logOut();
    setIsModalOpen(false);
  };
  // logout modal end
  const handleClose = () => {
    setOpen2(false);
  };
  const handleSubItemClick = (path) => {
    localStorage.removeItem('selectedContextItem');
    navigate(path);
  };

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    console.log('useEffect called with selecetd', selectedModule);

    // Only dispatch if Redux hasn't already set it from localStorage
    if (!selectedModule) {
      if (userRole === 'superadmin') {
        dispatch(setSelectedModule('Users'));
      } else {
        dispatch(setSelectedModule('New Dashboard'));
      }
    }

    fetchNotifications();
  }, [access_token]);

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const segments = location?.pathname.split('/').filter(Boolean);
    const targetSegment = segments[1]; // 'uam_module' or 'inventoy-dashboard'
    console.log('targetSegment::', targetSegment);

    if (userRole === 'superadmin') {
      return;
    }

    const matchedItem = drawerMenuItems?.find((item) => {
      // Special case: If target is 'uam_module' or 'inventoy-dashboard', find the "Inventory Devices" item
      if (
        ['uam_module', 'inventoy-dashboard'].includes(targetSegment) &&
        item?.name === 'Devices Inventory'
      ) {
        return true;
      }

      // Normal case: match item by key
      return item?.key?.includes(targetSegment);
    });

    if (matchedItem) {
      console.log('Matched:', matchedItem.name);
      dispatch(setSelectedModule(matchedItem.name));
    }
  }, [location?.pathname]);

  useEffect(() => {
    // fetchNotifications();
    setOpen2(true);
    // setIsLoading(true);
    const access_token = localStorage.getItem('access_token');
    setAccessToken(access_token);
    setToken(auth_token);
    setTimeout(() => {
      if (access_token === null) {
        setIsLoading(false);
        navigate('/');
      } else {
        setIsLoading(false);
      }

      // else if (loginData?.user_info.is_superuser === false) {
      //   navigate("dashboard_module");
      //   setIsLoading(false);
      // } else {
      //   navigate("/main_layout/admin-dashboard");
      //   setIsLoading(false);
      // }
    }, 1000);
  }, [access_token]);

  const logOut = async () => {
    // const access_token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        baseUrl + '/auth/sign-out',
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setIsLoading(true);
      // console.log(response, "logout");
      if (response) {
        setIsLoading(false);
        // console.log(response, "after");
        setMenuVisible(true);
        localStorage.removeItem('selectedContextItem');
        localStorage.removeItem('selectedModule');
        localStorage.removeItem('access_token');
        setAccessToken(null);

        messageApi.open({
          type: 'success',
          content: response.data.message,
        });
        localStorage.clear();
        // dispatch(resetSelectedModule(userRole));
        navigate('/');
        changeThemeMode('blue-dark');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        messageApi.open({
          type: 'error',
          content: err.response.data.detail,
        });
      }
    }
    // changeThemeMode('blue-light');
    // if (!auth_token && auth_token === null) {
    //   setTimeout(() => {
    //     if (auth_token === null) {
    //       // messageApi.open({
    //       //   type: "success",
    //       //   content: "Logged out Successfully",
    //       // });
    //       setIsLoading(false);

    //       navigate("/");
    //     } else {
    //       setIsLoading(false);
    //     }
    //   }, 3000);
    // }
  };

  const showConfirm = () => {
    confirm({
      title: (
        <span style={{ color: 'gray' }}>Are you sure you want to log-out?</span>
      ),
      icon: <ExclamationCircleFilled />,
      content: (
        <span style={{ color: 'gray' }}>
          Logging out will end your current session. Are you sure you want to
          proceed?
        </span>
      ),
      okText: 'Yes',
      okType: 'primary',
      okButtonProps: {
        style: {
          backgroundColor: theme.palette?.drop_down_button?.add_background,
          color: 'white',
          borderRadius: '8px',
        },
        className: 'custom-ok-button',
      },
      cancelText: 'No',
      // onOk() {
      //   logOut();
      // },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const createThemeOption = (key, label, color, dark = false) => ({
    key,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
        }}
        onClick={() => changeThemeMode(label.toLowerCase().replace(' ', '-'))}
      >
        <p style={{ margin: '0px' }}>{label}</p>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '100%',
            background: `linear-gradient(to bottom, ${color}, ${dark ? 'black' : 'white'})`,
          }}
        ></div>
      </div>
    ),
  });
  // mycode
  const themeOptions = [
    createThemeOption('1', THEME_LABELS.GREEN_DARK, '#68B144', true),
    createThemeOption('2', THEME_LABELS.BLUE_DARK, '#0490E7', true),
    createThemeOption('3', THEME_LABELS.PURPLE_DARK, '#9B7EBD', true),
    createThemeOption('3', THEME_LABELS.GREEN_LIGHT, '#68B144'),
    createThemeOption('4', THEME_LABELS.BLUE_LIGHT, '#0490E7'),
    createThemeOption('3', THEME_LABELS.PURPLE_LIGHT, '#9B7EBD'),
  ];

  // mycode: Header Menu Items
  const items = [
    {
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          onClick={() => setModal2Open(true)}
        >
          <UserOutlined />
          Profile
        </div>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    userRole === 'superadmin'
      ? null
      : {
          label: (
            <div
              onClick={() => setModalTour(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '10px',
              }}
            >
              <GiDetour /> Tour site
            </div>
          ),
          key: '2',
        },
    {
      label: (
        <div
          style={{
            marginRight: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FaAffiliatetheme />
          <CustomDropdown
            button="false"
            // icon={<DownOutlined />}
            items={themeOptions}
            // trigger={["click"]}
          >
            Theme
          </CustomDropdown>
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div
          onClick={() => navigate('/main_layout/about')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '10px',
          }}
        >
          <MdOutlineQuestionMark /> About
        </div>
      ),
      key: '4',
    },
    {
      label: (
        <div
          // onClick={showConfirm}
          onClick={showConfirmModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '10px',
          }}
        >
          <AiOutlineLogout
            style={{
              color: '#a64629',
            }}
          />{' '}
          Logout
        </div>
      ),
      key: '5',
    },
  ];

  const toggleTheme = (mode) => {
    console.log(mode);

    if (mode === 'dark') {
      changeThemeMode('dark');
    } else if (mode === 'light-green') {
      changeThemeMode('light-green');
    } else {
      changeThemeMode('light-blue');
    }
  };
  // for testing:
  // const allowedMenuNames = [
  //   'Dashboard',
  //   'Onboarded Devices',
  //   'Reports',
  //   'VCenter',
  // ];
  // mycode: Tooltip in sidebar invortry-dashboard
  const expandedItem = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/main_layout/inventoy-dashboard',
    },
    {
      id: 'inventory',
      name: 'Inventory',
      path: '/main_layout/uam_module/sites',
    },
  ];

  const controlPanelMenuItems = [
    {
      name: 'Users',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <UsergroupAddOutlined
            style={{ fontSize: '22px', color: '#697588' }}
          />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <UsergroupAddOutlined
            style={{
              fontSize: '22px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'control-panel/all-users',
    },
    {
      name: 'Role Management',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <SettingOutlined style={{ fontSize: '22px', color: '#697588' }} />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <SettingOutlined
            style={{
              fontSize: '22px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'control-panel/roles-management',
    },
  ];

  const drawerMenuItems = [
    {
      key: '/main_layout/updated_dashboard_module/updated_dashboard',
      name: 'New Dashboard',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <MdSpaceDashboard style={{ fontSize: '23px', color: '#697588' }} />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <MdSpaceDashboard
            style={{
              fontSize: '28px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'updated_dashboard_module',
    },

    {
      id: 'Onboarding Devices',
      key: '/main_layout/onboarding-devices/devices',
      name: 'Onboarded Devices',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '12px 10px 10px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <PiChalkboardTeacherDuotone
            style={{ color: '#697588', fontSize: '25px' }}
          />
        </div>
      ),
      // activeIcon: <img src={uamActiveIcon} alt="Atom" />,
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '12px 10px 10px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <PiChalkboardTeacherDuotone
            style={{
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
              fontSize: '25px',
            }}
          />
        </div>
      ),
      path: 'onboarding-devices',
    },
    {
      id: 'uam',
      key: '/main_layout/inventoy-dashboard',
      name: 'Devices Inventory',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '12px 10px 10px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <MdDevices style={{ fontSize: '23px', color: '#697588' }} />
        </div>
      ),

      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '12px 10px 10px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <MdDevices
            style={{
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
              fontSize: '23px',
            }}
          />
        </div>
      ),
      path: '/main_layout/inventoy-dashboard',
    },

    {
      id: 'Reports',
      name: 'Reports',
      key: '/main_layout/reports_module',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <TbReportSearch style={{ color: '#697588', fontSize: '26px' }} />
          {/* <img
            style={{ margin: "0 auto", width: "26px" }}
            src={reportInActive}
            alt="Reports"
          /> */}
        </div>
      ),
      // activeIcon: <img src={uamActiveIcon} alt="Atom" />,
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <TbReportSearch
            style={{
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
              fontSize: '26px',
            }}
          />
          {/* <img
            style={{ width: "26px" }}
            src={customReportActive}
            alt="Reports"
          /> */}
        </div>
      ),
      path: 'reports_module',
    },
    // mycode: sidebar show/hide Vcenter
    {
      key: '/main_layout/admin-dashboard',
      id: 'VCenter',
      name: 'VCenter',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '11px 10px 9px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <DesktopOutlined style={{ fontSize: '21px', color: '#697588' }} />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '11px 10px 9px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <DesktopOutlined
            style={{
              fontSize: '21px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'admin-dashboard',
    },
    // {
    //   name: "Members",
    //   inActiveIcon: (
    //     <div
    //       style={{
    //         width: "100%",
    //         padding: "5px 10px 5px 10px",
    //         marginTop: "5px",
    //         marginBottom: "5px",
    //       }}
    //     >
    //       <DesktopOutlined style={{ fontSize: "22px", color: "#697588" }} />
    //     </div>
    //   ),
    //   activeIcon: (
    //     <div
    //       style={{
    //         background: "#049FD921",
    //         width: "100%",
    //         borderRadius: "50px 0px 0px 50px",
    //         padding: "10px 10px 8px 10px",
    //         marginTop: "5px",
    //         marginBottom: "5px",
    //       }}
    //     >
    //       <DesktopOutlined style={{ fontSize: "22px", color: "#0490E7" }} />
    //     </div>
    //   ),
    //   path: "members",
    // },
    // mycode
    {
      id: 'AI Engine',
      name: 'AI Engine',
      key: '/main_layout/AI-Engine',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <GiArtificialHive style={{ fontSize: '24px', color: '#697588' }} />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <GiArtificialHive
            style={{
              fontSize: '24px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'AI-Engine',
    },
    {
      id: 'Pue Calculator',
      name: 'PUE Calculator',
      key: '/main_layout/pue-calculator',
      inActiveIcon: (
        <div
          style={{
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <IoLogoCodepen style={{ fontSize: '24px', color: '#697588' }} />
        </div>
      ),
      activeIcon: (
        <div
          style={{
            background: theme?.palette?.main_layout?.sideBar?.icon_bg,
            width: '100%',
            borderRadius: '50px 0px 0px 50px',
            padding: '10px 10px 8px 10px',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <IoLogoCodepen
            style={{
              fontSize: '24px',
              color: theme?.palette?.main_layout?.sideBar?.icon_color,
            }}
          />
        </div>
      ),
      path: 'pue-calculator',
    },
  ];

  // mycode: sidebar Menu End Here

  // notification

  // const fetchNotifications = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/device_inventory/get_notifications`
  //     );

  //     setNotificationData();
  //     // response?.data?.data?.map((item) => {
  //     //   return {
  //     //     label: item?.rack_name,
  //     //     value: item?.id,
  //     //   };
  //     // }) // Assuming the API returns an array of rack options
  //   } catch (error) {
  //     console.error('Error fetching Notifications:', error);
  //   }
  // };
  const fetchNotifications = async () => {
    try {
      // const response = await axiosInstance.post(
      //   'device_inventory/get_notifications'
      // );
      const response = await axios.post(
        baseUrl + '/device_inventory/get_notifications',
        // payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log('response nitiiii::', response?.data?.data);

      // const notifications = response?.data?.data || []; // fallback to empty array if undefined

      setNotificationData(response?.data?.data); // Pass actual data to state setter
    } catch (error) {
      console.error('Error fetching Notifications:', error);
    }
  };

  const notificationMenu = (
    <Menu
      style={{
        width: 'auto',
        maxWidth: '500px',
        maxHeight: '500px',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: theme?.palette?.default_card?.background,
        color: theme?.palette?.default_card?.color,
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        padding: '10px',
      }}
    >
      {notificationData.length === 0 ? (
        <Menu.Item disabled>No new notification</Menu.Item>
      ) : (
        notificationData.map((item) => (
          <div
            key={item.id}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              padding: '10px',
              borderBottom: '1px solid gray',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{item.name}</strong>
              <span
                style={{
                  color: `${theme?.palette?.main_layout?.secondary_text}`,
                  // marginRight: '10px',
                }}
              >
                {' '}
                {` (${item?.ip_address})`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item?.text}</span>
              <span style={{ fontWeight: '500' }}>{item?.dated}</span>
            </div>
          </div>
        ))
      )}
    </Menu>
  );
  // end

  // Logic with Cpanel:
  const isSuperAdmin = userRole === 'superadmin';
  const menuItems = isSuperAdmin
    ? controlPanelMenuItems
    : drawerMenuItems?.filter(
        (item) =>
          Array.isArray(accessModules) && accessModules.includes(item.name)
      );

  console.log('Access', accessModules);

  console.log('ManuItems for Saman', menuItems);

  // console.log(drawerMenuItems, location.pathname, 'dd');

  return (
    <>
      {contextHolder}
      <ConfirmLogoutModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        onLogout={handleLogout}
      />
      <CustomModal
        open={openModalScore}
        title="Datacenter Scorecard"
        score="true"
        handleClose={() => setOpenModalScore(false)}
      >
        <ScoringCards handleClose={() => setOpenModalScore(false)} />
      </CustomModal>
      {isLoading === true ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open2}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <Modal
        title={
          <div
            style={{
              margin: '0 auto',
              width: '70px',
              height: '70px',
              borderRadius: '100%',
              background: 'gray',
            }}
          ></div>
        }
        width={400}
        style={{
          top: 20,
          width: 200,
        }}
        // centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: 'gray' }} />}
      >
        <h3 style={{ textAlign: 'center', color: 'gray' }}>
          {token !== null ? uname : ''}
        </h3>
        {loginData?.user_info.is_active === true ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'gray',
            }}
          >
            <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>Status:</p>
            <p style={{ color: 'green', marginBottom: '0px' }}>Active</p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'gray',
            }}
          >
            <p style={{ marginBottom: '0px' }}>Status:</p>
            <p style={{ color: 'green', marginBottom: '0px', color: 'red' }}>
              Inactive
            </p>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'gray',
          }}
        >
          <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>Name:</p>
          <p style={{ marginBottom: '0px' }}>{token !== null ? uname : ''}</p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'gray',
          }}
        >
          <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>Email:</p>
          <p style={{ marginBottom: '0px' }}>{loginData?.user_info.email}</p>
        </div>
      </Modal>
      <TourModal modalTour={modalTour} setModalTour={setModalTour} />

      <Box sx={{ display: 'flex', zIndex: '9', position: 'relative' }}>
        <Drawer
          variant="permanent"
          open={open}
          style={{ minWidth: '3.2%' }}
          sx={{
            '& .MuiDrawer-paper': {
              borderRight: `1px solid ${theme?.palette?.main_layout?.border_bottom}`,
            },
          }}
        >
          <DrawerHeader>
            <img
              style={{ width: '30px' }}
              src={
                theme.name === 'darkGreen' || theme.name === 'lightGreen'
                  ? logogreen
                  : theme.name === 'darkPurple' || theme.name === 'lightPurple'
                    ? logoPurple
                    : logoDark // fallback/default
              }
              alt="Data Center"
            />
          </DrawerHeader>
          {/* <Divider /> */}

          <List
            style={{ padding: 0 }}
            disableRipple
            sx={{
              justifyContent: open ? 'initial' : 'center',
              padding: 0,
            }}
          >
            {menuItems?.map((item, index) => (
              <Tooltip
                key={item.name}
                title={
                  item?.id === 'uam'
                    ? expandedItem?.map((subItem, subIndex) => (
                        <Link to={subItem.path} key={subItem.name}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                            // onClick={() => {
                            //   handleSetMenu('Sites');
                            // }}
                          >
                            {subIndex === 0 ? (
                              <RxDashboard
                                style={{ fontSize: '16px', color: '#697588' }}
                              />
                            ) : (
                              <MdOutlineInventory2
                                style={{ fontSize: '18px', color: '#697588' }}
                              />
                            )}
                            <StyledParagraph theme={theme}>
                              {subItem.name}
                            </StyledParagraph>
                          </div>
                        </Link>
                      ))
                    : item.name
                }
                placement="right"
                overlayInnerStyle={{
                  backgroundColor: theme?.palette?.graph?.toolTip_bg,
                  border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                <Link to={item.path}>
                  <ListItem
                    disablePadding
                    onClick={() => {
                      // localStorage.setItem('selectedModule', item.name); // Save selected module
                      localStorage.removeItem('selectedContextItem');
                      setMenuVisible(true);
                      dispatch(setSelectedModule(item.name));
                    }}
                    // onClick={() => {
                    //   localStorage.removeItem('selectedContextItem');
                    //   setMenuVisible(true);
                    //   setSelectedModule(item.name);
                    // }}
                  >
                    <ListItemButton
                      sx={{
                        justifyContent: open ? 'initial' : 'center',
                        padding: 0,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: '100%',
                          marginLeft: '0 auto',
                          textAlign: 'center',
                        }}
                      >
                        {selectedModule === item.name
                          ? item.activeIcon
                          : item.inActiveIcon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </Tooltip>
            ))}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            minHeight: '100vh',
            background: theme?.palette?.main_layout?.contents_bg,
            minWidth: '95.7%',
            overflowX: 'none',
          }}
        >
          <DrawerHeader
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 20px',
              borderBottom: `0.5px solid ${theme?.palette?.main_layout?.border_bottom}`,
            }}
          >
            <div style={{ color: theme?.palette?.main_layout?.primary_text }}>
              {selectedModule}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* <div
                style={{
                  marginRight: "15px",
                }}
              >
                <CustomDropdown icon={""} items={themeOptions}>
                  Select Theme
                </CustomDropdown>
              </div>

              <div
                onClick={() => setModalTour(true)}
                style={{
                  color: "white",

                  // background: "#141B26",
                  background: theme?.palette?.page_header?.icons_bg,
                  color: theme?.palette?.default_select?.color,
                  padding: "10px",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
              >
                <GiDetour />
              </div>
              <div
                onClick={() => navigate("/main_layout/about")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  color: theme?.palette?.default_select?.color,
                  background: theme?.palette?.page_header?.icons_bg,
                  padding: "10px",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
              >
                <MdOutlineQuestionMark />
              </div> */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* <Dropdown
                  menu={{
                    style: dropdownMenuStyle,
                    items,
                  }}
                  trigger={["click"]}
                  overlayStyle={overlayStyle}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <ProfileContainer></ProfileContainer>
                    </Space>
                  </a>
                </Dropdown> */}
                {userRole !== 'superadmin' ? (
                  <Button
                    style={{
                      background: 'none',
                      boxShadow: 'none',
                      color: theme?.palette?.main_layout?.primary_text,
                      height: '34px',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      borderRadius: '4px',
                      border: 'none',
                      marginRight: '10px',
                      fontSize: '16px',
                    }}
                    onClick={() => setOpenModalScore(true)}
                  >
                    <SiSecurityscorecard
                      style={{
                        color: theme?.palette?.drop_down_button?.add_background,
                      }}
                    />
                    Scorecard
                  </Button>
                ) : null}
                {/* notification */}
                {/* <Button
                  style={{
                    background: 'none',
                    boxShadow: 'none',
                    color: theme?.palette?.main_layout?.primary_text,
                    height: '34px',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    borderRadius: '4px',
                    border: 'none',
                    marginRight: '10px',
                    fontSize: '16px',
                    position: 'relative',
                    paddingTop: '12px',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <IoMdNotifications
                      style={{
                        color: theme?.palette?.drop_down_button?.add_background,
                        fontSize: '26px',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '100%',
                        padding: ' 4px 2px 2px 2px ',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        height: '13px',
                        width: '15px',
                        // minWidth: '16px',
                        textAlign: 'center',
                      }}
                    >
                      3
                    </span>
                  </div>
                </Button> */}

                <Dropdown
                  overlay={notificationMenu}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button
                    style={{
                      background: 'none',
                      boxShadow: 'none',
                      color: theme?.palette?.main_layout?.primary_text,
                      height: '34px',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      borderRadius: '4px',
                      border: 'none',
                      marginRight: '10px',
                      fontSize: '16px',
                      position: 'relative',
                      paddingTop: '12px',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <IoMdNotifications
                        style={{
                          color:
                            theme?.palette?.drop_down_button?.add_background,
                          fontSize: '26px',
                        }}
                      />
                      {notificationData.length > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '100%',
                            padding: ' 4px 2px 2px 2px ',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            lineHeight: 1,
                            height: '13px',
                            width: '15px',
                            textAlign: 'center',
                          }}
                        >
                          {notificationData.length}
                        </span>
                      )}
                    </div>
                  </Button>
                </Dropdown>

                <CustomDropdown
                  // icon={<DownOutlined />}
                  button="false"
                  profile="true"
                  items={items}
                  trigger={['click']}
                >
                  <ProfileContainer onClick={(e) => e.preventDefault()}>
                    <p
                      style={{
                        // mycode: for change the G color
                        // color: `${theme?.palette?.main_layout?.secondary_text}`,
                        color: 'white',
                        fontSize: '26px',
                      }}
                    >
                      G
                    </p>
                  </ProfileContainer>
                </CustomDropdown>
                <div>
                  <div
                    style={{
                      marginBottom: '0px',
                      color: theme?.palette?.main_layout?.primary_text,
                      fontSize: theme.typography.textSize.medium,
                    }}
                  >
                    {loginData?.user_info?.name}
                    {/* {token !== null ? uname : ''} */}
                  </div>
                  <div
                    style={{
                      color: theme?.palette?.main_layout?.secondary_text,
                      fontSize: theme.typography.textSize.small,
                    }}
                  >
                    {loginData?.user_info.is_active === true ? (
                      <p
                        style={{
                          // mycode:
                          color: theme?.palette?.main_layout?.secondary_text,
                          // color: 'green',
                          marginBottom: '0px',
                          marginTop: '0px',
                        }}
                      >
                        Active
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* <div
                onClick={showConfirm}
                style={{
                  color: "#a64629",
                  background: theme?.palette?.page_header?.icons_bg,
                  padding: "10px",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <AiOutlineLogout />
              </div> */}
            </div>
          </DrawerHeader>

          <div style={{}}>
            <Outlet />
          </div>
        </Box>
      </Box>
    </>
  );
}

// Define your styled component using the `styled` function
const ProfileContainer = styled('div')(({ theme }) => ({
  borderRadius: '100px',
  width: '20px',
  height: '20px',
  padding: '8px 10px 10px 10px',
  background: theme?.palette?.main_layout?.secondary_text,
  cursor: 'pointer',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

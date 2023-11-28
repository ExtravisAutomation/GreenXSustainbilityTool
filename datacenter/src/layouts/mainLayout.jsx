import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { AppContext } from "../context/appContext";
import dashboardInactiveIcon from "../resources/svgs/dashboardInactiveIcon.svg";
import dashboardActiveIcon from "../resources/svgs/dashboardActiveIcon.svg";
import monitoringInactiveIcon from "../resources/svgs/monitoringInactiveIcon.svg";
import monitoringActiveIcon from "../resources/svgs/monitoringActiveIcon.svg";
import atomInactiveIcon from "../resources/svgs/atomInactiveIcon.svg";
import atomActiveIcon from "../resources/svgs/atomActiveIcon.svg";
import ipamInactiveIcon from "../resources/svgs/ipamInactiveIcon.svg";
import ipamActiveIcon from "../resources/svgs/ipamActiveIcon.svg";
import networkMappingInactiveIcon from "../resources/svgs/networkMappingInactiveIcon.svg";
import networkMappingActiveIcon from "../resources/svgs/networkMappingActiveIcon.svg";
import autoDiscoveryInactiveIcon from "../resources/svgs/autoDiscoveryInactiveIcon.svg";
import autoDiscoveryActiveIcon from "../resources/svgs/autoDiscoveryActiveIcon.svg";
import uamInactiveIcon from "../resources/svgs/uamInactiveIcon.svg";
import uamActiveIcon from "../resources/svgs/uamActiveIcon.svg";
import ncmInactiveIcon from "../resources/svgs/ncmInactiveIcon.svg";
import ncmActiveIcon from "../resources/svgs/ncmActiveIcon.svg";
import logo from "../resources/svgs/logo.svg";
import dayModeIcon from "../resources/svgs/dayModeIcon.svg";
import nightModeIcon from "../resources/svgs/nightModeIcon.svg";
import profileimage from "../resources/svgs/profileimage.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  backgroundColor: theme?.palette?.main_layout?.background,
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: theme?.palette?.main_layout?.background, // Set open state background color here
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: theme?.palette?.main_layout?.background, // Set open state background color here
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: theme?.palette?.main_layout?.background, // Set open state background color here
    },
  }),
}));

export default function Index() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { isDarkMode, setDarkMode } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(
    "Data Center Sustainability"
  );

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  const drawerMenuItems = [
    // {
    //   name: "Login",
    //   inActiveIcon: <img src={dashboardInactiveIcon} alt="Admin" />,
    //   activeIcon: <img src={dashboardActiveIcon} alt="Admin" />,
    //   path: "/",
    // },
    {
      name: "Data Center Sustainability",
      inActiveIcon: <img src={dashboardInactiveIcon} alt="Admin" />,
      activeIcon: <img src={dashboardActiveIcon} alt="Admin" />,
      path: "dashboard_module",
    },
    {
      name: "Sites",
      inActiveIcon: <img src={uamInactiveIcon} alt="Atom" />,
      activeIcon: <img src={uamActiveIcon} alt="Atom" />,
      path: "uam_module",
    },
  ];

  return (
    <Box sx={{ display: "flex", zIndex: "9", position: "relative" }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <img src={logo} alt="Data Center" />
        </DrawerHeader>
        <Divider />

        <List style={{ padding: 0 }}>
          {drawerMenuItems?.map((item, index) => (
            <Tooltip key={item.name} title={item.name} placement="right">
              <Link to={item.path}>
                <ListItem
                  key={item.name}
                  disablePadding
                  onClick={() => setSelectedModule(item.name)}
                >
                  <ListItemButton
                    sx={{
                      justifyContent: open ? "initial" : "center",
                      padding: 0,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
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
        sx={{ flexGrow: 1, p: 0, border: "0px solid red", minHeight: "100vh" }}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: `0.5px solid ${theme?.palette?.main_layout?.border_bottom}`,
          }}
        >
          <div style={{ color: theme?.palette?.main_layout?.primary_text }}>
            {selectedModule}
          </div>
          <div style={{ display: "flex" }}>
            {/* <div style={{ cursor: "pointer" }}>
              {isDarkMode ? (
                <img
                  src={dayModeIcon}
                  alt="theme"
                  onClick={toggleTheme}
                  height={35}
                />
              ) : (
                <img
                  src={nightModeIcon}
                  alt="theme"
                  onClick={toggleTheme}
                  height={35}
                />
              )}
            </div> */}
            &nbsp; &nbsp;
            <ProfileContainer
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            ></ProfileContainer>
            &nbsp; &nbsp;
            <div>
              <div
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                  fontSize: theme.typography.textSize.medium,
                }}
              >
                Muhammad Husnain Ch
              </div>
              <div
                style={{
                  color: theme?.palette?.main_layout?.secondary_text,
                  fontSize: theme.typography.textSize.small,
                }}
              >
                Product Developer
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div style={{ padding: "10px 20px" }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
}

// Define your styled component using the `styled` function
const ProfileContainer = styled("div")(({ theme }) => ({
  borderRadius: "100px",
  width: "35px",
  height: "35px",
  backgroundColor: theme?.palette?.main_layout?.profile_picture_background,
}));

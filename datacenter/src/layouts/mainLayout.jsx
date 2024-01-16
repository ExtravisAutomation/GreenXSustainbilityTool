import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { baseUrl } from "../utils/axios";
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
import LogoutIcon from "@mui/icons-material/Logout";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { message, Button, Modal, Dropdown, Space } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { ExclamationCircleFilled, RightOutlined } from "@ant-design/icons";
// import LoadingSpinne
const uname = localStorage.getItem("user_name");
const auth_token = localStorage.getItem("auth_token");
const access_token = localStorage.getItem("access_token");
console.log(access_token, "access_token");

console.log(auth_token, "user auth_token");
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
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  console.log(loginData, "login dataaaaa");
  const theme = useTheme();
  const navigate = useNavigate();
  const { confirm } = Modal;

  const { isDarkMode, setDarkMode } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [access_token, setAccessToken] = useState();
  const [openRightDrawer, setOpenRightDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedModule, setSelectedModule] = useState(
    "Data Center Sustainability"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [modal2Open, setModal2Open] = useState(false);
  const [token, setToken] = useState();

  const handleClose = () => {
    setOpen2(false);
  };

  useEffect(() => {
    setOpen2(true);
    // setIsLoading(true);
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    setToken(auth_token);
    setTimeout(() => {
      if (access_token === null) {
        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
      }
    }, 1000);
  }, [access_token]);

  const logOut = async () => {
    // const access_token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        baseUrl + "/sign-out",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setIsLoading(true);
      console.log(response, "logout");
      if (response) {
        setIsLoading(false);
        console.log(response, "after");
        localStorage.removeItem("access_token");
        setAccessToken(null);
        // messageApi.open({
        //   type: "success",
        //   content: response.data.message,
        // });
        Swal.fire({
          title: response.data.message,
          // text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
          timer: 1500, // Adjust the time in milliseconds (e.g., 3000 for 3 seconds)
          timerProgressBar: true,
          onClose: () => {
            // This will be called when the timer is up
            // Add any additional logic you want to execute when the popup is closed
            console.log("Popup closed");
          },
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        messageApi.open({
          type: "error",
          content: err.response.data.detail,
        });
      }
    }

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
      title: "Are you sure you want to log-out?",
      icon: <ExclamationCircleFilled />,
      content:
        "Logging out will end your current session. Are you sure you want to proceed?",
      okText: "yes",
      okType: "primary",
      okButtonProps: {
        // disabled: true,
      },
      cancelText: "No",
      onOk() {
        logOut();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const items = [
    {
      label: (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "100%",
              background: "black",
              margin: "0 auto",
            }}
          ></div>
          <h3>{token !== null ? uname : ""}</h3>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setModal2Open(true)}
        >
          <Button
            className="profile_item"
            style={{ border: "none", boxShadow: "none" }}
          >
            Profile
          </Button>
          <RightOutlined />
        </div>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={showConfirm}
        >
          <Button
            className="profile_item"
            style={{ border: "none", boxShadow: "none" }}
          >
            Log out
          </Button>
          <RightOutlined />
        </div>
      ),
      key: "3",
    },
  ];
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
  const overlayStyle = {
    width: "250px", // Set the desired width
  };

  return (
    <>
      {contextHolder}

      {isLoading === true ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
              margin: "0 auto",
              width: "70px",
              height: "70px",
              borderRadius: "100%",
              background: "black",
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
      >
        <h3 style={{ textAlign: "center" }}>{token !== null ? uname : ""}</h3>
        {loginData.user_info.is_active === true ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ marginBottom: "0px", fontWeight: "bold" }}>Status:</p>
            <p style={{ color: "green", marginBottom: "0px" }}>Active</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ marginBottom: "0px" }}>Status:</p>
            <p style={{ color: "green", marginBottom: "0px", color: "red" }}>
              Inactive
            </p>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "0px", fontWeight: "bold" }}>Name:</p>
          <p style={{ marginBottom: "0px" }}>{token !== null ? uname : ""}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "0px", fontWeight: "bold" }}>Email:</p>
          <p style={{ marginBottom: "0px" }}>{loginData.user_info.email}</p>
        </div>
      </Modal>

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
          sx={{
            flexGrow: 1,
            p: 0,
            border: "0px solid red",
            minHeight: "100vh",
          }}
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
            <div style={{ display: "flex", alignItems: "center" }}>
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
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                overlayStyle={overlayStyle}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <ProfileContainer
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "gray",
                      }}
                      // onClick={logOut}
                    ></ProfileContainer>
                  </Space>
                </a>
              </Dropdown>
              &nbsp; &nbsp;
              <div>
                <div
                  style={{
                    marginBottom: "0px",
                    color: theme?.palette?.main_layout?.primary_text,
                    fontSize: theme.typography.textSize.medium,
                  }}
                >
                  {token !== null ? uname : ""}
                </div>
                <div
                  style={{
                    color: theme?.palette?.main_layout?.secondary_text,
                    fontSize: theme.typography.textSize.small,
                  }}
                >
                  {loginData.user_info.is_active === true ? (
                    <p
                      style={{
                        color: "green",
                        marginBottom: "0px",
                        marginTop: "0px",
                      }}
                    >
                      Active
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </DrawerHeader>
          <div style={{ padding: "10px 20px" }}>
            <Outlet />
          </div>
        </Box>
      </Box>
    </>
  );
}

// Define your styled component using the `styled` function
const ProfileContainer = styled("div")(({ theme }) => ({
  borderRadius: "100px",
  width: "35px",
  height: "35px",
  backgroundColor: theme?.palette?.main_layout?.profile_picture_background,
}));

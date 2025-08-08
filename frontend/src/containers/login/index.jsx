import React, { useState, useEffect, useContext } from 'react';
import Input from 'antd/es/input/Input';
import { Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import greenXLogo from '../../resources/images/GreenX.png';
import cisco from '../../resources/images/logo.png';
import axios from 'axios';
import { baseUrl } from '../../utils/axios';
import Swal from 'sweetalert2';
import { message } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { CustomInput } from '../../components/customInput';
import styled from 'styled-components';
import bg from '../../resources/images/login_bg.png';
import { AppContext } from '../../context/appContext';
import { loginUser } from '../../services/authServices/authServices';
import { useDispatch } from 'react-redux';
import { setSelectedModule } from '../../store/features/sidebarMenu/SidebarSlice';
import { AiOutlineLock } from 'react-icons/ai';
const LoginContainer = styled.div`
  height: 100vh;
  color: #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: ${(theme) =>
    theme?.themeMode == 'dark'
      ? `url(${bg})`
      : theme?.palette?.default_card?.background};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
function Index() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { themeMode, setThemeMode } = useContext(AppContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (event) => {
    if (username == '') {
      messageApi.open({
        type: 'error',
        content: 'Please, Enter Username!',
      });
    } else if (password == '') {
      messageApi.open({
        type: 'error',
        content: 'Please, Enter Password!',
      });
    } else {
      try {
        setIsLoading(true);

        // const response = await axios.post(baseUrl + "/auth/sign-in", {
        //   user_name: username,
        //   password: password,
        // });
        const response = await loginUser(username, password);
        console.log(response, 'login response');
        if (response.status === 200) {
          setIsLoading(false);
          messageApi.open({
            type: 'success',
            content: 'Successfully Logged in',
          });

          localStorage.setItem('loginData', JSON.stringify(response.data));
          localStorage.setItem('user_name', response.data?.user_info.name);
          localStorage.setItem('user_role', response.data?.user_info.user_role);
          localStorage.setItem(
            'auth_token',
            response.data?.user_info.user_token
          );
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('role', response?.data?.user_info?.is_superuser);

          setTimeout(() => {
            // navigate('/main_layout');
            // navigate('admin-dashboard');

            if (response.data.user_info.user_role === 'superadmin') {
              // localStorage.setItem('selectedModule', 'Users');
              dispatch(setSelectedModule('Users'));
              navigate('/main_layout/control-panel/all-users');
            } else {
              // for old dashboard
              dispatch(setSelectedModule('New Dashboard'));
              navigate(
                '/main_layout/updated_dashboard_module/updated_dashboard'
              );
              // for new updated
              // dispatch(setSelectedModule('New Dashboard'));
              // navigate('/main_layout/new-dashboard');
            }
            setOpen2(false);
          }, 500);
        } else {
          alert('Unexpected response from the server');
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        if (err.response && err.response.data && err.response.data.detail) {
          // alert(`Login failed: ${err.response.data.detail}`);
          messageApi.open({
            type: 'error',
            content: err.response.data.detail,
          });
          setIsLoading(false);
        } else {
          messageApi.open({
            type: 'error',
            content: 'Something wrong!',
          });
        }
      }
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [username, password]);

  const handleClose = () => {
    setOpen2(false);
  };

  return (
    <>
      {contextHolder}
      {isLoading === true ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open2}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <Spin size="large" spinning={isLoading}>
        <LoginContainer theme={theme} themeMode={themeMode}>
          <div
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              // width: "532px",
              background: theme?.palette?.default_card?.background,
              minHeight: '520px',
              padding: '0 50px',
              borderRadius: '16px',
              boxShadow: '28px rgba(241, 233, 233, 0.1)',
              paddingBottom: '30px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginTop: '30px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={
                    cisco
                    // greenXLogo
                  }
                  width={100}
                  // width="contain"
                  // height={60}
                />
              </div>
              <p
                style={{
                  padding: '5px 0px 0px 0px',
                  margin: '0px',
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                }}
              >
                Welcome to Datacenter
              </p>
              <p
                style={{
                  padding: '5px 0px 0px 0px',
                  margin: '0px',
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                }}
              >
                Sustainability
              </p>
            </div>
            <div style={{ flexBasis: '40%', paddingTop: '40px' }}>
              <label
                style={{
                  fontSize: '14px',
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                User Name
              </label>
              <br />
              {/* <Input
                className="login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                style={{
                  backgroundColor: "#050C17",
                  border: "1px solid #36424E",
                  color: "white",
                  width: "350px",
                  height: "40px",
                  marginTop: "10px",
                }}
                prefix={<UserOutlined className="site-form-item-icon" />}
              /> */}
              <CustomInput
                // nested="true"
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
                onChange={(e) => setUsername(e.target.value)}
                suffix={
                  <UserOutlined size={16} className="site-form-item-icon" />
                }
                // onChange={handleSearch}
              />
            </div>
            <div style={{ flexBasis: '40%', paddingTop: '20px' }}>
              <label
                style={{
                  fontSize: '14px',
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Password
              </label>
              <br />
              {/* <Input.Password
                className="login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                type="password"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #36424E",
                  color: "#e5e5e5",
                  width: "350px",
                  height: "40px",
                  marginTop: "10px",
                }}
                prefix={<KeyOutlined />}
              /> */}
              <CustomInput
                type="password"
                // nested="true"
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
                // prefix={
                //   <AiOutlineLock
                //     className="site-form-item-icon"
                //     style={{
                //       color: theme?.palette?.main_layout?.primary_text,
                //     }}
                //   />
                // }
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ flexBasis: '40%', paddingTop: '40px' }}>
              <Button
                style={{
                  width: '22rem',
                  height: '40px',
                  color: theme?.palette?.default_button?.primary_text,
                  backgroundColor:
                    theme?.palette?.default_button?.add_background,
                }}
                type="submit"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '40px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Don't have an account?
              </p>
              <Button
                style={{
                  // width: "22rem",
                  height: '40px',
                  color: theme?.palette?.main_layout?.secondary_text,
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onClick={() => navigate('/sign-up')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </LoginContainer>
      </Spin>
    </>
  );
}

export default Index;

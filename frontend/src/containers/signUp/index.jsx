import React, { useState, useEffect, useContext } from 'react';
import Input from 'antd/es/input/Input';
import { Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
// import cisco from "../../resources/svgs/cisco.svg";
import cisco from '../../resources/images/logo.png';
import greenXLogo from '../../resources/images/GreenX.png';
import axios from 'axios';
import { baseUrl } from '../../utils/axios';
import Swal from 'sweetalert2';
import { message } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { UserOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import CustomSelector from '../../components/customSelector';
import { height, width } from '@mui/system';
import DefaultSelect from '../../components/selects';
import Selector from '../../components/selector';
import { useTheme } from '@mui/material/styles';
import bg from '../../resources/images/login_bg.png';
import styled from 'styled-components';
import { AppContext } from '../../context/appContext';
import { CustomInput } from '../../components/customInput';
import { signupUser } from '../../services/authServices/authServices';

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
const options = [
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Super Admin',
    value: 'super_admin',
  },
];
const names = ['gas', 'sgdjga'];
function Index() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const validateEmail = (email) => {
    // Check if the email contains @ and .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    // Regular expression for at least 1 capital letter, 1 small letter, 1 digit, and 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  };

  const handleSignUp = async (event) => {
    if (name == '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter name',
      });
    } else if (email == '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter email!',
      });
    } else if (!validateEmail(email)) {
      setError("Email must contain '@' and end with '.com'");
      messageApi.open({
        type: 'error',
        content: "Email must contain '@' and end with '.com'",
      });
    } else if (password == '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter password!',
      });
    } else if (!validatePassword(password)) {
      setPasswordError(
        'Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character!'
      );

      messageApi.open({
        type: 'error',
        content: 'Password Patteren is invalid!',
      });
    }
    // else if (role == "") {
    //   messageApi.open({
    //     type: "error",
    //     content: "Please select role!",
    //   });
    // }
    else {
      try {
        setIsLoading(true);

        const payload = {
          name: name,
          email: email,
          password: password,
          role: role,
        };
        const response = await signupUser(payload);
        // const response = await axios.post(baseUrl + "/auth/sign-up", payload);
        console.log(response, 'sign up response');
        if (
          response.status === 200
          //  &&
          // response.data.user_info.is_superuser === false
        ) {
          setIsLoading(false);
          messageApi.open({
            type: 'success',
            content: 'Registered Successfully!',
          });
          navigate('/login');
        } else {
          alert('Unexpected response from the server');
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        if (err.response && err.response.data && err.response.data.detail) {
          // alert(`Login failed: ${err.response.data.detail}`);
          navigate('/main_layout');
          messageApi.open({
            type: 'error',
            content: err.response.data.detail,
          });
          setIsLoading(false);
        }
        // else {
        //   alert("Login failed. Please check your credentials.");
        // }
      }
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSignUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [name, password]);

  const handleClose = () => {
    setOpen2(false);
  };

  const onChange = (value) => {
    setRole(value);
  };

  return (
    <>
      {contextHolder}

      <Spin size="large" spinning={isLoading}>
        <LoginContainer theme={theme} themeMode={themeMode}>
          <div
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              background: theme?.palette?.default_card?.background,
              minHeight: '520px',
              padding: '0 40px 0 40px',
              borderRadius: '16px',
              boxShadow: '28px rgba(241, 233, 233, 0.1)',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginTop: '20px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={greenXLogo}
                  width={100}
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
                username
              </label>
              <br />
              <CustomInput
                type="text"
                // placeholder="Name"
                value={name}
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
                onChange={(e) => setName(e.target.value)}
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
              {/* <Input
                className="login"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            </div>
            <div style={{ flexBasis: '40%', paddingTop: '20px' }}>
              <label
                style={{
                  fontSize: '14px',
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Email
              </label>
              <br />
              <CustomInput
                type="email"
                // placeholder="Email"
                value={email}
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined className="site-form-item-icon" />}
              />
              {/* <Input
                className="login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {error && (
                <div
                  style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}
                >
                  {error}
                </div>
              )}
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
              <CustomInput
                type="password"
                // placeholder="Password"
                value={password}
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<KeyOutlined className="site-form-item-icon" />}
              />
              {/* <Input.Password
                className="login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
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

              {passwordError && (
                <div
                  style={{
                    color: 'red',
                    marginTop: '5px',
                    fontSize: '12px',
                    width: '350px',
                  }}
                >
                  {passwordError}
                </div>
              )}
            </div>
            {/* <div style={{ flexBasis: "40%", paddingTop: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Role
              </label>
              <Selector
                style={{ width: "100%", height: "40px", marginTop: "10px" }}
                options={options}
                onChange={onChange}
              />
            </div> */}
            <div style={{ flexBasis: '40%', paddingTop: '30px' }}>
              <Button
                style={{
                  width: '22rem',
                  height: '40px',
                  fontWeight: 500,
                  color: theme?.palette?.default_button?.primary_text,
                  backgroundColor:
                    theme?.palette?.default_button?.add_background,
                  letterSpacing: '1px',
                }}
                type="submit"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '10px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                Already have an account?
              </p>
              <Button
                style={{
                  boxShadow: 'none',
                  color: theme?.palette?.main_layout?.secondary_text,
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
            </div>
          </div>
        </LoginContainer>
      </Spin>
    </>
  );
}

export default Index;

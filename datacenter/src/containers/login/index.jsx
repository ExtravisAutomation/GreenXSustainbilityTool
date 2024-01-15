import React, { useState } from "react";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import cisco from "../../resources/svgs/cisco.svg";
import axios from "axios";
import { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import { message } from "antd";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Index() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [open2, setOpen2] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (event) => {
    try {
      const response = await axios.post(baseUrl + "/sign-in", {
        email__eq: username,
        password: password,
      });
      console.log(response, "login response");
      if (response.data.access_token !== 0) {
        // messageApi.open({
        //   type: "success",
        //   content: "Successfully Logged in",
        // });
        Swal.fire({
          title: "Login successfully",
          // text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        // setOpen2(true);

        localStorage.setItem("user_name", response.data.user_info.name);
        localStorage.setItem("auth_token", response.data.user_info.user_token);
        localStorage.setItem("access_token", response.data.access_token);

        setTimeout(() => {
          navigate("/main_layout");
          setOpen2(false);
        }, 1000);
      } else {
        alert("Unexpected response from the server");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        // alert(`Login failed: ${err.response.data.detail}`);
        messageApi.open({
          type: "error",
          content: err.response.data.detail,
        });
      }
      // else {
      //   alert("Login failed. Please check your credentials.");
      // }
    }
  };

  const handleClose = () => {
    setOpen2(false);
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

      <div
        style={{
          height: "100vh",
          color: "#e5e5e5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            border: "1px solid #5A5A5A",
            width: "532px",
            height: "416px",
            borderRadius: "16px",
            boxShadow: " 28px rgba(241, 233, 233, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ paddingTop: "10px" }}>
              <img src={cisco} width={100} height={60} />
            </div>
            <h3 style={{ padding: "5px 0px 0px 0px", margin: "0px" }}>
              Welcome to Datacenter Sustainability!
            </h3>
            <p style={{ padding: "0px", margin: "0px" }}>Login your account</p>
            <div style={{ flexBasis: "40%", paddingTop: "40px" }}>
              <label>User Name</label>
              <br />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                style={{
                  backgroundColor: "#050C17",
                  border: "1px solid #5A5A5A",
                  color: "white",
                  width: "350px",
                  marginTop: "10px",
                }}
              />
            </div>
            <div style={{ flexBasis: "40%", paddingTop: "20px" }}>
              <label>Password</label>
              <br />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                type="password"
                style={{
                  backgroundColor: "#050C17",
                  border: "1px solid #5A5A5A",
                  color: "#e5e5e5",
                  width: "350px",
                  marginTop: "10px",
                }}
              />
            </div>
            <div style={{ flexBasis: "40%", paddingTop: "40px" }}>
              <Button
                style={{
                  width: "22rem",
                  color: "#e5e5e5",
                  backgroundColor: "#1871A8",
                }}
                type="submit"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;

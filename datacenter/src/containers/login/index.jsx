import React, { useState } from "react";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === "sami" && password === "sami@123") {
      // Use navigate to navigate to the specified route
      navigate("/dashboard_module/dashboard");
    } else {
      console.log("Incorrect username or password");
    }
  };


  return (
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
          width: "432px",
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
          <h2 style={{ padding: "25px 0px 0px 0px", margin: "0px" }}>
            Welcome Login
          </h2>
          <p style={{ padding: "0px", margin: "0px" }}>Login your account</p>
          <div style={{ flexBasis: "40%", paddingTop: "40px" }}>
            <label>User Name</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              style={{
                backgroundColor: "#050C17",
                border: "1px solid #5A5A5A",
              }}
            />
          </div>
          <div style={{ flexBasis: "40%", paddingTop: "20px" }}>
            <label>Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              type="password"
              style={{
                backgroundColor: "#050C17",
                border: "1px solid #5A5A5A",
                color: "#e5e5e5",
              }}
            />
          </div>
          <div style={{ flexBasis: "40%", paddingTop: "40px" }}>
            <Button
              style={{ width: "16rem", color: "#e5e5e5" }}
              type="primary submit"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;

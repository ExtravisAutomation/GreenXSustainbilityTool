import React, { useState } from "react";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import cisco from "../../resources/svgs/cisco.svg"

function Index() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === "sami" && password === "sami@123") {
      navigate("/main_layout");
    } else {
      alert("Incorrect username or password");
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
          <div style={{paddingTop:"10px"}}>
          <img src={cisco} width={50} height={50}/>
          </div>
          <h3 style={{ padding: "5px 0px 0px 0px", margin: "0px" }}>
            Welcome to Datacenter Sustainability
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
              style={{ width: "22rem", color: "#e5e5e5" }}
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

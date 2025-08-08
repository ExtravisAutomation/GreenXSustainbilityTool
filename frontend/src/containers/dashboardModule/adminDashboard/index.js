import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Row, Col, Progress } from "antd";
import PowerGrap from "../powerGrap";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];
const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#0D131C",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout
        style={{
          background: "#0D131C",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#050C17",
          }}
        >
          {/* <ul style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <li>item 1</li>
            <li>item 1</li>
            <li>item 1</li>
            <li>item 1</li>
            <li>item 1</li>
            <li>item 1</li>
            <li>item 1</li>
          </ul> */}
        </Header>
        <Content
          style={{
            margin: "0 16px",
            // background: "#0D131C",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row>
              <Col md={12} style={{ padding: "5px" }}>
                <div
                  style={{
                    color: "white",
                    padding: "10px 30px",
                    border: "1px solid #36424E",
                    background: "#050C17",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginBottom: "40px",
                    }}
                  >
                    Input Power
                  </p>
                  <div style={{ marginBottom: "50px", marginTop: "40px" }}>
                    <p>Device 69</p>
                    <Progress
                      steps={40}
                      percent={70}
                      size={[8, 50]}
                      // strokeColor="gray"
                      trailColor="gray"
                    />
                  </div>
                  <div style={{ marginBottom: "50px" }}>
                    <p>Device 69</p>
                    <Progress
                      steps={40}
                      percent={70}
                      size={[8, 50]}
                      // strokeColor="gray"
                      trailColor="gray"
                    />
                  </div>
                  <div style={{ marginBottom: "48.5px" }}>
                    <p>Device 69</p>
                    <Progress
                      steps={40}
                      percent={70}
                      size={[8, 50]}
                      // strokeColor="gray"
                      trailColor="gray"
                    />
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <Row justify={"space-between"}>
                  <Col md={8} style={{ padding: "5px" }}>
                    <div
                      style={{
                        padding: "10px",
                        color: "white",
                        // boxShadow: "0 4px 8px rgba(102, 101, 101, 0.812)",
                        border: "1px solid #36424E",
                        background: "#050C17",
                      }}
                    >
                      {/* <PowerGrap /> */}
                      <p
                        style={{
                          textAlign: "center",
                          width: "100%",
                          marginBottom: "40px",
                        }}
                      >
                        Required Power
                      </p>
                      <div style={{ marginBottom: "40px", marginTop: "53px" }}>
                        <p style={{ fontSize: "16px", marginBottom: "0px" }}>
                          Device 69
                        </p>
                        <p style={{ fontSize: "20px", fontWeight: 700 }}>
                          900 w
                        </p>
                      </div>{" "}
                      <br />
                      <div style={{ marginBottom: "40px" }}>
                        <p style={{ fontSize: "16px", marginBottom: "0px" }}>
                          Device 69
                        </p>
                        <p style={{ fontSize: "20px", fontWeight: 700 }}>
                          900 w
                        </p>
                      </div>{" "}
                      <br />
                      <div style={{ marginBottom: "39px" }}>
                        <p style={{ fontSize: "16px", marginBottom: "0px" }}>
                          Device 69
                        </p>
                        <p style={{ fontSize: "20px", fontWeight: 700 }}>
                          900 w
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={8} style={{ padding: "5px" }}>
                    <div
                      style={{
                        color: "white",
                        textAlign: "center",
                        padding: "10px",
                        border: "1px solid #36424E",
                        background: "#050C17",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          width: "100%",
                          marginBottom: "40px",
                        }}
                      >
                        Power Supply Efficiency
                      </p>
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={100}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                      <br />
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={75}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                      <br />
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={75}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                    </div>
                  </Col>
                  <Col md={8} style={{ padding: "5px" }}>
                    <div
                      style={{
                        color: "white",
                        textAlign: "center",
                        padding: "10px",
                        border: "1px solid #36424E",
                        background: "#050C17",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          width: "100%",
                          marginBottom: "40px",
                        }}
                      >
                        Power Supply Load
                      </p>
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={100}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                      <br />
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={75}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                      <br />
                      <Progress
                        type="dashboard"
                        size={90}
                        percent={75}
                        trailColor="gray"
                        format={(percent) => (
                          <span
                            style={{ color: "white" }}
                          >{`${percent}%`}</span>
                        )}
                      />
                      <p style={{ marginTop: "0px" }}>Device 69</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminDashboard;

import { CaretRightOutlined } from "@ant-design/icons";
import React from "react";
import { Collapse, theme } from "antd";

const getItems = (panelStyle, text, title) => [
  {
    key: "1",
    label: (
      <p
        style={{
          color: "#E4E4E4",
          margin: "0px",
          //   borderBottom: "1px solid #36424E",
        }}
      >
        {title}
      </p>
    ),
    children: text?.map((item) => (
      <p
        style={{
          color: "#E4E4E4",
          margin: "0px",
          borderBottom: "1px solid #36424E",
          padding: "10px",
          //   borderRadius: "5px",
        }}
      >
        {item}
      </p>
    )),

    style: panelStyle,
  },
];
const CustomAccordion = ({ text, title, index }) => {
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: "#050C17",
    borderRadius: token.borderRadiusLG,
  };
  return (
    <Collapse
      bordered={false}
      // defaultActiveKey={[1]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{
        background: "#09101B",
        // border: "1px solid #36424E",
        marginBottom: "30px",
      }}
      items={getItems(panelStyle, text, title)}
    />
  );
};
export default CustomAccordion;

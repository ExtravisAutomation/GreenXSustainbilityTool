import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";

const Selector = ({ options, style, onChange }) => {
  return (
    <Select
      // value={deviceName}
      placeholder="select"
      className="custom-selector"
      onChange={onChange}
      options={options}
      style={style}
      dropdownStyle={{ backgroundColor: "#36424e", color: "white" }}
      dropdownClassName="custom-dropdown"
    />
  );
};

export default Selector;

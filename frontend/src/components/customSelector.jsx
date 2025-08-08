import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";

const CustomSelector = ({
  options,
  deviceName,
  setDeviceName,
  comparison,
  defaultValue,
  style,
}) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (defaultValue) {
      console.log("default value in selector", defaultValue);

      setDevices(
        options?.filter((device) => device?.device_name !== deviceName)
      );
      setDeviceName(defaultValue?.device_name);
    }
  }, [defaultValue]);
  const handleChange = (value) => {
    // setDevices(devices?.filter((device) => device !== deviceName));

    setDeviceName(value);
  };

  return (
    <Select
      value={deviceName}
      className="custom-selector"
      onChange={handleChange}
      options={devices?.map((option, index) => ({
        label: option?.device_name,
        value: option?.device_name,
      }))}
      style={style}
      dropdownStyle={{ backgroundColor: "#36424e", color: "white" }}
      dropdownClassName="custom-dropdown"
    />
  );
};

export default CustomSelector;

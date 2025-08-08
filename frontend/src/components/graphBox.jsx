import React from 'react';
import { Tooltip } from 'antd';
import { useTheme } from '@mui/material/styles';

const GraphBox = ({ backgroundColor, data, onClick, parent = '' }) => {
  const theme = useTheme();

  return (
    <Tooltip
      overlayInnerStyle={{
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
        padding: '20px',
        width: parent === 'newDashboard' ? 300 : 'auto',
      }}
      placement="bottom"
      title={
        <span
          style={{
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          {parent === 'newDashboard' ? 'Device Name' : 'Rack Name'}
          <span
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontWeight: 600,
            }}
          >
            {' '}
            {parent === 'newDashboard' ? data?.device_name : data?.rack_name}
          </span>
          <br />
          Energy Efficiency:{' '}
          <span
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontWeight: 600,
            }}
          >
            {parent === 'newDashboard' ? data?.eer : data?.power_utilization}
          </span>
        </span>
      }
    >
      <div
        style={{
          // width: "76px",
          height: '50px',
          backgroundColor: backgroundColor,
          cursor: 'pointer', // Add this to show that it's clickable
          // borderRadius: "5px",
        }}
        onClick={onClick}
      ></div>
    </Tooltip>
  );
};

export default GraphBox;

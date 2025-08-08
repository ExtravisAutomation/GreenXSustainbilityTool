import React from 'react';
import GraphBox from './graphBox';
import Typography from 'antd/es/typography/Typography';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { light } from '@mui/material/styles/createPalette';
import { useTheme } from '@mui/material';

function HeatmapChart({ siteId, racks = [], parent = '', devices = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRedBoxClick = (rackId) => {
    navigate(`/main_layout/uam_module/racks/rackdetail`, {
      state: {
        siteId: siteId,
        rackId: rackId,
      },
    });
  };
  const handleGreenBoxClick = (rackId) => {
    navigate(`greenrackdetail`);
  };
  const handleBlueBoxClick = (rackId) => {
    navigate(`bluerackdetail`);
  };

  const text = <span>prompt text</span>;
  return (
    <div
      style={{
        borderRadius: '7px',
        minWidth: '40%',
        color: '#e5e5e5',
      }}
    >
      <Row>
        {parent === 'newDashboard'
          ? devices?.map((data) => {
              return (
                <>
                  <Col xs={4} style={{ padding: '11px' }}>
                    <GraphBox
                      backgroundColor={
                        data?.eer < 50
                          ? theme?.palette?.shades?.red
                          : data?.eer >= 50 && data?.eer < 75
                            ? theme?.palette?.shades?.light_blue
                            : theme?.palette?.shades?.light_green
                      }
                      onClick={() =>
                        console.log('deviecs clicekd', data?.device_name)
                      }
                      parent="newDashboard"
                      data={data}
                    />
                  </Col>
                </>
              );
            })
          : racks?.map((data) => {
              return (
                <>
                  <Col xs={6} style={{ padding: '11px' }}>
                    <GraphBox
                      backgroundColor={
                        data?.power_utilization < 0.5
                          ? // ? "#760903"
                            '#9B1E1E'
                          : data?.power_utilization >= 0.5 &&
                              data?.power_utilization < 1
                            ? '#203C75'
                            : '#24D9B3'
                      }
                      onClick={() => handleRedBoxClick(data.id)}
                      data={data}
                    />
                  </Col>
                </>
              );
            })}
      </Row>
    </div>
  );
}

export default HeatmapChart;

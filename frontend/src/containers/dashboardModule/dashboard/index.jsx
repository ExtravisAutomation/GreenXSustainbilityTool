import React, { useState, useEffect } from 'react';
import LineChart from './../../../components/lineChat.jsx';
import GraphTable from './../../../components/graphTable.jsx';
import PowercostGraph from '../../../components/powercostGraph.jsx';
import EmissionChart from '../../../components/emissionChart.jsx';
import HardwareLifeCycle from '../../../components/hardwareLifeCycle.jsx';
import UnusedPortsCharts from '../../../components/unusedPortGraph.jsx';
import './dashboard.css';
import Dailyco from '../../../components/dailyco.jsx';
import Co from '../../../components/co.jsx';
import UsedFspsChart from '../../../components/usedFspsChart.jsx';
import Grid from '@mui/material/Grid';
import DailyCostGraph from '../../../components/dailyCostGraph.jsx';
import TopDevicesCost from '../../../components/topDevicesCost.jsx';
import TopDevicesEnergy from '../../../components/topDevicesEnergy.jsx';
import TopDevicesGhg from '../../../components/topDeviceGhg.jsx';
import electric from '../../../resources/svgs/electric.png';
import dollar from '../../../resources/svgs/dollar.svg';
import dollar1 from '../../../resources/svgs/dollar1.svg';
import leaf from '../../../resources/svgs/leaf.png';
import UaeSiteMap from '../../../components/uaeSiteMap.jsx';
import HeatmapChart from '../../../components/heatmapChart.jsx';
import Dropdown from '../../../components/dropdown.jsx';
import MonthlyCostGraph from '../../../components/monthlyCostGraph.jsx';
import Vendor from '../../../components/Vendor.jsx';
import EnergyMix from '../../../components/energyMix.jsx';
import car from '../../../resources/svgs/car.png';
import airplane from '../../../resources/svgs/airplane.png';
import { baseUrl } from '../../../utils/axios/index.js';
import axios from 'axios';

import DevicesCommonTable from '../../../components/powerCommonTable.jsx';
import { Row, Col } from 'antd';
function MainDashboard() {
  const [topDevices, setTopDevices] = useState([]);
  const [topThroughputDevices, setTopThroughputDevices] = useState([]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 columns
    gridTemplateRows: 'repeat(2, 1fr)', // 2 rows
    gap: '8px', // Adjust the gap between cells
  };

  const itemStyle = {
    border: '1px solid #000', // Border style
    padding: '8px', // Adjust the padding inside cells
    textAlign: 'center', // Center text within cells
  };
  const chartData = [
    { value: 1048, name: 'End of Sale' },
    { value: 580, name: 'End of Life' },
    { value: 484, name: 'End of Support' },
  ];

  const getTopFabricNodes = async () => {
    const access_token = localStorage.getItem('access_token');

    try {
      const response = await axios.get(`${baseUrl}/apic/top-fabric-nodes`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const top5Entries = response.data.slice(0, 5);
      setTopDevices(top5Entries);
    } catch (error) {
      console.error('Error fetching top fabric nodes:', error);
    }
  };

  const getTopThroughputNodes = async () => {
    const access_token = localStorage.getItem('access_token');

    try {
      const response = await axios.get(
        `${baseUrl}/apic/top-fabric-nodes-drawn-last`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Handle response data as needed
      // console.log(response, "ttttt throughput");
      setTopThroughputDevices(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching top fabric nodes:', error);
    }
  };

  useEffect(() => {
    getTopFabricNodes();
    getTopThroughputNodes();
  }, []);

  return (
    <>
      <div style={{ width: '97%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            padding: '20px 0px 0px 0px',
          }}
        >
          <Dropdown />
        </div>

        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            height: '570px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            <div className="cost-graph-wrapper" style={{ height: '470px' }}>
              <DailyCostGraph heading="Cost" headericon={dollar1} />
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            height: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            <div
              className="cost-graph-wrapper"
              style={{ height: 'auto', padding: '25px 15px' }}
            >
              <MonthlyCostGraph heading="Energy" headericon={electric} />
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            // height: "570px",
            padding: '15px',
          }}
        >
          <Row>
            <Col xs={24} xl={12} style={{ padding: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  border: '1px solid #36424E',
                  flexBasis: '48%',
                  borderRadius: '7px',
                  color: 'white',
                }}
              >
                <p style={{ fontWeight: 'bold', padding: '0px 20px' }}>
                  Top 5 Devices by Co2 Emission from Last Month
                </p>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    Name{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    CO2-eq emission/h [gco2 eq/hr]{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    Average CO2{' '}
                  </div>
                </div>

                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    {' '}
                    Cisco Leaf 202
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      55.2g{' '}
                    </span>{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      20.5g{' '}
                    </span>{' '}
                  </div>
                </div>

                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device A
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      40.3g{' '}
                    </span>{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      25.0g{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device B
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      30.0g{' '}
                    </span>{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      15.0g{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device C
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      40.4g{' '}
                    </span>{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      20.4g{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device D
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      50.5g{' '}
                    </span>{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      30.5g{' '}
                    </span>{' '}
                  </div>
                </div>

                <div></div>
              </div>
            </Col>
            <Col xs={24} xl={12} style={{ padding: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  border: '1px solid #36424E',
                  flexBasis: '48%',
                  borderRadius: '7px',
                  color: 'white',
                }}
              >
                <p style={{ fontWeight: 'bold', padding: '0px 20px' }}>
                  Top 5 Devices with higher energy consumption from Last Month
                </p>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    Name{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    Cost Increase From Last Month
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device A{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      45%{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Cisco Spine 101
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      50%{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device B
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      40%{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device C
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      55%{' '}
                    </span>{' '}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                      color: '#0490E7',
                    }}
                  >
                    Device D
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      alignItems: 'center',
                      justifyContent: 'start',
                      padding: '0px 20px',
                      border: '1px solid #36424E',
                      flexBasis: '50%',
                      height: '44px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        backgroundColor: '#4C791B',
                        padding: '3px 8px',
                        borderRadius: '7px',
                      }}
                    >
                      20%
                    </span>{' '}
                  </div>
                </div>

                <div></div>
              </div>
            </Col>
          </Row>
        </div>
        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            // height: "570px",
            padding: '15px',
          }}
        >
          <Row>
            <Col xs={24} xl={12} style={{ padding: '15px' }}>
              {/* <TopDevices /> */}
              <DevicesCommonTable
                heading="Top 5 Devices Power Utilization"
                topDevicesUnit={'W/24h'}
                topDevices={topDevices}
              />
            </Col>

            <Col xs={24} xl={12} style={{ padding: '15px' }}>
              {/* <TopThroughput /> */}
              <DevicesCommonTable
                heading="Top 5 Devices Traffic Throughput"
                throughputUnit={'Bytes'}
                topDevices={topThroughputDevices}
              />
            </Col>
          </Row>
        </div>
        {/* ============== */}
        {/* <div
          style={{
            border: "1px solid #36424E",
            marginTop: "30px",
            borderRadius: "7px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                border: "1px solid #36424E",
                flexBasis: "48%",
                borderRadius: "7px",
              }}
            >
              <p style={{ fontWeight: "bold", padding: "0px 20px" }}>
                Top Racks Utilization
              </p>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                  }}
                >
                  Name{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                  }}
                >
                  Cost
                </div>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                  }}
                >
                  Input Power
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "500",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                    color: "#0490E7",
                  }}
                >
                  Rack AA{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "500",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                  }}
                >
                  AED 40{" "}
                  <span
                    style={{
                      backgroundColor: "#4C791B",
                      padding: "4px 28px",
                      marginLeft: "5px",
                      borderRadius: "7px",
                    }}
                  ></span>{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontWeight: "500",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "0px 20px",
                    border: "1px solid #36424E",
                    flexBasis: "50%",
                    height: "44px",
                  }}
                >
                  30 kWh{" "}
                  <span
                    style={{
                      backgroundColor: "#4C791B",
                      padding: "4px 20px",
                      marginLeft: "5px",
                      borderRadius: "7px",
                    }}
                  ></span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* ============== */}
        {/* <Grid container spacing={3} style={{ marginTop: "0px" }}>
      
        <Grid item xs={12} sm={6}>
          <div className="wrapper">
            <GraphTable />
          </div>
        </Grid>
      </Grid> */}
        <div>
          <div className="power-cost-chart-wrapper">
            <PowercostGraph />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
          }}
        >
          <div style={{ flexBasis: '40%' }} className="heat-map">
            <HeatmapChart />
          </div>
          <div className="emission-chart-wrapper">
            <HardwareLifeCycle chartData={chartData} />
          </div>
        </div>
        {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <div className="donut-graph-wrapper">
          <HardwareLifeCycle chartData={chartData} />
        </div>
        <div className="donut-graph-wrapper">
          <UnusedPortsCharts />
        </div>
        <div className="donut-graph-wrapper">
          <UsedFspsChart />
        </div>
      </div> */}
        {/* 3 x Table Dataaaaa */}
        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            height: '500px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              marginTop: '30px',
            }}
          >
            <div className="table-data-wrapper" style={{ height: '450px' }}>
              <TopDevicesCost heading="Estimated Cost" headericon={dollar} />
            </div>
            <div className="table-data-wrapper" style={{ height: '450px' }}>
              {' '}
              <TopDevicesEnergy
                heading="Energy Consumption"
                headericon={electric}
              />
            </div>
            <div className="table-data-wrapper" style={{ height: '450px' }}>
              <TopDevicesGhg
                heading="Estimated GHG Emissions"
                headericon={leaf}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            marginBottom: '20px',
            borderRadius: '7px',
            height: '490px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              padding: '0px 15px',
              width: '340px',
              border: '1px solid #36424E',
              borderRadius: '7px 0px 0px 7px ',
              paddingTop: '30px',
              flexDirection: 'column',
              color: '#e5e5e5',
            }}
          >
            <p
              style={{
                padding: '0px',
                margin: '0px',
                fontSize: '25px',
                fontWeight: 'bold',
              }}
            >
              Emission this Month{' '}
            </p>
            <p
              style={{
                padding: '10px 0px',
                margin: '0px',
                fontWeight: 'bold',
                fontSize: '30px',
                color: '#1dec5b',
              }}
            >
              5,187 kg CO2e
            </p>

            <p>
              Estimated Monthly carbon dioxide equivalent emissions (based on
              energy usage) Emissions are estimates from Utility data
            </p>
            <div>
              <img src={car} width={50} height={50} />
              <p style={{ padding: '0px', margin: '0px', fontWeight: '500' }}>
                Equivalent of 416 car trips of 1070 km each in a gas-powered
                passenger vehicle.
              </p>
              <p></p>
            </div>
            <div>
              <img src={airplane} width={50} height={50} />
              <p style={{ padding: '0px', margin: '0px', fontWeight: '500' }}>
                33 Airplane Flights of 1 hour, 50 minutes each
              </p>
              <p></p>
            </div>
          </div>
          <div></div>

          <div className="energymix-wrapper">
            <EnergyMix />
            <div style={{ paddingTop: '40px', maxWidth: '350px' }}>
              <p
                style={{
                  paddingTop: '20 px',
                  margin: '0px',
                  fontWeight: 'bold',
                }}
              >
                Consolidation and Decommissioning:
              </p>
              <p style={{ fontSize: '14px' }}>
                <span style={{ marginRight: '5px' }}>&#8226;</span> Regularly
                assess server usage, decommission outdated or underutilized
                servers, and consolidate workloads to optimize resource usage
              </p>

              <p
                style={{
                  paddingTop: '10px',
                  margin: '0px',
                  fontWeight: 'bold',
                }}
              >
                High-Efficiency Power Supplies:
              </p>
              <p style={{ fontSize: '14px' }}>
                <span style={{ marginRight: '5px' }}>&#8226;</span> Use power
                supplies with high-efficiency ratings (e.g., 80 PLUS Platinum or
                Titanium)
              </p>

              <p
                style={{
                  paddingTop: '10px',
                  margin: '0px',
                  fontWeight: 'bold',
                }}
              >
                Data Center Certification:
              </p>
              <p style={{ fontSize: '14px' }}>
                <span style={{ marginRight: '5px' }}>&#8226;</span> Pursue
                certifications such as LEED (Leadership in Energy and
                Environmental Design) or ISO 14001 for environmental management.
              </p>
              <p
                style={{
                  paddingTop: '10px',
                  margin: '0px',
                  fontWeight: 'bold',
                }}
              >
                Regular Maintenance:
              </p>
              <p style={{ fontSize: '14px' }}>
                <span style={{ marginRight: '5px' }}>&#8226;</span>Conduct
                regular maintenance of IT equipment and cooling systems to
                ensure optimal performance.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #36424E',
            marginTop: '30px',
            borderRadius: '7px',
            height: '570px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            <div className="cost-graph-wrapper" style={{ height: '470px' }}>
              <Dailyco heading="Emission" headericon={electric} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainDashboard;

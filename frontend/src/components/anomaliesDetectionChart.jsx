import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { Tooltip as AntdTooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// import "antd/dist/antd.css";

const AnomaliesChart = ({
  data,
  host,
  dashboard,
  report,
  siteName = '',
  deviceName = '',
}) => {
  const theme = useTheme();

  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const determineEfficiencyStatus = (value) => {
    if (value < 0.5) return { status: 'Inefficient', color: 'red' };
    if (value >= 0.5 && value <= 1)
      return { status: 'Moderately Efficient', color: 'blue' };
    return { status: 'Efficient', color: 'green' };
  };

  const option = {
    legend: {
      show: true,
      icon: 'circle',
      itemGap: 20, // Adjust the gap between legend items
      itemWidth: 20, // Adjust the width of legend items
      textStyle: {
        fontSize: 12, // Adjust the font size of legend texts
        // color:
        //   dashboard == 'true'
        //     ? theme?.palette?.main_layout?.primary_text
        //     : 'black',
        color: theme?.palette?.main_layout?.primary_text,
      },
      bottom: 5,
      left: 0,
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '20%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme?.palette?.graph?.toolTip_bg,
      borderColor: theme?.palette?.graph?.tooltip_border,
      textStyle: {
        color: theme?.palette?.main_layout?.primary_text,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        // fontWeight: "bold",
        lineHeight: 1.5,
      },
      // params give data on hover the points
      formatter: function (params) {
        console.log('params:::::', params);

        let tooltipContent = `<div>Time: <span style = 'color: ${theme?.palette?.main_layout?.secondary_text}'>${params[0].axisValueLabel}</span></div>`;
        params.forEach((item) => {
          if (item.seriesName === 'Data Traffic') {
            tooltipContent +=
              item.data > 0
                ? `<div>${item.seriesName}: <span style = 'color: ${theme?.palette?.main_layout?.secondary_text}'>${item.data}</span> GB</div>`
                : `<div>${item.seriesName}: no data</div>`;
          } else if (item.seriesName === 'Energy Efficiency') {
            const { status, color } = determineEfficiencyStatus(item.data);
            tooltipContent +=
              item.data > 0
                ? `<div>${item.seriesName}: <span style = 'color: ${theme?.palette?.main_layout?.secondary_text}'>${item.data}</span> GB</div>  <span style="color:${color}">(${status})</span></div>`
                : `<div>${item.seriesName}: no data</div>`;
          }
        });
        return tooltipContent;
      },
    },
    toolbox: false,
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.map((data) => data.time) || [],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#151A20',
          type: 'solid',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Data Traffic (GB)',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151A20',
            type: 'solid',
          },
        },
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: -270,
        nameTextStyle: {
          verticalAlign: 'middle',
          align: 'center',
        },
      },
      {
        type: 'value',
        name: 'Energy Efficiency Ratio',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151A20',
            type: 'solid',
          },
        },
        nameLocation: 'middle',
        nameGap: 45,
        nameRotate: 270,
        nameTextStyle: {
          verticalAlign: 'middle',
          align: 'center',
        },
      },
    ],
    series: [
      {
        name: 'Data Traffic',
        type: 'line',
        data: data?.map((data) => data.total_bytes_rate_last_gb),
        yAxisIndex: 0,

        itemStyle: {
          color: theme?.palette?.graph?.graph_area?.secondary_line,
          //   color: `${theme?.palette?.graph?.graph_area?.line}`,
        },
      },
      {
        name: 'Energy Efficiency',
        type: 'line',
        data: data?.map((data) => data.energy_consumption),
        yAxisIndex: 1,
        itemStyle: {
          // color: '#FDCF2B',
          color: `${theme?.name.includes('Purple') ? '#FDCF2B' : `${theme?.palette?.graph?.graph_area?.line}`}`,
          // color: `${theme?.palette?.graph?.graph_area?.secondary_line}`,
        },
      },
    ],
  };
  console.log('dashboard::::::', dashboard);

  const renderLegend = () => {
    return (
      <div
        style={{
          position: 'absolute',
          // bottom: `${dashboard == 'true' ? '0px' : '35px'}`,
          bottom: '0px',
          right: 20,
          display: 'flex',
          zIndex: 999,
        }}
      >
        <AntdTooltip
          title={
            <div>
              <div>
                The Traffic Throughput metric measures data transfer efficiency
                in networks, calculated as actual data throughput divided by
                2**30 to express the value in gigabytes (GB).{' '}
                <span
                  style={{
                    color: `${theme?.palette?.graph?.graph_area?.line}`,
                    // color: '#2268D1',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate('/main_layout/about', {
                      state: {
                        title: 'traffic',
                      },
                    })
                  }
                >
                  see details
                </span>
              </div>
            </div>
          }
          overlayInnerStyle={{
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            borderColor: theme?.palette?.graph?.tooltip_border,
            borderWidth: 1,
            color: theme?.palette?.graph?.title,
            // backgroundColor: '#050C17',
            // border: '1px solid #36424E',
            width: '300px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 20,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                backgroundColor: `${theme?.palette?.graph?.graph_area?.secondary_line}`,
                // backgroundColor: theme?.palette?.main_layout?.secondary_text,
                // borderRadius: '50%',
                marginRight: 5,
              }}
            ></span>
            <span
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 13,
              }}
            >
              Data Traffic
            </span>
          </div>
        </AntdTooltip>

        <AntdTooltip
          title={
            <div>
              <div>
                The energy efficiency ratio measures how efficiently data center
                equipment uses energy, calculated as the ratio of power output
                to power input.{' '}
                <span
                  style={{
                    // color: '#2268D1',
                    color: `${theme?.palette?.graph?.graph_area?.line}`,
                    // color: `${theme?.palette?.graph?.graph_area?.secondary_line}`,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate('/main_layout/about', {
                      state: {
                        title: 'ee',
                      },
                    })
                  }
                >
                  see details
                </span>
              </div>
            </div>
          }
          overlayInnerStyle={{
            // backgroundColor: '#050C17',
            // backgroundColor: theme?.palette?.graph?.toolTip_bg,
            // Tooltip bg changed
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            borderColor: theme?.palette?.graph?.tooltip_border,
            borderWidth: 1,

            color: theme?.palette?.graph?.title,

            // border: '1px solid #36424E',
            width: '300px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 10,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                backgroundColor: `${theme?.name.includes('Purple') ? '#FDCF2B' : `${theme?.palette?.graph?.graph_area?.line}`}`,
                // backgroundColor: `${theme?.palette?.graph?.graph_area?.secondary_tooltip}`,
                // backgroundColor: `${theme?.palette?.graph?.graph_area?.secondary_line}`,
                // backgroundColor: '#4C69B5',
                // for rounded tooltip
                // borderRadius: '50%',
                marginRight: 5,
              }}
            ></span>
            <span
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 13,
              }}
            >
              Energy Efficiency
            </span>
          </div>
        </AntdTooltip>
      </div>
    );
  };

  return (
    <div
      style={{ position: 'relative', height: dashboard ? '246px' : '265px' }}
    >
      {renderLegend()}
      <div
        style={{
          width: '100%',
          height: report === 'true' ? '220px' : dashboard ? '270px' : '230px',
        }}
      >
        <ReactEcharts
          ref={chartRef}
          option={option}
          style={{ height: dashboard ? '260px' : '240px', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default AnomaliesChart;

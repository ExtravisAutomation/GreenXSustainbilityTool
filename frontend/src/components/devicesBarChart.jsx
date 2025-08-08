import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Tooltip as AntdTooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const DevicesBarChart = ({ data, report, pcr, onClick }) => {
  const theme = useTheme();
  // console.log('ChartData:::::::::', data);

  const navigate = useNavigate();
  // Ensure data is formatted correctly
  const chartData = pcr
    ? data?.map((device) => [
        device?.device_id,
        device?.device_name,
        device?.pcr,
      ])
    : data?.map((device) => [
        device?.device_id,
        device?.device_name,
        device?.carbon_emission,
      ]);
  // const pcrData = data?.map((device) => [device?.device_name, device?.pcr]);
  // console.log("chartData", chartData);
  const option = {
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: data?.length > 15 ? 50 : '5%', // leave space for slider and legend
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme?.palette?.graph?.toolTip_bg,
      borderColor: theme?.palette?.graph?.tooltip_border,
      textStyle: {
        color: theme?.palette?.main_layout?.primary_text,
        fontSize: 14,
        fontFamily: 'inter',
        fontWeight: 'bold',
        lineHeight: 1.5,
      },

      formatter: function (params) {
        if (params.length === 0) return '';
        const device = params[0].axisValueLabel;
        const value = params[0]?.data[2]; // <- This gets PCR or Carbon Emission

        return `
          <div>Device: <span style="color:${
            theme?.palette?.main_layout?.secondary_text
          }"> ${device}</span></div>
          <div>${
            pcr ? 'Power Consumption Ratio' : 'Carbon Emission'
          }: <span style="color:${
            theme?.palette?.main_layout?.secondary_text
          }"> ${value}</span> ${pcr ? 'W/Gbps' : 'KG'}</div>
        `;
      },
    },

    dataset: [
      // data key related
      {
        dimensions: ['device_id', 'device_name', 'carbon_emission'],
        source: chartData ? chartData : [],
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: 'carbon_emission', order: 'desc' },
        },
      },
    ],

    xAxis: {
      type: 'category',
      axisLabel: { interval: 0, rotate: 60 },
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#979797',
        },
      },
      axisLabel: {
        textStyle: {
          color: '#979797',
          fontSize: '13px',
        },
        formatter: function (value) {
          return value + ' ' + `${pcr ? 'W/Gbps' : 'KG'}`;
        },
      },
    },
    // mycode
    dataZoom:
      data?.length > 15
        ? [
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              height: 1,
              bottom: 30,
              start: 0,
              end: (15 / data.length) * 100,

              backgroundColor: theme?.palette?.graph?.slider?.backgroundColor,
              fillerColor: theme?.palette?.graph?.slider?.fillerColor,

              handleStyle: {
                color: theme?.palette?.graph?.slider?.handleColor,
                borderColor: theme?.palette?.graph?.slider?.handleColor,
              },

              emphasis: {
                fillerColor: theme?.palette?.graph?.slider?.hoverFillerColor,
                handleStyle: {
                  color: theme?.palette?.graph?.slider?.handleHoverColor,
                  borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
                },
                moveHandleStyle: {
                  color: theme?.palette?.graph?.slider?.handleHoverColor,
                  borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
                },
              },
            },
            {
              type: 'inside', // <-- Add this block
              xAxisIndex: 0,
              zoomOnMouseWheel: false,
              moveOnMouseWheel: true,
              moveOnMouseMove: true,
            },
          ]
        : [],
    series: [
      {
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          color: theme?.name.includes('Purple')
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // { offset: 1, color: '#6568Ed' },
                // // { offset: 0.5, color: '#7b52db' },
                // { offset: 0, color: '#9619B5' },
                { offset: 1, color: '#5454be' },

                { offset: 0, color: '#791b9c' },
              ])
            : theme?.palette?.graph?.graph_area?.line,
        },
        // itemStyle: {
        //   color: theme?.name.includes('Purple')
        //     ? theme?.palette?.graph?.graph_area?.gradient
        //     : theme?.palette?.graph?.graph_area?.line,
        //   // color: theme?.palette?.graph?.graph_area?.line,
        //   // color: theme?.palette?.main_layout?.secondary_text,
        // },
        encode: { x: 'device_name', y: 'carbon_emission' },
      },
      {
        type: 'line',
        itemStyle: {
          color: `${theme?.name?.includes('Purple') ? theme?.palette?.graph?.graph_area?.secondary_line : '#FF0000'}`,
        },
        encode: { x: 'device_name', y: 'carbon_emission' },
      },
    ],
  };
  const renderLegend = () => {
    return (
      <div style={{ position: 'absolute', zIndex: 999, bottom: 0, left: 30 }}>
        <AntdTooltip
          title={
            <div>
              <div>
                To calculate CO2 emissions, use real-time electricity data from
                the Electricity Map API, which provides carbon intensity
                information.{' '}
                <span
                  style={{
                    color: `${theme?.palette?.main_layout?.secondary_text}`,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate('/main_layout/about', {
                      state: {
                        title: 'co2',
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
            // mycode: if they want to change the bg
            // backgroundColor: '#050C17',
            // border: '1px solid #36424E',
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            borderColor: theme?.palette?.graph?.tooltip_border,
            borderWidth: 1,
            color: theme?.palette?.graph?.title,
            width: '300px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 10,
              cursor: 'default',
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                backgroundColor: theme?.palette?.main_layout?.secondary_text,
                borderRadius: '50%',
                marginRight: 5,
              }}
            ></span>
            <span
              style={{
                color: report
                  ? 'black'
                  : theme?.palette?.main_layout?.primary_text,
                fontSize: 13,
              }}
            >
              {pcr
                ? 'Sites Power Consumption Ratio'
                : 'Sites Carbon Emission ratio'}
            </span>
          </div>
        </AntdTooltip>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {renderLegend()}

      <ReactECharts
        option={option}
        style={{ height: '350px' }}
        onEvents={{
          click: onClick,
        }}
      />
    </div>
  );
};

export default DevicesBarChart;

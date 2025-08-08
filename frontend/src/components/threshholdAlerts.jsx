import React, { useEffect, useContext } from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { Tooltip as AntdTooltip } from 'antd';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const ThreshholdAlerts = ({
  data,
  siteId,
  threshholdDeviceId,
  siteName,
  deviceName,
  inventory,
}) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const chartDom = document.getElementById('thresh');
    const myChart = echarts.init(chartDom);

    // Extract the time and energy_consumption values from the data
    const dates = data?.map((entry) => entry.time);
    const energyConsumptions = data?.map((entry) => entry.energy_efficiency);

    const determineEfficiencyStatus = (value) => {
      if (value === 0) return { status: 'no data', color: '' };
      if (value > 0 && value < 0.5)
        return { status: 'Inefficient', color: 'red' };
      if (value >= 0.5 && value <= 1)
        return {
          status: 'Moderately Efficient',
          color: `${theme?.palette?.main_layout?.secondary_text}`,
        };
      return { status: 'Efficient', color: 'green' };
    };
    const option = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '14%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        // position: function (pt) {
        //   return [pt[0], "-68%"];
        // },
        confine: true,
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 12,
        },
        formatter: function (params) {
          const data = params[0].data;
          const { status, color } = determineEfficiencyStatus(data);
          return `
           <p>
                  Site Name: <span style="
                   color: ${theme?.palette?.main_layout?.secondary_text}">${siteName}</span>
                </p>
                  <p style="border-bottom: 1px solid #36424E; padding-bottom: 5px
            ">
                  Device Name: <span style="
                   color: ${theme?.palette?.main_layout?.secondary_text}">${deviceName}</span>
                </p>
          Time: ${params[0].name}<br /> <p style="border-bottom: 1px solid #36424E; padding-bottom:10px;">${params[0].seriesName}: ${data} <span style="color:${color}">( ${status} )</span></p>
           <div>
           <div>
                        <p >0 - 0.5 ( <span style = "color:#fb0200"> Inefficient </span>)</p>
                        <p >0.5 - 1 ( <span style="color: ${theme?.name?.includes('Purple') ? theme?.palette?.main_layout?.secondary_text : '#0490E7'}" > Moderately Efficient </span>)</p>
                      </div>
                      <p>1 - above ( <span style = "color:#42AE46"> Efficient</span>)</p>
          </div> 
          `;
        },
      },
      toolbox: {
        show: false,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        // name: 'Power Output / Power Input',
        name: 'Energy Efficiency (%)',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: -270,
        nameTextStyle: {
          // verticalAlign: "middle",
          // align: "center",
          // color: '#E4E5E8',
          letterSpacing: '2px',
          fontSize: '10px',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#979797',
            type: 'dashed',
          },
        },
      },
      // dataZoom: [
      //   {
      //     type: "inside",
      //     start: 0,
      //     end: 100,
      //   },
      //   {
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      series: [
        {
          name: 'Energy Efficiency',
          type: 'line',
          // symbol: "none",
          sampling: 'lttb',
          itemStyle: {
            color: theme?.palette?.graph?.graph_area?.line,
          },
          // areaStyle: {
          //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //     {
          //       offset: 0,
          //       color: theme?.palette?.graph?.graph_area?.from_top,
          //     },
          //     {
          //       offset: 1,
          //       color: theme?.palette?.graph?.graph_area?.to_bottom,
          //     },
          //   ]),
          // },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme?.palette?.graph?.graph_area?.from_top,
              },
              ...(theme?.name?.includes('Purple')
                ? [
                    {
                      offset: 0.5,
                      color: '#5454be',
                    },
                  ]
                : []),
              {
                offset: 1,
                color: theme?.palette?.graph?.graph_area?.to_bottom,
              },
            ]),
          },
          data: energyConsumptions,
        },
      ],
    };

    option && myChart.setOption(option);
    myChart.on('click', function (params) {
      navigate(`graph-detail/2`, {
        state: {
          value: params.value,
          time: params.name,
          siteId: siteId,
          device_id: threshholdDeviceId,
        },
      });
    });

    return () => {
      myChart.dispose();
    };
  }, [data, themeMode]);
  const renderLegend = () => {
    return (
      <div style={{ position: 'absolute', bottom: 10 }}>
        <AntdTooltip
          title={
            <div>
              <div
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                The energy efficiency ratio measures how efficiently data center
                equipment uses energy, calculated as the ratio of power output
                to power input.{' '}
                <span
                  style={{
                    color: `${theme?.palette?.main_layout?.secondary_text}`,
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
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
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
              marginBottom: inventory ? '10px' : '',
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                backgroundColor: theme?.palette?.graph?.graph_area?.line,
                borderRadius: '50%',
                marginRight: 5,
              }}
            ></span>
            <span
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 13,
              }}
            >
              Energy Efficiency Ratio
            </span>
          </div>
        </AntdTooltip>
      </div>
    );
  };

  return (
    <div>
      {renderLegend()}
      <div
        id="thresh"
        style={{ width: '100%', height: inventory ? '210px' : '272px' }}
      ></div>
    </div>
  );
};

export default ThreshholdAlerts;

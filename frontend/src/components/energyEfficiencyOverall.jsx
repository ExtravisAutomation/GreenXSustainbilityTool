import React, { useEffect, useContext, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { Tooltip as AntdTooltip } from 'antd';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const EnergyEfficiencyOverall = ({
  data,
  siteId,
  kpiOption,
  siteName,
  isPue = false,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);
  const chartRef = useRef(null);

  useEffect(() => {
    // const chartDom = document.getElementById("eeAll");
    const chartInstance = echarts.init(chartRef.current);

    // if (!chartInstance) {
    //   console.error("DOM element with ID 'abc' not found");
    //   return;
    // }

    // const myChart = echarts.init(chartDom);

    const dates = data?.map((entry) => entry?.time);

    // const energyEfficiencyPer = data?.map(
    //   (entry) => entry?.energy_efficiency_per
    // );
    const tooltipBg = themeMode.includes('light')
      ? '#f9fafe'
      : theme?.palette?.graph?.toolTip_bg;
    const chartData = data?.map((entry) => ({
      value: entry?.energy_efficiency_per,
      total_POut_kW: entry?.total_POut_kW,
      total_PIn_kW: entry?.total_PIn_kW,
    }));

    const determineEfficiencyStatus = (value) => {
      if (value === 0) return { status: 'no data', color: '' };
      if (value > 0 && value < 0.5)
        return { status: 'Inefficient', color: 'red' };
      if (value >= 0.5 && value <= 1)
        // return { status: 'Moderately Efficient', color: '#2268D1' };
        return {
          status: 'Moderately Efficient',
          color: `${theme?.palette?.main_layout?.secondary_text}`,
        };
      return { status: 'Efficient', color: 'green' };
    };
    const option = {
      legend: {
        show: false,
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '14%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: themeMode.includes('light')
            ? '#333333'
            : theme?.palette?.graph?.title,
          fontSize: 12,
        },
        // old working formatter
        // formatter: function (params) {
        //   const data = params[0].data;
        //   const { status, total_Pin, total_POut, color } =
        //     determineEfficiencyStatus(data);
        //   return `

        //   Time: ${params[0].name} <br /><p style="border-bottom: 1px solid #36424E; padding-bottom:10px;">${params[0].seriesName}: ${data} <span style="color:${color}">( ${status} )</span></p>
        //    <p style="border-bottom: 1px solid #36424E; padding-bottom: 5px
        //     ">
        //     Energy Efficiency Formula : <br />
        //      Efficiency% = Power Output/Power Input *100
        //   </p>

        //   <div>
        //     <div>
        //                 <p >0-50% ( <span style = "color:#fb0200"> Inefficient </span>)</p>
        //                 <p >50-75%  ( <span style="color: ${theme?.name?.includes('Purple') ? theme?.palette?.main_layout?.secondary_text : '#0490E7'}" > Moderately Efficient </span>)</p>
        //               </div>
        //               <p>75%-above ( <span style = "color:#42AE46"> Efficient</span>)</p>

        //   `;
        // },
        formatter: function (params) {
          const point = params[0].data;
          const { value, total_POut_kW, total_PIn_kW } = point || {};
          const { status, color } = determineEfficiencyStatus(value);

          return `
  <div style="
    font-family: 'Inter', sans-serif;
    padding: 6px 4px;
    line-height: 1.6;
    
    min-width: 240px;
  ">
    <div style="margin-bottom: 6px;">
      <div style="display: flex; justify-content: space-between;">
        <span>Time</span>
        <span style="font-weight: 500;">${params[0].name}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Power Output (kW)</span>
        <span style="font-weight: 500;">${total_POut_kW ?? 'N/A'} </span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Power Input (kW)</span>
        <span style="font-weight: 500;">${total_PIn_kW ?? 'N/A'}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Energy Efficiency (%)</span>
        <span style="font-weight: 500; color:${color};">${value?.toFixed(2)}</span>
      </div>
    </div>

    <div style="
      background: ${tooltipBg};
      padding: 10px;
      border-radius: 7px;
      
      border: 1px solid ${theme?.palette?.graph?.tooltip_border};
      margin-bottom: 6px;
    ">
      Efficiency% = <br/> Power Output / Power Input × 100
    </div>

    <div style="
    background: ${tooltipBg};
   
    border: 1px solid ${theme?.palette?.graph?.tooltip_border}; 
    padding:10px; 
    border-radius: 7px
    ">
      <div>0 – 50% (<span style="color:#fb0200;">Inefficient</span>)</div>
      <div>50 – 75% (<span style="color:${theme?.name?.includes('Purple') ? theme?.palette?.main_layout?.secondary_text : '#0490E7'};">Moderately Efficient</span>)</div>
      <div>above 75% (<span style="color:#42AE46;">Efficient</span>)</div>
    </div>
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
        axisLine: {
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
          },
        },
        axisLabel: {
          color: theme?.palette?.graph?.xis || '#444', // ✅ label color goes here
          fontFamily: 'Inter',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        boundaryGap: [0, '100%'],
        // name: 'Power Output / Power Input',
        name: 'Energy Efficiency (%)',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: -270,
        nameTextStyle: {
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
      series: [
        {
          name: 'Energy Efficiency (%)',
          type: 'line',
          sampling: 'lttb',

          itemStyle: {
            color: theme?.palette?.graph?.graph_area?.line,
          },
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

          // areaStyle: {
          //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //     {
          //       offset: 0,
          //       // color: "#85DB66",
          //       color: theme?.palette?.graph?.graph_area?.from_top,
          //     },
          //     // #5454be
          //
          //     {
          //       offset: 1,
          //       // color: "#3D5945",
          //       color: theme?.palette?.graph?.graph_area?.to_bottom,
          //     },
          //   ]),
          // },
          emphasis: {
            itemStyle: {
              cursor: 'default',
            },
            areaStyle: {
              cursor: 'default',
            },
          },

          data: chartData,
          // data: energyEfficiencyPer,
        },
      ],
    };

    // myChart.setOption(option);
    chartInstance.setOption(option);

    // for  dashboard
    // chartInstance.on('click', function (params) {
    //   navigate(`graph-detail/1`, {
    //     state: {
    //       value: params.value,
    //       time: params.name,
    //       siteId: siteId,
    //       siteName: siteName,
    //     },
    //   });
    // });

    // working for both dashboard and PUE module:
    chartInstance.on('click', function (params) {
      if (isPue) return; // Disable click when isPue is true

      navigate(`graph-detail/1`, {
        state: {
          value: params.value,
          time: params.name,
          siteId: siteId,
          siteName: siteName,
        },
      });
    });

    // return () => {
    //   myChart.dispose();
    // };

    // Set the options

    // Resize the chart when the window is resized
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, navigate, siteId, kpiOption, themeMode]);

  const renderLegend = () => {
    return (
      <div style={{ position: 'absolute', bottom: 5 }}>
        <AntdTooltip
          title={
            <div>
              <div
                style={{
                  color: theme?.palette?.graph?.title,
                }}
              >
                The energy efficiency ratio measures how efficiently data center
                equipment uses energy, calculated as the ratio of power output
                to power input.{' '}
                <span
                  style={{
                    color: `${theme?.palette?.graph?.graph_area?.line}`,
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
            <span style={{ color: theme?.palette?.graph?.title, fontSize: 13 }}>
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
        ref={chartRef} // Use the ref here
        style={{ width: '100%', height: '250px', cursor: 'default' }}
      ></div>
    </div>
  );
};

export default EnergyEfficiencyOverall;

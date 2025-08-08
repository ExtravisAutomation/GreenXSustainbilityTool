import React, { useEffect, useContext, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { Tooltip as AntdTooltip } from 'antd';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../context/appContext';

const CustomLineGraph = ({
  data,
  ee,
  mainDashboard,
  //  mycode: unit changed from gb to KW
  tooltipPostfix = '',
  color = null,
}) => {
  console.log('by hour', data);

  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);
  const chartRef = useRef(null);

  useEffect(() => {
    // const chartDom = document.getElementById("eeAll");
    const chartInstance = echarts.init(chartRef.current);

    if (!chartInstance) {
      console.error("DOM element with ID 'abc' not found");
      return;
    }

    // const myChart = echarts.init(chartDom);

    const model = data?.map((entry) => entry?.model_no);
    // console.log('model...', model);

    const dataTraffic = data?.map((entry) => entry?.avg_data_traffic);
    const energyEfficiency = data?.map((entry) => entry?.avg_energy_efficiency);
    // console.log("EE ratio::::",energyEfficiency);

    const time = data?.map((entry) => entry?.time);
    // console.log('time....', time);

    const power = data?.map((entry) => entry?.total_PIn);

    const option = {
      legend: {
        show: false,
      },
      grid: {
        left: '3%',
        right: '2%',
        bottom: '14%',
        top: '14%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.title,
          fontSize: 12,
        },

        formatter: function (params) {
          const time = params ? params[0]?.axisValueLabel : [];
          let tooltipContent = `<div> ${time}</div>`;
          params?.forEach((item) => {
            tooltipContent += `<div>${item?.seriesName}:   <span style = 'color: ${theme?.palette?.main_layout?.secondary_text}'> ${item?.value} </span> ${tooltipPostfix} </div>`;
          });
          return tooltipContent;
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
        name: mainDashboard ? 'Time' : 'Models',
        position: 'bottom',
        position: 'center',
        nameLocation: 'middle',
        nameGap: 40,
        // nameRotate: -270,
        data: mainDashboard ? time : model,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: mainDashboard
          ? 'Power Input ( KW )'
          : ee
            ? 'Power Output / Power Input'
            : 'Data Traffic (GBs)',
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
          name: mainDashboard
            ? 'Power Input'
            : ee
              ? 'Energy Efficiency Ratio'
              : 'Data Traffic',
          type: 'line',
          sampling: 'lttb',

          itemStyle: {
            color: color ? color : theme?.palette?.graph?.graph_area?.line,
          },
          // areaStyle: mainDashboard
          //   ? null
          //   : {
          //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //         {
          //           offset: 0,
          //           // color: "#85DB66",
          //           color: theme?.palette?.graph?.graph_area?.from_top,
          //         },
          //         {
          //           offset: 1,
          //           // color: "#3D5945",
          //           color: theme?.palette?.graph?.graph_area?.to_bottom,
          //         },
          //       ]),
          //     },
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
          emphasis: {
            itemStyle: {
              cursor: 'default',
            },
            areaStyle: {
              cursor: 'default',
            },
          },
          data: mainDashboard ? power : ee ? energyEfficiency : dataTraffic,
        },
      ],
    };

    // myChart.setOption(option);
    chartInstance.setOption(option);

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
  }, [data, navigate, themeMode]);

  return (
    <div>
      <div
        ref={chartRef} // Use the ref here
        style={{ width: '100%', height: '250px', cursor: 'default' }}
      ></div>
    </div>
  );
};

export default CustomLineGraph;

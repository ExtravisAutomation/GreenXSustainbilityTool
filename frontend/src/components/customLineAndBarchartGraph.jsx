import React, { useContext, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const CustomLineAndBarchartGraph = ({
  title = 'Chart Title',
  subtext = 'Chart Subtext',
  xData = [],
  yData = [],
  visualPieces = [],
  markAreas = [],
  anomalies = [],
}) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        subtext: subtext,
        textStyle: {
          fontSize: 14,
          color: theme?.palette?.main_layout?.primary_text,
        },
      },
      grid: {
        left: '4%',
        right: '6%',
        bottom: '0%',
        top: '25%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
        },
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          let tooltipContent = `${params[0].axisValue}<br/>`;
          params.forEach((item) => {
            tooltipContent += `${item.marker} ${item.seriesName}: ${item.value} W<br/>`;
          });
          return tooltipContent;
        },
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            // color: themeMode == 'dark' ? '#979797' : 'lightgray',
            color: theme.palette.graph?.line_color || '#000',
          },
        },
        axisLabel: {
          formatter: '{value} W',
        },
        axisPointer: {
          snap: true,
        },
      },
      visualMap: {
        show: false,
        dimension: 0,
        pieces: visualPieces,
      },
      // series: [
      //   {
      //     name: 'Electricity',
      //     type: 'line',
      //     smooth: true,
      //     data: yData,
      //     markArea: {
      //       itemStyle: {
      //         // color: "rgba(255, 173, 177, 0.4)",
      //         color:
      //           themeMode == 'dark'
      //             ? theme?.palette?.graph?.graph_area?.line
      //             : 'rgba(255, 173, 177, 0.4)',
      //       },
      //       data: markAreas,
      //     },
      //     markPoint: {
      //       data: anomalies.map(({ value, xAxis, yAxis }) => ({
      //         name: 'Anomaly',
      //         value,
      //         xAxis,
      //         yAxis,
      //         itemStyle: { color: 'red' },
      //       })),
      //     },
      //   },
      // ],
      series: [
        {
          name: 'Electricity',
          type: 'line',
          smooth: true,
          data: yData,
          lineStyle: {
            color:
              themeMode === 'dark'
                ? theme?.palette?.graph?.line?.dark
                : theme?.palette?.graph?.line?.light,
            width: 2,
          },
          markArea: {
            itemStyle: {
              color:
                themeMode === 'dark'
                  ? theme?.palette?.graph?.graph_area?.line
                  : 'rgba(255, 173, 177, 0.4)',
            },
            label: {
              color: theme?.palette?.main_layout?.primary_text,
              // fontWeight: 'bold',
              textBorderColor: 'transparent',
              textBorderWidth: 0,
            },
            data: markAreas,
          },
          markPoint: {
            data: anomalies.map(({ value, xAxis, yAxis }) => ({
              name: 'Anomaly',
              value,
              xAxis,
              yAxis,
              itemStyle: { color: 'red' },
            })),
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // Cleanup on component unmount
    return () => {
      chartInstance.dispose();
    };
  }, [title, subtext, xData, yData, visualPieces, markAreas, anomalies]);

  return <div ref={chartRef} style={{ width: '100%', height: '330px' }} />;
};

export default CustomLineAndBarchartGraph;

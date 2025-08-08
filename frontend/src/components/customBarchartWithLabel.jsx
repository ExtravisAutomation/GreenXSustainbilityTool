import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const CustomBarChartWithLabels = ({
  title,
  seriesData = [],
  legendData = [],
  config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
  },
}) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // Generate label options dynamically based on config
    const labelOption = {
      show: true,
      position: config.position,
      distance: config.distance,
      align: config.align,
      verticalAlign: config.verticalAlign,
      rotate: config.rotate,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {},
      },
    };

    // mycode: Chart option with left toolbox that chagne chart visual
    const option = {
      title: {
        text: title,
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
        // backgroundColor: theme?.palette?.graph?.toolTip_bg,
        // borderColor: theme?.palette?.graph?.tooltip_border,
        // textStyle: {
        //   color: theme?.palette?.main_layout?.primary_text,
        // },
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: legendData,
        textStyle: {
          color: theme?.palette?.default_card?.color,
        },
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: seriesData?.years, // Automatically extract years from seriesData
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Efficiency Metric',
          axisLabel: {
            formatter: '{value}',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: theme.palette.graph?.line_color || '#000',
            },
          },
        },
      ],
      series: seriesData?.data?.map((item) => ({
        ...item,
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
      })),
    };

    chartInstance.setOption(option);

    // Cleanup on unmount
    return () => {
      chartInstance.dispose();
    };
  }, [seriesData, legendData, config]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default CustomBarChartWithLabels;

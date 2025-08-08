import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

const CostBreakDownChart = ({
  data = [],
  selectedCurrency = 'AED',
  parent = '',
  chartTitle = '',
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 768;
  const graphicTop = isSmallScreen ? '10%' : '0%';
  const gridTop = isSmallScreen ? '35%' : '30%';
  const yearlyItem = data.find((item) => item.label.toLowerCase() === 'yearly');
  const yearlyValue = yearlyItem?.value || 0;
  const minThreshold = yearlyValue * 0.1;

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    if (!data || data.length === 0) return;

    const categories = data.map((d) => d.label);

    const option = {
      title: {
        show: true,
        text: chartTitle,
        left: 'left',
        textStyle: {
          fontSize: isSmallScreen ? 14 : 16,
          fontFamily: 'Inter',
          color: theme?.palette?.main_layout?.primary_text || '#fff',
        },
      },
      grid: {
        top: gridTop,
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          show: false,
          fontSize: 12,
          color: theme?.palette?.graph?.xis || '#ccc',
        },
        axisLine: {
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: selectedCurrency,
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
          padding: [0, 30, 8, 0],
        },
        axisLabel: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
        },
        splitLine: { show: false },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      series: [
        {
          name: 'Cost',
          type: 'bar',
          data: data.map((d) => ({
            value: d.value,
            name: d.label,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops:
                  parent === 'costAnalysis'
                    ? [
                        { offset: 0, color: '#A01D17' },
                        { offset: 1, color: '#490808' },
                      ]
                    : [
                        { offset: 0, color: '#3B9938' },
                        { offset: 1, color: '#183918' },
                      ],
              },
            },
          })),
          barWidth: '40%',
          barCategoryGap: '20%', // reduce this to tighten space between categories
          barGap: '0%',
          label: {
            show: true,
            position: 'top',
            formatter: (params) =>
              `{period|${params.name}}\n\n{value|${params.value}}`,
            rich: {
              value: {
                fontSize: 12,
                fontWeight: 'semi-bold',
                color: theme?.palette?.graph?.title || '#fff',
              },
              period: {
                fontSize: 10,
                fontWeight: '500',
                color: theme?.palette?.graph?.xis || '#aaa',
              },
            },
          },
          z: 2,
        },
        {
          type: 'custom',
          renderItem: function (params, api) {
            const value = api.value(1);
            // if (value < 2000) return;
            if (value < minThreshold) return; // ✅ new check
            const x = api.coord([api.value(0), 0])[0];
            const y = api.coord([0, api.value(1)])[1];
            const barWidth = api.size([1, 0])[0] * 0.2;
            const height = api.size([0, api.value(1)])[1];
            const shadowWidth = barWidth * 0.7;
            const cutOffset = 8;
            const shadowX = x + barWidth - shadowWidth * 0.04;

            return {
              type: 'polygon',
              shape: {
                points: [
                  [shadowX, y],
                  [shadowX, y + height],
                  [shadowX + shadowWidth, y + height],
                  [shadowX + shadowWidth, y + cutOffset],
                ],
              },
              style: {
                fill: parent === 'costAnalysis' ? '#490808' : '#183918',
              },
              z: 1,
            };
          },
          data: data.map((d, i) => [i, d.value]),
          encode: { x: 0, y: 1 },
        },
      ],
    };

    chart.setOption(option, true);
  }, [data, selectedCurrency, theme]);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    const handleResize = () => chart?.resize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '280px' }} />;
};

export default CostBreakDownChart;

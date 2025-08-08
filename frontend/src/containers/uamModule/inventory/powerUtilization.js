import React, { useEffect, useRef, useContext } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridSimpleComponent,
  LegendComponent,
} from 'echarts/components';
import moment from 'moment';
import Typography from 'antd/es/typography/Typography';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { SVGRenderer } from 'echarts/renderers';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../../context/appContext';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridSimpleComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
]);

const PowerUtilizationChart = ({ dataa, isByteRate, style }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const { themeMode, setThemeMode } = useContext(AppContext);

  // console.log("EEE data:::",dataa);

  // useEffect(() => {
  //   if (!chartRef.current) return;

  //   const chart = echarts.getInstanceByDom(chartRef.current);
  //   if (!chart) return;

  //   const resizeObserver = new ResizeObserver(() => {
  //     chart.resize();
  //   });

  //   resizeObserver.observe(chartRef.current);

  //   return () => {
  //     resizeObserver.disconnect();
  //   };
  // }, []);
  //
  useEffect(() => {
    if (!dataa || dataa.length === 0) {
      return;
    }
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const rawData = [];

    dataa.map((item) => {
      const time = moment(item.hour).format('YYYY-MM-DD HH:mm:ss');
      const renewable =
        item.energy_efficieny == 'null'
          ? 0
          : item.energy_efficieny || item?.Byetrate;
      return rawData.push({ time, renewable });
    });

    const data = rawData.map((item) => [
      moment(item.time).format('YYYY-MM-DD HH:mm'),
      item.renewable,
    ]);
    const option = {
      legend: {
        top: 'bottom',
        data: ['Renewable'],
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        formatter: function (params) {
          const time = moment(params[0].value[0]).format('HH:mm');
          const renewable = params[0].value[1];
          return isByteRate
            ? `ByteRate: ${renewable} GB <br/> Time: ${time}`
            : `Energy Efficiency: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${renewable}</span>  <br/> Time: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${time}</span>`;
        },
        backgroundColor: theme?.palette?.default_card?.background,
        borderColor: theme?.palette?.default_card?.border,
        textStyle: {
          // Custom text style
          color: theme?.palette?.default_card?.color, // Text color
          fontSize: 14, // Text size
          fontFamily: 'Arial, sans-serif', // Font family
          fontWeight: 'bold', // Font weight
          lineHeight: 1.5, // Line height
        },
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: function (value) {
            return moment(value).format('HH:mm');
          },
          color: theme?.palette?.main_layout?.primary_text,
        },
        axisPointer: {
          snap: true,
          // lineStyle: {
          //   color: "#7581BD",
          //   width: 2,
          // },
          lineStyle: {
            color: 'transparent', // Correct spelling!
            width: 0,
          },
          label: {
            show: true,
            backgroundColor: '#7581BD',
          },
          handle: {
            show: true,
            color: '#7581BD',
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          inside: true,
        },
        splitLine: {
          show: false,
        },

        axisLabel: {
          // inside: true,
          formatter: isByteRate ? '{value} GB' : '{value} W',
          color: theme?.palette?.main_layout?.primary_text,
        },
        z: 10,
        offset: 0,
      },
      grid: {
        bottom: style?.bottom,
        left: 60,
        right: 10,
        // height: 200,
        borderRadius: [7, 7, 0, 0],
        borderColor: '#36424E',
        borderWidth: 1,
      },
      dataZoom: [
        {
          type: 'inside',
          // throttle: 50,
        },
      ],
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          sampling: 'average',
          itemStyle: {
            color: theme?.palette?.graph?.graph_area?.line,
          },
          lineStyle: {
            width: 1,
          },
          stack: 'a',
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
          data: data,
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [dataa, themeMode]);

  if (!dataa || dataa.length === 0) {
    return (
      <div
        style={{
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: 'white',
            marginLeft: 20,
            marginTop: 15,
            fontSize: '1.25rem',
            fontWeight: '500',
            lineHeight: '20px',
          }}
        >
          No data available
        </Typography>
      </div>
    );
  }
  return (
    <>
      <div
        className=""
        ref={chartRef}
        style={{ height: style?.height, ...style }}
      />
    </>
  );
};

export default PowerUtilizationChart;

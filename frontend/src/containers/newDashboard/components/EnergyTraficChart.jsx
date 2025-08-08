import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import CustomCard from '../../../components/customCard';
import { Col, Row } from 'antd';
import CustomSpin from '../../../components/CustomSpin';

function EnergyTraficChart({ energyData, energyTrendsLoading }) {
  const theme = useTheme();
  const chartRef = useRef(null);

  const chartData = Array.isArray(energyData)
    ? energyData.map((d) => ({
        time: d.time?.split(' ')[1] ?? 'Unknown', // Extract HH:MM
        energy_efficiency: d.eer,
        power_input: d.input_kw,
        power_output: d.output_kw,
        data_traffic: d.data_utilization,
        allocated_traffic: d.traffic_allocated_gb,
        consumed_traffic: d.traffic_consumed_gb,
      }))
    : [];
  const determineEfficiencyStatus = (value) => {
    if (value < 50) return { status: 'Inefficient', color: 'red' };
    if (value >= 50 && value <= 75)
      return { status: 'Moderate', color: '#0490E7' };
    return { status: 'Efficient', color: 'green' };
  };

  const option = {
    legend: {
      show: true,
      top: 0,
      right: '2%',
      icon: 'circle',
      //   bottom: 5,
      textStyle: {
        fontSize: 12,
        color: theme?.palette?.main_layout?.primary_text,
      },
    },

    tooltip: {
      trigger: 'axis',
      confine: false, // ✅ allow it to break outside parent boundaries
      appendToBody: true, // ✅ ensures tooltip is appended to <body> so it's not clipped
      backgroundColor: theme?.palette?.graph?.toolTip_bg || '#1e1e2f',
      borderColor: theme?.palette?.graph?.tooltip_border || '#444',
      borderWidth: 1,
      textStyle: {
        color: theme?.palette?.graph?.toolTip_text_color || '#fff',
        fontFamily: 'Inter',
        fontSize: 12,
      },
      extraCssText: `
    z-index: 9999 !important;
    pointer-events: none;
  `,

      // ✅ forces tooltip above all
      formatter: function (params) {
        const point = params[0]?.data || {};
        const eer = point?.energy_efficiency ?? 'N/A';
        const data_utilization = point?.data_traffic ?? 'N/A';
        const total_POut_kW = point?.power_output ?? 'N/A';
        const total_PIn_kW = point?.power_input ?? 'N/A';
        const allocated_Traffic = point?.allocated_traffic ?? 'N/A';
        const consumed_Traffic = point?.consumed_traffic ?? 'N/A';
        const time = params[0]?.name;

        const { status, color } = determineEfficiencyStatus(eer);
        const tooltipBg = theme?.palette?.graph?.toolTip_bg;

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
        <span style="font-weight: 500;">${time}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Power Output (kW)</span>
        <span style="font-weight: 500;">${total_POut_kW}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Power Input (kW)</span>
        <span style="font-weight: 500;">${total_PIn_kW}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Energy Efficiency (%)</span>
        <span style="font-weight: 500; color:${color};">${isNaN(Number(eer)) ? 'N/A' : Number(eer).toFixed(2)}</span>
      </div>
      <div style="
      background: ${tooltipBg};
      padding: 10px;
      border-radius: 7px;
      border: 1px solid ${theme?.palette?.graph?.tooltip_border};
      margin-bottom: 6px;
    ">
      Energy Efficiency% = <br/> Power Output / Power Input × 100
    </div>

      <hr style = "border: 1px dashed ${theme?.palette?.graph?.tooltip_border};"/>

       <div style="display: flex; justify-content: space-between;">
        <span>Allocated Traffic </span>
        <span style="font-weight: 500;">${allocated_Traffic}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Consumed Traffic</span>
        <span style="font-weight: 500;">${consumed_Traffic}</span>
      </div>

       <div style="display: flex; justify-content: space-between;">
        <span>Data Utilization (%)</span>
        <span style="font-weight: 500; ;">${isNaN(Number(data_utilization)) ? 'N/A' : Number(data_utilization).toFixed(2)}</span>
      </div>
    </div>

    <div style="
      background: ${tooltipBg};
      padding: 10px;
      border-radius: 7px;
      border: 1px solid ${theme?.palette?.graph?.tooltip_border};
      margin-bottom: 6px;
    ">
      Data Utilization % = <br/> Consumed Traffic / Allocated Traffic × 100
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

    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.map((d) => d.time),
      boundaryGap: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '', // You can put a name if needed
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
    ],
    // for two values
    // yAxis: [
    //   {
    //     type: 'value',
    //     name: '',
    //     position: 'left',
    //     // min: 0,
    //     // max: 100,
    //     // interval: 20,
    //     axisLabel: {
    //       formatter: '{value}',
    //     },
    //     splitLine: {
    //       show: false,
    //       lineStyle: {
    //         color: '#151A20',
    //         type: 'solid',
    //       },
    //     },
    //     nameLocation: 'middle',
    //     nameGap: 40,
    //     nameRotate: -270,
    //     nameTextStyle: {
    //       verticalAlign: 'middle',
    //       align: 'center',
    //     },
    //   },
    //   // {
    //   //   type: 'value',
    //   //   name: 'Energy Efficiency Ratio',
    //   //   position: 'right',
    //   //   min: 0,
    //   //   max: 100,
    //   //   interval: 20,
    //   //   axisLabel: {
    //   //     formatter: '{value}',
    //   //   },
    //   //   splitLine: {
    //   //     show: false,
    //   //     lineStyle: {
    //   //       color: '#151A20',
    //   //       type: 'solid',
    //   //     },
    //   //   },
    //   //   nameLocation: 'middle',
    //   //   nameGap: 45,
    //   //   nameRotate: 270,
    //   //   nameTextStyle: {
    //   //     verticalAlign: 'middle',
    //   //     align: 'center',
    //   //   },
    //   // },
    // ],

    series: [
      {
        name: 'Data Utilization',
        type: 'line',
        data: chartData.map((d) => ({
          value: d.data_traffic,
          ...d,
        })),
        yAxisIndex: 0,
        itemStyle: {
          color: '#00A9CE',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00A9CE',
            },
            ...(theme?.name?.includes('Purple')
              ? [{ offset: 0.5, color: '#5454be' }]
              : []),
            {
              offset: 1,
              color: theme?.palette?.graph?.graph_area?.to_bottom,
            },
          ]),
        },
      },
      {
        name: 'Energy Efficiency',
        type: 'line',
        data: chartData.map((d) => ({
          value: d.energy_efficiency,
          ...d,
        })),
        yAxisIndex: 0,
        itemStyle: {
          color: '#844DCD',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#844DCD',
            },
            {
              offset: 1,
              color: theme?.palette?.graph?.graph_area?.to_bottom,
            },
          ]),
        },
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Row>
      <Col xs={24} lg={24} xl={24} style={{ padding: '10px' }}>
        <CustomSpin spinning={energyTrendsLoading}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: '7px',
              color: theme?.palette?.main_layout?.primary_text,
            }}
          >
            <div style={{ marginBottom: '0px', fontSize: 16, fontWeight: 500 }}>
              Energy Efficiency Trends Across Data Traffic
            </div>
            <div
              style={{
                width: '100%',
                height: '280px',
              }}
            >
              <ReactEcharts
                //   ref={chartRef}
                //   option={option}
                //   style={{ height: '100%', width: '100%' }}
                ref={chartRef}
                option={option}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </CustomCard>
        </CustomSpin>
      </Col>
    </Row>
  );
}

export default EnergyTraficChart;

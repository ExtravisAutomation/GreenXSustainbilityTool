import React, { useEffect, useRef, useContext } from 'react';
import * as echarts from 'echarts';
import { Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const SummaryMetricsBarChart = ({
  summaryMetrics,
  pueData,
  dashboard,
  pue,
  report,
}) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    let myChart = echarts.init(chartRef.current);

    const options = {
      // title: {
      //   text: "Summary Metrics:",
      //   subtext: "Average power usage",
      //   textStyle: {
      //     fontSize: "16px",
      //     fontWeight: 500,
      //     color: dashboard == "true" ? "#E4E5E8" : "black",
      //   },
      //   subtextStyle: {
      //     fontSize: "12px",
      //     color: dashboard === "true" ? "#E4E5E8" : "black",
      //   },
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '5%',
        top: '10%',
        right: '7%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
          show: true,
          lineStyle: {
            color: '#979797',
            type: 'dashed',
          },
        },
        // axisLabel: {
        //   formatter: function (value) {
        //     if (pueData) {
        //       return value + "KW";
        //     } else if (value >= 1000) {
        //       return `${value / 1000}k`;
        //     } else {
        //       return value;
        //     }
        //   },
        // },
      },
      yAxis: {
        type: 'category',
        data: [],
      },
      series: [
        {
          //   name: "This Month",
          type: 'bar',
          barWidth: 20,
          // itemStyle: {
          //   color: theme?.palette?.graph?.graph_area?.line,
          // },
          itemStyle: {
            color: theme?.name.includes('Purple')
              ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#5454be' },
                  // { offset: 0.5, color: '#7b52db' },
                  { offset: 1, color: '#791b9c' },
                ])
              : theme?.palette?.graph?.graph_area?.line,
            // opacity: 0.8,
          },
          label: {
            fontFamily: 'inter',
            // Add labels above the bars
            show: true,
            position: 'insideStart',
            // position: "top",
            offset: [10, -15],
            // formatter: function (params) {
            //   const postfix =
            //     // params.name === 'Cost Estimation' ? '' : pueData ? 'kw' : 'kwh';

            //   if (params.value >= 1000) {
            //     return `{a|${params.name}} {b|[${
            //       pueData ? params.value : params.value / 1000
            //     } ${postfix}]}`;
            //   } else {
            //     return `{a|${params.name}} {b|[ ${
            //       pueData ? params.value : params.value
            //     } ${postfix} ]}`;
            //   }
            // },

            formatter: function (params) {
              const name = params.name;

              const unitMap = {
                Cost: pueData?.cost_estimation_AED ? 'AED' : 'kw',
                'Total Power Input': 'kw',
                'Total Power Output': 'kw',
                'Average Energy Efficiency': 'kwh',
                'Peak Usage': 'kwh',
                'Total Power Consumption': 'kwh',
              };

              const postfix = unitMap[name] || '';
              const displayValue =
                params.value >= 1000 && !pueData
                  ? params.value / 1000
                  : params.value;

              return `{a|${name}} {b|[ ${displayValue} ${postfix} ]}`;
            },
            rich: {
              a: {
                color:
                  dashboard == 'true'
                    ? theme?.palette?.main_layout?.primary_text
                    : 'black',
                fontSize: 10,
                fontWeight: 400,
              },
              b: {
                color: theme?.palette?.main_layout?.secondary_text,
                fontSize: 10,
                // fontStyle: "italic",
              },
            },
          },

          data: [
            {
              value: summaryMetrics?.average_power || pueData?.total_PIn_kw,
              name: pueData ? 'Total Power Input' : 'Average Energy Efficiency',
            },
            {
              value: summaryMetrics?.max_power || pueData?.total_POut_kw,
              name: pueData ? 'Total Power Output' : 'Peak Usage',
            },
            // {
            //   value:
            //     summaryMetrics?.total_power || pueData?.cost_estimation_AED,
            //   name: pueData ? 'Cost ' : 'Total Power Consumption',
            // },
            {
              value:
                summaryMetrics?.total_power || pueData?.cost_estimation_AED,
              name: pueData ? 'Cost' : 'Total Power Consumption', // ← clean, matches 'Cost' now
            },
          ],
        },
      ],
    };

    myChart.setOption(options);

    // Clean up function
    return () => {
      myChart.dispose();
    };
  }, [summaryMetrics, pueData, themeMode]);

  return (
    <Row>
      <Col xs={pue ? 24 : 16}>
        <div
          ref={chartRef}
          style={{
            height:
              dashboard == 'true' && pue
                ? '201px'
                : dashboard == 'true'
                  ? '310px'
                  : '300px',
          }}
        />
      </Col>
      {pue ? null : (
        <Col xs={8}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: '10px',
              height: '100%',
            }}
          >
            <div>
              <div style={{ marginBottom: '30px' }}>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    fontSize: '13px',
                    color: theme?.palette?.main_layout?.primary_text,
                    fontFamily: 'inter',
                  }}
                >
                  This Month
                </p>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    fontSize: '18px',
                    color:
                      report == 'true'
                        ? 'black'
                        : theme?.palette?.main_layout?.primary_text,
                    fontFamily: 'inter',
                  }}
                >
                  {summaryMetrics?.total_power_duration}
                  {/* 42h 48m */}
                </p>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    color: '#14A166',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(20, 161, 102, 0.25)',
                      height: '14px',
                      width: '14px',
                      borderRadius: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ArrowUpOutlined />
                  </span>
                  <span
                    style={{
                      fontFamily: 'inter',
                    }}
                  >
                    18.56% (1h 12m)
                  </span>
                </p>
              </div>
              <div>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    color: theme?.palette?.main_layout?.primary_text,
                    fontFamily: 'inter',
                  }}
                >
                  Amount
                </p>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    color:
                      report == 'true'
                        ? 'black'
                        : theme?.palette?.main_layout?.primary_text,
                    fontSize: '18px',
                    fontFamily: 'inter',
                  }}
                >
                  {summaryMetrics?.total_cost} AED
                </p>
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    fontSize: '11px',
                    color: '#F82B2B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(248, 43, 43, 0.25)',
                      height: '14px',
                      width: '14px',
                      borderRadius: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ArrowDownOutlined
                      style={{
                        color: '#F82B2B',
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: 'inter',
                    }}
                  >
                    12% (-17)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default SummaryMetricsBarChart;

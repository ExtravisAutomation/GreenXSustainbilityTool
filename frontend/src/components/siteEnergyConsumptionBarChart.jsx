import React, { useEffect, useRef, useContext } from "react";
import * as echarts from "echarts";
import { Tooltip as AntdTooltip } from "antd";
import { useTheme } from "@mui/material/styles";
import { AppContext } from "../context/appContext";

const SiteEnergyConsumptionBarChart = ({
  siteEnergyCosumption,
  isTime,
  barWidth,
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "14%",
        top: "14%",
        containLabel: true,
      },
      legend: {
        show: false,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 14,
          fontFamily: "inter",
          // fontWeight: "bold",
          lineHeight: 1.5,
        },
        formatter: function (params) {
          const time = params ? params[0]?.axisValueLabel : [];
          const hour = parseInt(time, 10);
          const amPm = hour < 12 ? "AM" : "PM";
          const formattedHour = hour % 12 === 0 ? 12 : hour;

          let tooltipContent = isTime
            ? `<div >Time: ${formattedHour} ${amPm}</div>`
            : `<div >Day: ${time}</div>`;
          params?.forEach((item) => {
            const value = parseFloat(item?.value).toFixed(2);
            tooltipContent += `<div>${item?.seriesName}: ${value} KW</div>`;
          });
          return tooltipContent;
        },
      },
      xAxis: {
        type: "category",
        data: siteEnergyCosumption?.map((data) =>
          isTime ? data?.time : data?.day
        ),
        axisLabel: {
          interval: 0, // Show all labels
          // rotate: 45,
          textStyle: {
            color: "#979797",
            fontSize: "12px",
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#979797",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#979797",
            fontSize: "15px",
          },
          formatter: function (value) {
            return value + "KW";
          },
        },
      },

      series: [
        {
          name: "Energy Consumption",
          data: siteEnergyCosumption?.map((data) => data?.total_POut),
          type: "bar",
          barWidth: barWidth,
          itemStyle: {
            color: theme?.palette?.main_layout?.secondary_text,
            //   color:
            //     themeMode == "dark"
            //       ? theme?.palette?.graph?.graph_area?.line
            //       : "rgba(255, 173, 177, 1.9)",
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [siteEnergyCosumption, themeMode]);

  const renderLegend = () => {
    return (
      <div style={{ position: "absolute", bottom: 0, zIndex: 999 }}>
        <AntdTooltip
          // title={
          //   <div>
          //     The energy consumption measures how efficiently data center
          //     equipment uses energy, calculated as the ratio of power output to
          //     power input.{" "}
          //     <span
          //       style={{
          //         color: "#2268D1",
          //         textDecoration: "underline",
          //         cursor: "pointer",
          //       }}
          //     >
          //       see details
          //     </span>
          //   </div>
          // }
          overlayInnerStyle={{
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
            width: "300px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: 10,
              cursor: "default",
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                backgroundColor: theme?.palette?.main_layout?.secondary_text,
                borderRadius: "50%",
                marginRight: 5,
              }}
            ></span>
            <span
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 13,
              }}
            >
              Energy Consumption
            </span>
          </div>
        </AntdTooltip>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {renderLegend()}
      <div ref={chartRef} style={{ width: "100%", height: "250px" }}></div>
    </div>
  );
};

export default SiteEnergyConsumptionBarChart;

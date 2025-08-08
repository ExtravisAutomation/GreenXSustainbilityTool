import React, { useState, useRef, useEffect } from "react";
import * as echarts from "echarts";
import CustomProgress from "./customProgress";
import CustomTooltip from "./customTooltip";
const getProgressColor = (percent) => {
  if (percent >= 75) return "red";
  if (percent >= 50) return "orange";
  return "green";
};

const ElectricityMap = ({ data }) => {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) {
      console.error("Chart container not found");
      return;
    }

    const myChart = echarts.init(chartDom);

    myChart.showLoading();

    // Load the world map data
    fetch("https://cdn.jsdelivr.net/npm/echarts@latest/map/json/world.json")
      .then((response) => response.json())
      .then((worldJson) => {
        echarts.registerMap("world", worldJson);

        // Example data for site energy consumption
        const energyData = [
          {
            name: data?.site_name,
            value: [
              data?.longitude,
              data?.latitude,
              data?.energy_consumption_KW,
            ],
          },
        ];

        const option = {
          geo: {
            map: "world",
            roam: true,
            itemStyle: {
              areaColor: "#8E8E8E",
              borderColor: "#111",
            },
            emphasis: {
              itemStyle: {
                areaColor: "#FFD700",
              },
            },
          },
          series: [
            {
              name: "Energy Consumption",
              type: "scatter",
              coordinateSystem: "geo",
              data: energyData,
              symbolSize: 15,
              label: {
                formatter: "{b}",
                position: "right",
                show: true,
                rich: {
                  customColor: {
                    color: "#FF0000",
                    fontWeight: "bold",
                  },
                },
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              itemStyle: {
                color: "#0490E7",
              },
            },
          ],
        };

        myChart.hideLoading();
        myChart.setOption(option);

        myChart.on("mouseover", (params) => {
          if (params.value && params.value.length === 3) {
            setTooltipData({
              name: params.name,
              energy: params.value[2],
              color: getProgressColor(params.value[2]),
              longitude: data?.longitude,
              latitude: data?.latitude,
              co2: data?.carbon_emission_KG,
              cost: data?.total_cost,
            });
            setTooltipPosition({
              x: params.event.event.pageX,
              y: params.event.event.pageY,
            });
            setTooltipVisible(true);
          }
        });

        myChart.on("mouseout", () => {
          setTooltipVisible(false);
        });

        myChart.on("mousemove", (params) => {
          setTooltipPosition({
            x: params.event.event.pageX,
            y: params.event.event.pageY,
          });
        });
      })
      .catch((error) => {
        console.error("Failed to load map data:", error);
        myChart.hideLoading();
      });

    return () => {
      myChart.dispose();
    };
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={chartRef}
        id="world-chart"
        style={{
          width: "100%",
          height: "500px",
          margin: "0px 0",
        }}
      />
      <CustomTooltip
        visible={tooltipVisible}
        position={tooltipPosition}
        data={tooltipData}
      />
    </div>
  );
};

export default ElectricityMap;

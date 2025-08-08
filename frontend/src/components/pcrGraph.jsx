import React, { useEffect, useContext } from "react";
import * as echarts from "echarts";
import { useNavigate } from "react-router-dom";
import { Tooltip as AntdTooltip } from "antd";
import { useTheme } from "@mui/material/styles";
import { AppContext } from "../context/appContext";

const PcrGraph = ({ data, siteId, pcrDeviceId, siteName, deviceName }) => {
  console.log("pcr data in chart", data);
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    const chartDom = document.getElementById("pcrr");
    const myChart = echarts.init(chartDom);

    // Extract the time and energy_consumption values from the data
    const dates = data?.map((entry) => entry.time);
    const energyConsumptions = data?.map((entry) => entry.PCR);

    const determineEfficiencyStatus = (value) => {
      if (value < 0.5) return { status: "Efficient", color: "green" };
      if (value >= 0.5 && value <= 1)
        return { status: "Moderately Efficient", color: "#2268D1" };
      return { status: "Inefficient", color: "red" };
    };
    const option = {
      grid: {
        left: "4%",
        right: "3%",
        bottom: "10%",
        top: "14%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        // position: function (pt) {
        //   return [pt[0], "10%"];
        // },
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 12,
        },
        // formatter: function (params) {
        //   console.log(params);

        //   const data = params[0]?.value;
        //   const { status, color } = determineEfficiencyStatus(data);
        //   return `
        //    <p>
        //           Site Name: <span style="
        //            color: #2268D1">${siteName}</span>
        //         </p>
        //           <p style="border-bottom: 1px solid #36424E; padding-bottom: 5px
        //     ">
        //           Device Name: <span style="
        //            color: #2268D1">${deviceName}</span>
        //         </p>
        //   Time: ${params[0].name}<br /> <p style="border-bottom: 1px solid #36424E; padding-bottom:10px;">Power Consumption Ratio: ${data} <span style="color:${color}">( ${status} )</span></p>
        //    <div>
        //    <div>
        //                 <p>0 - 0.5 (Inefficient )</p>
        //                 <p>0.5 - 1 (Moderately Efficient)</p>
        //               </div>
        //               <p>1 - above (Efficient)</p>
        //   </div>
        //   `;
        // },
        formatter: function (params) {
          console.log(params);

          const data = params[0]?.value;
          const { status, color } = determineEfficiencyStatus(data);
          return `
           <p style="padding-bottom: 5px
            ">
                  Site Name: <span style="
                   color:${theme?.palette?.main_layout?.secondary_text}">${siteName}</span>
                </p>
                  <p style="border-bottom: 1px solid #36424E; padding-bottom: 5px
            ">
                  Device Name: <span style="
                   color: ${theme?.palette?.main_layout?.secondary_text}">${deviceName}</span>
                </p>
          Time: ${params[0].name}<br /> <p>Power Consumption Ratio: ${data} </p>
          
          `;
        },
      },
      toolbox: {
        show: false,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        name: "Input Power Used / Input Output Data Rate",
        position: "left",
        nameLocation: "middle",
        nameGap: 40,
        nameRotate: -270,
        nameTextStyle: {
          // verticalAlign: "middle",
          // align: "center",
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: "10px",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#979797",
            type: "dashed",
          },
        },
      },
      // dataZoom: [
      //   {
      //     type: "inside",
      //     start: 0,
      //     end: 100,
      //   },
      //   {
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      series: [
        {
          name: "Energy Efficiency",
          type: "line",
          // symbol: "none",
          sampling: "lttb",
          itemStyle: {
            color: theme?.palette?.graph?.graph_area?.line,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme?.palette?.graph?.graph_area?.from_top,
              },
              {
                offset: 1,
                color: theme?.palette?.graph?.graph_area?.to_bottom,
              },
            ]),
          },
          data: energyConsumptions,
        },
      ],
    };

    option && myChart.setOption(option);
    myChart.on("click", function (params) {
      navigate(`graph-detail/2`, {
        state: {
          value: params.value,
          time: params.name,
          siteId: siteId,
          device_id: pcrDeviceId,
        },
      });
    });

    return () => {
      myChart.dispose();
    };
  }, [data, themeMode]);
  const renderLegend = () => {
    return (
      <div style={{ position: "absolute", bottom: 10 }}>
        <AntdTooltip
          title={
            <div>
              <div
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                The Power Consumption Ratio (PCR) measures how efficiently power
                is used relative to the data rate of a network device{" "}
                <span
                  style={{
                    color: "#2268D1",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate("/main_layout/about", {
                      state: {
                        title: "pcr",
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
                backgroundColor: theme?.palette?.graph?.graph_area?.line,
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
              Power Consuption Ratio
            </span>
          </div>
        </AntdTooltip>
      </div>
    );
  };

  return (
    <div>
      {renderLegend()}
      <div id="pcrr" style={{ width: "100%", height: "310px" }}></div>
    </div>
  );
};

export default PcrGraph;

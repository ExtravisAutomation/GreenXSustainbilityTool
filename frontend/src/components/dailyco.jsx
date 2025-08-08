import React, { useEffect } from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";
import CostInternalChart from "../components/costInternalChart.jsx";
import Co from "../components/co.jsx";
import worldmap from "../resources/svgs/uaemap1.png";
import dots from "../resources/svgs/dots.svg";
import uaerealmap from "../resources/svgs/uaerealmap.png";
import CustomCard from "./customCard.jsx";
import { Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ElectricityMap from "./map.jsx";
import { fetchElectricityMapData } from "../store/features/dashboardModule/actions/electricityMap.js";
import { useTheme } from "@mui/material/styles";

const DailyCO = (props) => {
  const theme = useTheme();

  const access_token = localStorage.getItem("access_token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.siteId) {
      dispatch(fetchElectricityMapData(props.siteId, access_token));
    }
  }, [props.siteId, dispatch, access_token]);
  const electricityMapData = useSelector((state) => state.electricityMapData);

  const handleMouseEnter = (event, info) => {
    // console.log("Mouse Enter", info);
  };

  const handleMouseLeave = (event) => {
    // console.log("Mouse Leave");
  };

  return (
    <div>
      <div style={{ color: "#e5e5e5" }}>
        <p
          style={{
            margin: "0px",
            fontWeight: 500,
            fontSize: "16px",
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          {props.heading}
        </p>
        <p
          style={{
            color: theme?.palette?.main_layout?.primary_text,
            margin: "0px ",
            fontSize: "13px",
          }}
        >
          About 80% of your Energy this month came from low-carbon sources on
          average, with gas making up the majority
        </p>
      </div>

      <Row>
        <Col xs={24} xl={10} style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px",
              alignItems: "center",
              color: "#e5e5e5",
            }}
          >
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                width: "100%",
              }}
            >
              <div style={{ marginBottom: "50px" }}>
                <p style={{ padding: "0px", margin: "0px", fontWeight: 600 }}>
                  Total CO2 Emissions (Per Site)
                </p>
                {/* <p style={{ fontSize: "13px", margin: "8px 0px 20px 0px" }}>
                  Two of your sites have higher emissions than your fabric's
                  average
                </p> */}
              </div>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "50px",
                }}
              >
                <div>
                  <p style={{ padding: "0px", margin: "0px", fontWeight: 600 }}>
                    Abu Dhabi
                  </p>
                  <p style={{ fontSize: "14px", margin: "8px 0px 20px 0px" }}>
                    <span style={{ marginRight: "5px" }}>&#8226;</span> CO2
                    Emission 15kg <br />
                    <span style={{ marginRight: "5px" }}>&#8226;</span> AED 7500{" "}
                    <br />
                    <span style={{ marginRight: "5px" }}>&#8226;</span> Energy
                    Consumption 7000 KW
                  </p>
                </div>
                <div>
                  <p style={{ padding: "0px", margin: "0px", fontWeight: 600 }}>
                    Dubai
                  </p>
                  <p style={{ fontSize: "14px", margin: "8px 0px 20px 0px" }}>
                    <span style={{ marginRight: "5px" }}>&#8226;</span> CO2
                    Emission 20kg <br />
                    <span style={{ marginRight: "5px" }}>&#8226;</span> AED 8000{" "}
                    <br />
                    <span style={{ marginRight: "5px" }}>&#8226;</span> Energy
                    Consumption 7500 KW
                  </p>
                </div>
              </div> */}
              <p style={{ padding: "0px", margin: "0px", fontWeight: "bold" }}>
                {electricityMapData?.data?.data?.site_name}
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ marginRight: "5px" }}>&#8226;</span>
                <span style={{ marginRight: "5px" }}>CO2 Emission</span>
                {electricityMapData?.data?.data?.carbon_emission_KG} kg <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span>
                AED {electricityMapData?.data?.data?.total_cost}
                <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span>
                <span style={{ marginRight: "5px" }}>Energy Consumption</span>
                {Math.round(
                  electricityMapData?.data?.data?.energy_consumption_KW
                )}
                KW
              </p>
            </div>
          </div>
        </Col>
        <Col xs={24} xl={14} style={{ padding: "0px" }}>
          <ElectricityMap data={electricityMapData?.data?.data} />
        </Col>
      </Row>
    </div>
  );
};

export default DailyCO;

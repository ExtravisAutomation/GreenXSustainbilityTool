import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";
import CostInternalChart from "../components/costInternalChart.jsx";
import MonthlyCostInternalChart from "./montlyCostInternalChart.jsx";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

function monthlyCostGraph(props) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#e5e5e5",
        }}
      >
        <img src={props.headericon} height={35} width={35} />
        <p
          style={{
            margin: "0px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          {props.heading}
        </p>
      </div>
      <p
        style={{
          color: "#e5e5e5",
          padding: "0px 0px 10px 60px",
          margin: "10px 0px 10px 0px",
        }}
      >
        This month, you've use more energy from the grid accross your sites
      </p>

      <div style={{}}>
        <Grid container fluid spacing={3} mx={0.4}>
          <Grid xs={12} xl={3.5}>
            {/* <Item> */}
            <div
              style={{
                border: "1px solid #36424E",
                margin: "10px",
                borderRadius: "7px",
                color: "#e5e5e5",
                //   border:"3px solid red",
                width: "100%",
                height: "400px",
              }}
            >
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
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    alignItems: "start",
                    color: "#e5e5e5",
                    padding: "0px 10px",
                  }}
                >
                  <p
                    style={{
                      padding: "0px",
                      margin: "0px",
                      fontWeight: "bold",
                    }}
                  >
                    Usage this Year{" "}
                  </p>
                  <p
                    style={{
                      padding: "10px 0px",
                      margin: "0px",
                      fontWeight: "bold",
                      fontSize: "40px",
                      color: "#ac1717",
                    }}
                  >
                    Higher{" "}
                  </p>
                  <p
                    style={{
                      padding: "10px 0px",
                      margin: "0px",
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#1dec5b",
                    }}
                  >
                    Predictive Analysis
                  </p>

                  <p>
                    January 2024 energy consumption will be higher then 2023
                    based on AI ML Data
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "20px",
                  flexDirection: "row",
                }}
              >
                <div style={{ padding: "0px 10px" }}>2022</div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "#1dec5b",
                    borderRadius: "5px",
                    paddingLeft: "20px",
                  }}
                ></div>
                <div style={{ padding: "0px 10px" }}>2023</div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "#01A5DE",
                    borderRadius: "5px",
                    paddingLeft: "20px",
                  }}
                ></div>
                <div style={{ padding: "0px 10px" }}>Prediction</div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: "#FF5722",
                    borderRadius: "5px",
                    paddingLeft: "20px",
                  }}
                ></div>
              </div>
            </div>
            {/* </Item> */}
          </Grid>
          <Grid xs={12} xl={8.5}>
            {/* <Item> */}
            <div
              style={{
                border: "1px solid #36424E",
                // margin: "0px 40px 0px 0px",
                margin: "10px",
                height: "382.5px",
                borderRadius: "7px",
                color: "#e5e5e5",
                width: "100%",
                // height: "400px",
                paddingTop: "15px",
              }}
            >
              <MonthlyCostInternalChart />
            </div>
            {/* </Item> */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default monthlyCostGraph;

import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";
import CostInternalChart from "../components/costInternalChart.jsx"
import MonthlyCostInternalChart from "./montlyCostInternalChart.jsx";

function monthlyCostGraph(props) {
    
  return (
    <div  >
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#e5e5e5",
          padding:"0px 10px",
        //   height:"450px",
      
        }}
      >
        <img src={props.headericon} height={35} width={35} />
        <p style={{padding:"15px", margin:"0px", fontWeight:"bold", fontSize:"25px"}}>{props.heading} </p>
      </div>
      <p style={{color:"#e5e5e5", padding:"0px 0px 10px 60px", margin:"0px "}}>This month, you've use more energy from the grid accross your sites</p>

      <div style={{display:"flex", justifyContent:"center"}}>

      <div
        style={{
          border: "1px solid #36424E",
          margin: "5px 20px",
          height: "370px",
          borderRadius: "7px",
          color: "#e5e5e5",
        //   border:"3px solid red",
          flexBasis:"30%",
          height:"450px"
        }}
      >
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
        <div
        style={{
          display: "flex",
          justifyContent: "start",
          flexDirection:"column",
          alignItems: "start",
          color: "#e5e5e5",
          padding:"0px 10px",
          
         
        }}
      >
        <p style={{padding:"0px", margin:"0px", fontWeight:"bold"}}>Usage this Month </p>
        <p style={{padding:"10px 0px", margin:"0px", fontWeight:"bold", fontSize:"40px", color:"#ac1717"}}>Higher </p>
        <p>Total Usage from August 1-31, when compared to your usage for the prior month (November 2023)</p>
      </div>
        </div>
       
      </div>

      <div
        style={{
          border: "1px solid #36424E",
          margin: "0px 20px",
          height: "370px",
          borderRadius: "7px",
          color: "#e5e5e5",
          flexBasis:"70%",
          height:"450px"
        }}
      >
<MonthlyCostInternalChart/>
      </div>
      </div>
    </div>
  );
}

export default monthlyCostGraph;

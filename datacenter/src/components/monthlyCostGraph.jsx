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
        <p style={{padding:"0px", margin:"0px", fontWeight:"bold"}}>Usage this month </p>
        <p style={{padding:"10px 0px", margin:"0px", fontWeight:"bold", fontSize:"40px", color:"#ac1717"}}>Higher </p>
        <p>Total Usage from August 1-31, when compared  to your usage  for the prior month (july 2022)</p>
      </div>
        </div>
        <div style={{display:"flex", padding:"10px",flexDirection:"column"}}>
        <div>More than 2% Lower</div>
        <div style={{width:"20px", height:"20px", background:"#77d810", borderRadius:"5px",paddingLeft:"20px"}}></div>
        <div>Less than 2% or Lower</div>
        <div style={{width:"20px", height:"20px", background:"#01A5DE", borderRadius:"5px",paddingLeft:"20px"}}></div>
        <div>Between 2-3% higher</div>
        <div style={{width:"20px", height:"20px", background:"#C89902", borderRadius:"5px", paddingLeft:"20px"}}></div>
        <div>More than 3% or Lower</div>
        <div style={{width:"20px", height:"20px", background:"#A02823", borderRadius:"5px",paddingLeft:"20px"}}></div>
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

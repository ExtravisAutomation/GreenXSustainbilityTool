import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";
import CostInternalChart from "../components/costInternalChart.jsx"
// import Co2 from "../components/Co2.jsx"

function DailyCo2(props) {
    
  return (
    <div  >
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#e5e5e5",
          padding:"0px 10px",
        
      
        }}
      >
        <img src={props.headericon} height={35} width={35} />
        <p style={{padding:"15px", margin:"0px", fontWeight:"bold", fontSize:"25px"}}>{props.heading} </p>
      </div>
      <p style={{color:"#e5e5e5", padding:"0px 0px 10px 60px", margin:"0px "}}>Since Your Usage is higher this month than normal, we're expecting your energy bills to increase overall</p>

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
          padding:"20px 20px",
          
         
        }}
      >
        <p style={{padding:"0px", margin:"0px", fontWeight:"bold"}}>Est. Daily Cost this Month </p>
        <p style={{padding:"10px 0px", margin:"0px", fontWeight:"bold", fontSize:"40px", color:"#ac1717"}}>AED 783.45 </p>
        <p>Estimated daily Cost so far this month, based on your sites energy and the average energy cost in each sites region</p>
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
          height:"460px"
        }}
      >
{/* <Co2/> */}
      </div>
      </div>
    </div>
  );
}

export default DailyCo2;

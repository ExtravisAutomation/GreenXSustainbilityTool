import React from 'react';
import { useParams } from 'react-router-dom';
import device from "../../../resources/svgs/device.png"
import deviceone from "../../../resources/svgs/deviceone.png"
import simple from "../../../resources/svgs/simple.png"
import srx from "../../../resources/svgs/srx.png"




function GreenrackDetail() {
const { id } = useParams();
const containerStyle = {
    position: 'relative',
    paddingRight: '150px',
};

const overlayStyle = {
    position: 'absolute',
    top: '0',
    right: '20',
};
const tableStyle = {
    borderCollapse: 'collapse',
    // border: '1px solid black',
  };
  

  const cellStyle = {
    // border: '1px solid black',
    padding: '16px 15px 15px 15px',
    fontWeight:"500"
  };
  const span = {
   
    fontWeight:"500"
  };
  const spanblue ={
    color:"rgb(4, 144, 231)"
  }


return (

    <>

<div style={{display:"flex", justifyContent:"space-between"}}>

<div style={{flexBasis:"60%"}}>

    <div style={{color:"#e5e5e5", maxWidth:"100%"}}>
        {/* <heading>Device</heading> */}


        <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan="4" style={cellStyle}>
            Device
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>Region <br/> <span style={span}>UAE</span> </td>
          <td style={cellStyle}>Site  <br/> DXB</td>
          <td style={cellStyle}>Rack <br/> Rack-C</td>
          <td style={cellStyle}>Position <br/> Front</td>
       
        </tr>
        <tr>
        <td style={cellStyle}>Device Type <br/><span style={spanblue}>SRX3600</span> </td>
        <td style={cellStyle}>Description <br/><span style={spanblue}> DXB-JU-SRX-001 </span></td>
        <td style={cellStyle}>Status <br/><span style={{backgroundColor:"rgb(5, 165, 0)", padding:"2px 10px", borderRadius:"20px"}}>ACTIVE</span> </td>
        <td style={cellStyle}>Serial No. <br/> AA3712AA0095</td>
        </tr>
        <tr>
        <td style={cellStyle}>Manufacturer <br/> Vendor B</td>
        <td style={cellStyle}>Input Power <br/> 23%</td>
        <td style={cellStyle}>Power <br/><span style={{backgroundColor:"rgb(5, 165, 0)", padding:"2px 20px", borderRadius:"20px"}}> 40%</span></td>
        <td style={cellStyle}> <br/> </td>
        </tr>
        <tr>
        <td style={cellStyle}>Cost <br/> AED 90
</td>
        <td style={cellStyle}>Traffic <br/> 210.0 Gb/s
</td>
        <td style={cellStyle}>Bandwidth <br/> 30%
</td>
        <td style={cellStyle}>PCR <br/> 1.3 W/Gbps
</td>
        </tr>
      </tbody>
    </table>



    </div>
    </div>



    <div style={{ flexBasis: "40%", paddingLeft: "20px", display: "flex", flexDirection: "column", position: "relative" }}>
  <img src={simple} width={250} height={550} style={{ zIndex: 1 }} />
  <img src={srx} width={210} height={100} style={{ position: "absolute", top: 20, left: 40, zIndex: 2 , borderRadius:"7px"}} />
</div>


    </div>
    </>

    // <div style={{display:"flex",color:"#e5e5e5", justifyContent:"space-between"}}>
    // <div style={{color:"#e5e5e5", fontSize:"15px",minWidth:"50%"}}>
    //     <div style={{display:"flex", justifyContent:"start", alignItems:"center",font:"bold",paddingLeft:"15px",   maxWidth:"100%", border:"1px solid #474747", height:"47px", borderRadius:"7px 7px 0px 0px "}}> Device</div>
    //     <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"start",font:"bold",paddingLeft:"15px",   maxWidth:"100%", border:"1px solid #474747", height:"400px", borderRadius:"0px 0px 7px 7px"}}> 
        
    //     <div style={{display:"flex"}}>
    //     <div style={{padding:"10px", minWidth:"35%"}}>
    //     <label style={{fontWeight:"bold"}}>Region</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>UAE</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"35%"}}>
    //     <label style={{fontWeight:"bold"}}>Site</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>DXB</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"35%"}}>
    //     <label style={{fontWeight:"bold"}}>Rack</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>Rack-C</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Position</label>
    //     <div style={{display:"flex", alignItems:"center",  width:"80px", height:"40px", borderRadius:"8px"}}>Front</div>
    //     </div>
    //     </div>
        
    //     <div style={{display:"flex", justifyContent:"space-between"}}>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Device Type</label>
    //     <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>SRX3600</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Description</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>DXB-JU-SRX-001</div>
    //     </div>
    //     <div style={{padding:"10px"}}>
    //     <label style={{fontWeight:"bold"}}>Status</label>
    //     <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"20px",backgroundColor:"#71B626"}}>Active</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%",paddingLeft:"50px"}}>
    //     <label style={{fontWeight:"bold", paddingLeft:"20px"}}>Serial No.</label>
    //     <div style={{display:"flex", alignItems:"center",paddingLeft:"20px",  width:"80px", height:"40px", borderRadius:"8px"}}>AA3712AA0095</div>
    //     </div>
    //     </div>


    //     <div style={{display:"flex", justifyContent:"space-between"}}>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Manufacturer</label>
    //     <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>Juniper</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Input Power</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>23%</div>
    //     </div>
    //     <div style={{padding:"5px"}}>
    //     <label style={{fontWeight:"bold"}}>Power</label>
    //     <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"7px",backgroundColor:"#71B626"}}>40%</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%",paddingLeft:"80px"}}>
    //     <label style={{fontWeight:"bold", paddingLeft:"20px"}}></label>
    //     <div style={{display:"flex", alignItems:"center",paddingLeft:"20px",  width:"80px", height:"40px", borderRadius:"8px"}}>-</div>
    //     </div>
    //     </div>

    //     <div style={{display:"flex", justifyContent:"space-between"}}>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Cost</label>
    //     <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>AED 90</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%"}}>
    //     <label style={{fontWeight:"bold"}}>Traffic</label>
    //     <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>210.0 Gb/s</div>
    //     </div>
    //     <div style={{padding:"10px"}}>
    //     <label style={{fontWeight:"bold"}}>Bandwidth</label>
    //     <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"20px"}}>30%</div>
    //     </div>
    //     <div style={{padding:"10px",minWidth:"30%",paddingLeft:"50px"}}>
    //     <label style={{fontWeight:"bold", paddingLeft:"20px"}}>PCR</label>
    //     <div style={{display:"flex", alignItems:"center",paddingLeft:"20px",  width:"80px", height:"40px", borderRadius:"8px"}}>1.3 W/Gbps</div>
    //     </div>
    //     </div>

        /* <div style={{display:"flex"}}>
        <div style={{padding:"10px",paddingLeft:"80px"}}>
        <label style={{fontWeight:"bold"}}>Menufacturer</label>
        <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>Cisco</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Input power</label>
        <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>23%</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Required Power</label>
        <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"20px",backgroundColor:"#71B626"}}>90%</div>
        </div>
        
        </div> */

        /* <div style={{display:"flex"}}>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Cost</label>
        <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>AED 90</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Traffic</label>
        <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>450.0Gb/s</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Bandwidth</label>
        <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"20px",backgroundColor:"#71B626"}}>30%</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>PCR</label>
        <div style={{display:"flex", alignItems:"center",  width:"80px", height:"40px", borderRadius:"8px"}}>1.3 W/Gbps</div>
        </div>
        </div> */
        /* <div style={{display:"flex"}}>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Power Efficieny</label>
        <div style={{display:"flex", alignItems:"center", height:"40px", borderRadius:"8px", color:"#0490E7"}}>80%</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Input Power</label>
        <div style={{display:"flex", alignItems:"center", width:"80px", height:"40px", borderRadius:"8px"}}>75%</div>
        </div>
        <div style={{padding:"10px"}}>
        <label style={{fontWeight:"bold"}}>Co2 Emission</label>
        <div style={{display:"flex", alignItems:"center",padding:"2px 10px",marginTop:"5px", borderRadius:"5px",backgroundColor:"#862406"}}>50.5 g</div>
        </div>
    
        </div> */
        

        
        
        // </div>


        
        

    // </div>
    
    // <div style={{paddingRight:"50px",position: "relative", paddingRight: "150px" }}>
    // <img src={device} width={250} height={550}/>
    
    // </div>
    // </div>
//     <div style={{ color: '#e5e5e5' }}>
//       <article style={{display:"flex", justifyContent:"space-between",alignItems:"center", padding:"20px 20px"}}>

//         <div style={{display:"flex", flexDirection:"column"}}>

// <label>Region</label>
// <label>DXB</label>
// </div>
// <div style={{display:"flex", flexDirection:"column"}}>

// <label>Site</label>
// <label>DXB</label>
// </div>
// <div style={{display:"flex", flexDirection:"column"}}>

// <label>Rack</label>
// <label>Rack AC</label>
// </div>
// <div style={{display:"flex", flexDirection:"column"}}>

// <label>Position</label>
// <label>Front</label>
// </div>



//       </article>
    
//     </div>
);
}

export default GreenrackDetail;

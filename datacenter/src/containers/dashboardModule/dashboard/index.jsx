import React from 'react'
import LineChart from "./../../../components/lineChat.jsx"
import GraphTable from "./../../../components/graphTable.jsx"
import PowercostGraph from '../../../components/powercostGraph.jsx'
import EmissionChart from '../../../components/emissionChart.jsx'
import HardwareLifeCycle from '../../../components/hardwareLifeCycle.jsx'
import UnusedPortsCharts from '../../../components/unusedPortGraph.jsx'
import "./dashboard.css"
import UsedFspsChart from '../../../components/usedFspsChart.jsx'
import Grid from '@mui/material/Grid';
import DailyCostGraph from '../../../components/dailyCostGraph.jsx'
import TopDevicesCost from "../../../components/topDevicesCost.jsx"
import dollar from "../../../resources/svgs/dollar.png"
import electric from "../../../resources/svgs/electric.png"
import leaf from "../../../resources/svgs/leaf.png"
import UaeSiteMap from '../../../components/uaeSiteMap.jsx'
import  HeatmapChart  from '../../../components/heatmapChart.jsx'

function index() {

    const chartData = [
        { value: 1048, name: 'End of Sale' },
        { value: 580, name: 'End of Life' },
        { value: 484, name: 'End of Support' },
      ];
  return (
    <>
     <Grid container spacing={3} style={{ marginTop: '30px' }}>
      <Grid item xs={12} sm={6}>
        <div className='wrapper' style={{padding:"0px 0px 10px 0px"}}>
        <LineChart />
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className='wrapper' >
        <GraphTable />
        </div>
      </Grid>
      
    </Grid>
    
<div>  
<div className='power-cost-chart-wrapper'>
  
    <PowercostGraph/>
</div>
</div>

<div style={{display:"flex", justifyContent:"space-between", marginTop:"30px"}}>

<div style={{flexBasis:"40%"}} className='heat-map'>
  <HeatmapChart/>
  </div>
<div className='emission-chart-wrapper'><EmissionChart/></div>


</div>

<div style={{display:"flex", justifyContent:"space-between", marginTop:"30px"}}>
<div className='donut-graph-wrapper' ><HardwareLifeCycle chartData={chartData}/></div>
<div className='donut-graph-wrapper' ><UnusedPortsCharts/></div>
<div className='donut-graph-wrapper' ><UsedFspsChart/></div>

</div>
<div style={{border:'1px solid #36424E',marginTop:"30px", borderRadius:"7px",height:"500px"}}>





{/* 3 x Table Dataaaaa */}
<div style={{display:"flex", justifyContent:"space-evenly", marginTop:"30px"}}>
<div className='table-data-wrapper' style={{height:"450px"}} ><TopDevicesCost heading="Estimated Cost" headericon={dollar}/></div>
<div className='table-data-wrapper'  style={{height:"450px"}} > <TopDevicesCost heading="Energy Consumption"headericon={electric}/></div>
<div className='table-data-wrapper'  style={{height:"450px"}}><TopDevicesCost heading="Estimated GHG Emissions" headericon={leaf}/></div>

</div>
</div>



<div style={{border:'1px solid #36424E',marginTop:"30px", borderRadius:"7px",height:"500px"}}>

<UaeSiteMap/>



</div>



<div style={{border:'1px solid #36424E',marginTop:"30px", borderRadius:"7px",height:"500px"}}>

<div style={{display:"flex", justifyContent:"center", marginTop:"0px"}}>

<div className='cost-graph-wrapper'  style={{height:"450px"}} > 
<DailyCostGraph heading="Cost"headericon={electric}/>
</div>

</div>
</div>

    </>
  )
}

export default index

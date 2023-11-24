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

<div style={{flexBasis:"40%"}}>first </div>
<div className='emission-chart-wrapper'><EmissionChart/></div>


</div>

<div style={{display:"flex", justifyContent:"space-between", marginTop:"30px"}}>
<div className='donut-graph-wrapper' ><HardwareLifeCycle chartData={chartData}/></div>
<div className='donut-graph-wrapper' ><UnusedPortsCharts/></div>
<div className='donut-graph-wrapper' ><UsedFspsChart/></div>

</div>

    </>
  )
}

export default index

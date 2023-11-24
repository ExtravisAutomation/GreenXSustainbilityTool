import React from 'react'
import LineChart from "./../../../components/lineChat.jsx"
import GraphTable from "./../../../components/graphTable.jsx"
import PowercostGraph from '../../../components/powercostGraph.jsx'
import EmissionChart from '../../../components/emissionChart.jsx'
import HardwareLifeCycle from '../../../components/hardwareLifeCycle.jsx'
import UnusedPortsCharts from '../../../components/unusedPortGraph.jsx'
import "./dashboard.css"
import UsedFspsChart from '../../../components/usedFspsChart.jsx'

function index() {

    const chartData = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ];
  return (
    <>
    <div style={{display:"flex", justifyContent:"space-between", marginTop:"30px"}}>

        <div className='line-chart-wrapper'>
      <LineChart/>
      </div>

      <div className='table-chart-wrapper'>
      <GraphTable/>
      </div>
      

    </div>

<div className='power-cost-chart-wrapper'>
    <PowercostGraph/>
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

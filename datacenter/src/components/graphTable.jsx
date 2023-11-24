import React from 'react';
import "./graphTable.css"
import Typography from 'antd/es/typography/Typography';

const Table = () => {
  // Sample data for the table
  const tableData = [
    { name: 'Rack AA', cost: 50, power: 30 },
    { name: 'Rack AB', cost: 80, power: 60 },
    { name: 'Rack AC', cost: 40, power: 25 },
    { name: 'Rack AD', cost: 60, power: 40 },
  ];

  return (
    <>
        <Typography variant="h6" gutterBottom className="graph-table-heading" style={{ color: '#E5E5E5', padding: '5px 0px 5px 5px' }}>
        Top 5 Racks by space      </Typography>
    <table style={{width:"100%", marginTop:"20px", borderRadius:"7px"}}>
     
      <thead >
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Input Power</th>
        </tr>
      </thead>
      <tbody >
        {tableData.map((item, index) => (
          <tr key={index} >
            <td style={{color:"#0490e7"}}>{item.name}</td>
            <td>
                <div style={{display:"flex", alignItems:"center",justifyContent:"space-between",minWidth:"80px", height:"35px", borderRadius:"7px"}}>
              {item.cost}%
              <div className="percentage-bar cost" style={{ width: `${item.cost}%` }}></div>
              </div>
            </td>
            <td style={{display:"flex", alignItems:"center", justifyContent:"space-between",height:"35px"}}>
              {item.power}%
              <div className="percentage-bar power" style={{ width: `${item.power}%` }}></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default Table;

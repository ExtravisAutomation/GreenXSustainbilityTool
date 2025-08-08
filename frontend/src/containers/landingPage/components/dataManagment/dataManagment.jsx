import React from 'react';
import image from '../../assets/data-managment.svg'
import './dataManagment.css'

const DataManagement = () => {
  return (
    <div className="data-management-container">
      <h2 className="section-header">
        GreenX: Powering Sustainable Data<br/> Management
      </h2>
      <img
        src={image}
        alt="Data Management Image"
        className="data-image"
      />
    </div>
  );
};

export default DataManagement;

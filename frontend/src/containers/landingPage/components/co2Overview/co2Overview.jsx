import React from 'react';
import './co2Overview.css';
import co2OverviewImage from '../../assets/co2-overview-image.svg';
import FeatureAccordion from '../../ui/featureAccordian';

const dummyData = [
  {
    title: 'Device Emission Trends',
    description:
      'Compare CO₂ emission rates across devices to identify patterns and optimize operations.',
  },
  {
    title: 'Sustainability Metrics',
    description:
      'Compare CO₂ emission rates across devices to identify patterns and optimize operations.',
  },
  {
    title: 'Informed Optimization',
    description:
      'Compare CO₂ emission rates across devices to identify patterns and optimize operations.',
  },
];

const Co2Overview = () => {
  return (
    <div className="co2-main-container">
      <div className="co2-overview-section">
        <h2 className="section-header">CO₂ Emissions Overview</h2>
        <div className="co2-container">
          <div className="co2-legend">
            <FeatureAccordion data={dummyData} />
          </div>
          <img
            src={co2OverviewImage}
            alt="Heat Map of Racks"
            className="co2-emission-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Co2Overview;

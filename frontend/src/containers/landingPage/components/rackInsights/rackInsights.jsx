import React from 'react';
import efficiencyIcon from '../../assets/rackinsights/efficiency-icon.svg';
import optimizationIcon from '../../assets/rackinsights/optimization-icon.svg';
import powerIcon from '../../assets/rackinsights/power-icon.svg';
import heatMapImage from '../../assets/rackinsights/rack-heat-map.svg';
import './rackInsights.css';
import FeatureAccordionDemo from '../../ui/featureAccordian';
import StripItem from '../../ui/stripItems';

const RackInsights = () => {
  const insights = [
    {
      icon: efficiencyIcon,
      text: 'Efficiently track and manage <br/> all infrastructure assets.',
    },
    {
      icon: optimizationIcon,
      text: 'Optimize resource usage to <br/> prevent over or underutilization.',
    },
    {
      icon: powerIcon,
      text: 'Monitor and control power <br/> consumption for energy efficiency.',
    },
  ];
  
  const dummyData = [
    {
      title: 'Thermal Management',
      description:
        'Quickly identify hotspots and manage cooling systems to maintain optimal performance and prevent overheating.',
    },
    {
      title: 'Utilization Monitoring',
      description:
        'Quickly identify hotspots and manage cooling systems to maintain optimal performance and prevent overheating.',
    },
    {
      title: 'Fault Detection',
      description:
        'Quickly identify hotspots and manage cooling systems to maintain optimal performance and prevent overheating.',
    },
  ];

  return (
    <div className="rack-insights-container">
      <StripItem items={insights}/>
      <div className="heat-map-section">
        <h2 className="section-header">Rack Insights at a Glance</h2>
        <div className="heat-map-container">
          <img
            src={heatMapImage}
            alt="Heat Map of Racks"
            className="heat-map-image"
          />
          <div className="heat-map-legend">
            <FeatureAccordionDemo data={dummyData}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RackInsights;

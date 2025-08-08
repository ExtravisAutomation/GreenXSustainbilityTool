import React from 'react';
import Card from '../../ui/Card';
import energyEfficiencyIcon from '../../assets/whyGreenX/energy-efficieny.svg';
import capcityIcon from '../../assets/whyGreenX/capacity.svg';
import productivityIcon from '../../assets/whyGreenX/productivity.svg';
import upTimeIcon from '../../assets/whyGreenX/uptime.svg';
import arrowsIcon from '../../assets/whyGreenX/arrows.svg';

import './whyGreenX.css';

const defaultFeatures = [
  {
    title: 'Ensure Uptime',
    description: 'Proactively monitor systems to prevent disruptions.',
    icon: upTimeIcon,
  },
  {
    title: 'Optimize Capacity',
    description: 'Streamline resource allocation and infrastructure planning.',
    icon: capcityIcon,
  },
  {
    title: 'Boost Energy Efficiency',
    description: 'Track and optimize energy use for sustainability.',
    icon: energyEfficiencyIcon,
  },
  {
    title: 'Enhance Productivity',
    description: 'Simplify workflows to improve team performance.',
    icon: productivityIcon,
  },
];

const WhyGreenX = ({
  header = 'Why GreenX?',
  para = '  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br /> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
  features = defaultFeatures,
}) => {
  return (
    <div className="why-greenx-section">
      <Card padding="45px 0">
        <h2
          className="section-header"
          dangerouslySetInnerHTML={{ __html: header }}
        ></h2>
        <p dangerouslySetInnerHTML={{ __html: para }}></p>
        <div className="features-container">
          {features.map((feature, index) => (
            <>
              <div className="greenX-card">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="feature-icon"
                />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              {index !== features.length - 1 && (
                <img src={arrowsIcon} alt="Arrows Icon" />
              )}
            </>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WhyGreenX;

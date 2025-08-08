import React from 'react';
import automateGuideImage from '../../assets/automate-guide.svg';
import StripItem from '../../ui/stripItems';
import arrowIcon from '../../assets/automateGuide/icon-1.svg';
import globeIcon from '../../assets/automateGuide/icon-2.svg';
import walletIcon from '../../assets/automateGuide/icon-3.svg';
import './automateGuide.css';

const AutomateGuide = () => {
  const features = [
    {
      icon: arrowIcon,
      text: 'Developed with the highest<br/> care. Always updated.',
    },
    {
      icon: globeIcon,
      text: 'Get free goodies from all over<br/> the world after purchase.',
    },
    {
      icon: walletIcon,
      text: 'Save up to 10% of every<br/> purchase you made.',
    },
  ];

  return (
    <div className="automate-guide-container">
      <StripItem items={features} />
      <div className="main-content">
        <h2 className="section-header">
          Driving Data Sustainability: Automate,<br/> Guide, and Measure Effectively
        </h2>
        <img
          src={automateGuideImage}
          alt="Automate Guide"
          className="automate-guide-image"
        />
      </div>
    </div>
  );
};

export default AutomateGuide;

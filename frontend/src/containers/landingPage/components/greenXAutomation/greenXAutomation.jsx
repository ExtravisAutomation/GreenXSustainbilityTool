import React from 'react';
import Card from '../../ui/Card';
import mainIcon from '../../assets/greenXAutomation/main-icon.svg';

const GreenXAutomation = () => {
  return (
    <Card padding="20px" margin="100px">
      <div style={{ textAlign: 'center' }}>
        <h2>GreenX Automation</h2>
        <p>
          GreenX Automation integrates with network devices, generators, BMS,
          and third-
          <br />
          party APIs for efficient data center management.
        </p>
        <img
          src={mainIcon}
          alt="Main Icon"
          style={{ width: '100%', maxWidth: '1200px', margin: '20px 0' }}
        />
      </div>
    </Card>
  );
};

export default GreenXAutomation;

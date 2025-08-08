import React from 'react';
import './dcim.css'; // Assuming you will create a CSS file for styling
import Button from '../../ui/button';
import dcimImage from '../../assets/about-us/dcim-img.svg';
import Card from '../../ui/Card';

const DCIM = () => {
  return (
    <div className="dcim-container">
      {/* <div className="dcim-section"> */}
      <Card className="dcim-section">
        <div className="dcim-content">
          <h2 className="section-header">
            Software for Data Center <br />
            Infrastructure Management
          </h2>
          <p>
            The Data Sustainability Center ensures efficient, eco-friendly, and{' '}
            <br />
            future-ready data operations by optimizing storage, processing, and{' '}
            <br />
            management while reducing environmental impact. It replaces outdated{' '}
            <br />
            tools and bridges IT, Facilities, and Operations teams to maximize{' '}
            <br />
            resource utilization, cut energy consumption, and improve
            infrastructure <br />
            planning, enabling sustainable and responsible data management.
          </p>
          <Button
            text="Get Free Trial"
            onClick={() => console.log('Free trial requested')}
          />
        </div>
        <div className="dcim-image">
          <img src={dcimImage} alt="DCIM Illustration" />
        </div>
      </Card>
      {/* </div> */}
    </div>
  );
};

export default DCIM;

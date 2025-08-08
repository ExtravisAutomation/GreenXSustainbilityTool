import React from 'react';
import tooIntegrationImage from '../../assets/tool-integration/tool-integration-image.svg';
import footerLeftImage from '../../assets/tool-integration/footer-image-left.svg';
import footerRightImage from '../../assets/tool-integration/footer-image-right.svg';
import './toolIntegration.css';
import CustomCard from '../../../../components/customCard';

const ToolIntegration = () => {
  return (
    <div className="tool-integration-container">
     {/* <CustomCard className="tool-integration-container"> */}
      <h2 className="header">
        Integrate your favorite tools and <br />
        share your funnel with the world.
      </h2>
      <div className="tool-integration-content">
        <div className="tool-integration-main">
          <img src={tooIntegrationImage} alt="Tool Integration" />
        </div>
      </div>
      <div className="tool-integration-footer-images">
        <div className="tool-integration-main">
          <img src={footerLeftImage} alt="The Data Center For Your Business" />
          <img
            src={footerRightImage}
            alt="Top Devices by Memory Utilization Analysis"
          />
        </div>
      </div>
    {/* </CustomCard> */}
    </div>
  );
};

export default ToolIntegration;

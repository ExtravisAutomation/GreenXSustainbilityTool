import React, { useState } from 'react';
import './hero.css'; // Assuming you will create a CSS file for styling
import Button from '../../ui/button';
import ImageCenter from '../../assets/hero-image-center.svg';
import ImageLeft from '../../assets/hero-image-left.svg';
import ImageRight from '../../assets/hero-image-right.svg';

const Hero = () => {
  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            The Data Center Solutions
            <br />
            For Your Business
          </h1>
          <p>
            Empower your Network team. The one stop platform for all Data <br />
            management of small and medium-sized organization..
          </p>
          <InputBar />
        </div>
      </div>
      <DashboardGrid />
    </>
  );
};

export default Hero;
// Start Generation Here
const InputBar = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleButtonClick = () => {
    console.log('Email submitted:', email);
  };

  return (
    <div className="email-input-container">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleInputChange}
        className="email-input"
      />
      <Button text="Book a Demo" onClick={handleButtonClick} />
    </div>
  );
};

const DashboardGrid = () => {
  return (
    <div className="dashboard-grid">
      <img className="left grid-item" src={ImageLeft} alt="Chart 1" />
      <img className="center grid-item" src={ImageCenter} alt="Chart 2" />
      <img className="right grid-item" src={ImageRight} alt="Chart 3" />
    </div>
  );
};

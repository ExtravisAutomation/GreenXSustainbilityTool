import React from 'react';
import heroTop from '../../assets/about-us/hero-top.svg';
import heroBottom from '../../assets/about-us/hero-bottom.svg';
import heroRight from '../../assets/about-us/hero-right.svg';
import Waves from '../../assets/about-us/waves.svg';
import './aboutUsHero.css'; // Assuming you have a CSS file for styling
import Button from '../../ui/button';

const AboutUsHero = ({
  header = 'About GreenX',
  para = 'The Data Sustainability Center optimizes data center operations by uniting workflows across teams to enhance efficiency and promote eco-friendly practices.',
}) => {
  const handleButtonClick = () => {
    console.log('Email submitted:');
  };
  return (
    <div className="about-us-hero">
      <div className="about-us-content">
        <div className="main-content" style={{textAlign:'left'}}>
          <h1>{header}</h1>
          <p dangerouslySetInnerHTML={{ __html: para }} />
          <Button text="Book a Demo" onClick={handleButtonClick} />
        </div>
        <div className="about-us-grid">
          <img src={heroTop} alt="Hero Top" className="hero-top" />
          {/* <div style={{ position: 'relative' }} className="hero-right"> */}
          <img src={heroRight} alt="Hero Right" className="hero-right" />
          {/* </div> */}
          <img src={heroBottom} alt="Hero Bottom" className="hero-bottom" />
          <img src={Waves} className="waves" />
        </div>
      </div>
    </div>
  );
};

export default AboutUsHero;

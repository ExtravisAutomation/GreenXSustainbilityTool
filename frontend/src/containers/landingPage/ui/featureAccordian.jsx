import React, { useState } from 'react';
import './featureAccordian.css';

const FeatureAccordion = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div 
      className='accordion-container'
      onMouseLeave={() => setOpenIndex(0)}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${openIndex === index ? 'open' : ''}`}
          onMouseEnter={() => setOpenIndex(index)}
        >
          <div className="accordion-header">
            <h3>{item.title}</h3>
            <p className={`accordian-description ${openIndex === index ? 'open' : ''} `}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Dummy data for demonstration


export default FeatureAccordion;

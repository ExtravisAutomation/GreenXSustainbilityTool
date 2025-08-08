import React from 'react';
import mailImage from '../../assets/mail-image.svg';
import './newsLetter.css';

const Newsletter = () => {
  return (
    <div className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2>Stay Updated with GreenX</h2>
          <p>Unlock exclusive insights into sustainability and technology!</p>
          <ul>
            <li>
              Get the latest trends in sustainable tech and data center
              innovation.
            </li>
            <li>
              Stay informed on our environmental initiatives and progress toward
              net-zero.
            </li>
            <li>
              Receive curated updates, events, and success stories straight to
              your inbox.
            </li>
          </ul>
          <div className="newsletter-input-container">
            <input
              type="email"
              placeholder="Your Email"
              className="newsletter-input"
            />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
        <img src={mailImage} alt="Mail" className="newsletter-image" />
      </div>
    </div>
  );
};

export default Newsletter;

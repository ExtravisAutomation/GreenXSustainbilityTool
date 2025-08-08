import React from 'react';
import './2minDrill.css'; // Assuming you will create a CSS file for styling
import videoFile from '../../assets/videos/GreenX-Video.mp4'; // Placeholder for video file

const TwoMinDrill = ({
  header = 'Watch our DCS Video "The 2 Min Drill"',
  para = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor<br/> incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
}) => {
  return (
    <div className="two-min-drill-section">
      <div className="video-wrapper">
        <div className="video-header">
          <h2>{header}</h2>
          <p dangerouslySetInnerHTML={{ __html: para }} />
        </div>
        <div className="video-thumbnail">
          <video width="100%" controls autoPlay muted>
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default TwoMinDrill;

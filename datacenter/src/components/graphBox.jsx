import React from 'react';

function graphBox({ backgroundColor, onClick }) {
  return (
    <div
    style={{
      width: "50px",
      height: "50px",
      backgroundColor: backgroundColor,
      cursor: "pointer", // Add this to show that it's clickable
      borderRadius:"5px"
    }}
    onClick={onClick}
  ></div>
  );
}

export default graphBox;

// src/containers/landingPage/ui/Button.jsx

import React from 'react';
import './button.css'

const Button = ({ text, onClick }) => {
//   const buttonStyle = {
//     backgroundColor: '#A3DC2F',
//     color: '#000',
//     border: 'none',
//     borderRadius: '20px',
//     padding: '10px 20px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     display: 'inline-block',
//     textAlign: 'center',
//   };

  return (
    <button className='button' onClick={onClick}>
      {text}
    </button>
  );
};


export default Button;
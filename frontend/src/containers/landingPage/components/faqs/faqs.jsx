import React, { useState } from 'react';
import closeIcon from '../../assets/faq-close-icon.svg'
import openIcon from '../../assets/faq-open-icon.svg'
import './faqs.css';

const Faqs = () => {
  const [openFaqs, setOpenFaqs] = useState([0]);

  const faqs = [
    {
      question: 'What sustainability measures does GreenX use?',
      answer: 'GreenX uses energy-efficient cooling, renewable energy, and AI for energy management. We also recycle and refurbish hardware.',
    },
    {
      question: 'How does GreenX reduce energy use?',
      answer: 'GreenX implements advanced cooling technologies and optimizes energy consumption through AI.',
    },
    {
      question: 'How does GreenX cut its carbon footprint?',
      answer: 'By using renewable energy sources and improving energy efficiency across all operations.',
    },
    {
      question: 'Does GreenX use renewable energy?',
      answer: 'Yes, GreenX is committed to using renewable energy wherever possible.',
    },
    {
      question: 'Is GreenX certified for sustainability?',
      answer: 'GreenX holds multiple certifications for its sustainability efforts.',
    },
  ];

  const toggleFaq = (index) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };

  return (
    <div className="faqs-section">
      <h2>Frequently asked questions</h2>
      <p>Everything you need to know about the product and billing.</p>
      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openFaqs.includes(index) ? 'active' : ''}`}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              {faq.question}
              <img className="faq-icon" src={openFaqs.includes(index) ? closeIcon : openIcon}/>
            </div>
            {openFaqs.includes(index) && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;


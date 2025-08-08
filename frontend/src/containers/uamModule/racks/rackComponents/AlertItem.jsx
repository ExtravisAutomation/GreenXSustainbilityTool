import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import {
  IoAlertCircle,
  IoAlertCircleOutline,
  IoAlertCircleSharp,
} from 'react-icons/io5';
import styled from 'styled-components';

const AlertWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid;
  margin-bottom: 8px;
  ${({ type, mode }) => {
    const isDark = mode === 'dark';
    if (isDark) {
      switch (type) {
        case 'info':
          return `
            background-color: rgba(30, 64, 175, 0.2);
            color: #bfdbfe;
            border-color: rgba(30, 58, 138, 0.5);
          `;
        case 'warning':
          return `
            background-color: rgba(146, 64, 14, 0.2);
            color: #fde68a;
            border-color: rgba(120, 53, 15, 0.5);
          `;
        case 'error':
          return `
            background-color: rgba(153, 27, 27, 0.2);
            color: #fca5a5;
            border-color: rgba(127, 29, 29, 0.5);
          `;
        case 'success':
          return `
            background-color: rgba(22, 101, 52, 0.2);
            color: #bbf7d0;
            border-color: rgba(20, 83, 45, 0.5);
          `;
        default:
          return '';
      }
    } else {
      switch (type) {
        case 'info':
          return `
            background-color: #eff6ff;
            color: #1d4ed8;
            border-color: #bfdbfe;
          `;
        case 'warning':
          return `
            background-color: #fffbeb;
            color: #b45309;
            border-color: #fde68a;
          `;
        case 'error':
          return `
            background-color: #fef2f2;
            color: #b91c1c;
            border-color: #fecaca;
          `;
        case 'success':
          return `
            background-color: #f0fdf4;
            color: #15803d;
            border-color: #bbf7d0;
          `;
        default:
          return '';
      }
    }
  }}
`;

const IconWrapper = styled.div`
  margin-right: 8px;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TimeText = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

function AlertItem({ type, message, time, mode }) {
  const icons = {
    info: <IoAlertCircle size={16} />,
    warning: <IoAlertCircleOutline size={16} />,
    error: <IoAlertCircleSharp size={16} />,
    success: <FaLeaf size={16} />,
  };

  return (
    <AlertWrapper type={type} mode={mode}>
      <IconWrapper>{icons[type]}</IconWrapper>
      <ContentWrapper>
        <Message>{message}</Message>
        <TimeText>{time}</TimeText>
      </ContentWrapper>
    </AlertWrapper>
  );
}

export default AlertItem;

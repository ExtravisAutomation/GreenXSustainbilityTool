// AlertsSection.jsx
import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import AlertItem from './AlertItem';
import { useTheme } from '@mui/material';

const SectionWrapper = styled.div`
  margin: auto 10px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

function AlertsSection({ isDarkMode = false }) {
  const theme = useTheme();
  return (
    <SectionWrapper dark={isDarkMode}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            fontSize: '1.125rem',
            margin: '0px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          Recent Alerts
        </h3>
        {/* <span
          style={{
            fontSize: '0.75rem', // 12px
            color: theme?.palette?.main_layout?.secondary_text,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          View All
        </span> */}
      </div>

      <div
        style={{ height: '255px', overflowY: 'scroll', padding: '0px 10px' }}
      >
        <AlertItem
          type="warning"
          message="Temperature threshold exceeded"
          time="2 minutes ago"
          mode={theme?.mode}
        />
        <AlertItem
          type="info"
          message="Routine maintenance scheduled"
          time="2 hours ago"
          mode={theme?.mode}
        />
        <AlertItem
          type="success"
          message="Energy efficiency target met"
          time="Today, 09:15"
          mode={theme?.mode}
        />
        <AlertItem
          type="error"
          message="Cooling unit failure - Rack B2"
          time="Yesterday"
          mode={theme?.mode}
        />

        {/*  */}
        <AlertItem
          type="error"
          message="Cooling unit failure - Rack B2"
          time="Yesterday"
          mode={theme?.mode}
        />
        <AlertItem
          type="error"
          message="Cooling unit failure - Rack B2"
          time="Yesterday"
          mode={theme?.mode}
        />
        <AlertItem
          type="error"
          message="Cooling unit failure - Rack B2"
          time="Yesterday"
          mode={theme?.mode}
        />
      </div>
    </SectionWrapper>
  );
}

export default AlertsSection;

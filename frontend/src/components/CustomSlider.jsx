import React from 'react';
import styled from 'styled-components';
import { Row, Col, Slider, InputNumber } from 'antd';
import { useTheme } from '@mui/material';

const ThemedSlider = styled(Slider)`
  .ant-slider-rail {
    background-color: ${({ theme }) => theme?.palette?.slider?.rail} !important;
    // border: 3px solid ${({ theme }) => theme?.palette?.default_card?.border};
    height: 6px !important;
    border-radius: 4px !important;
  }

  .ant-slider-track {
    background-color: ${({ theme }) =>
      theme?.palette?.slider?.track || '#6750A4'} !important;
    height: 6px !important;
    border-radius: 2px !important;
  }

  .ant-slider-handle {
    width: 10px !important;
    height: 19px !important;
    border-radius: 2px !important;
    margin-top: -4px !important;
    background-color: ${({ theme }) =>
      theme?.palette?.slider?.handle || '#6f42c1'} !important;
    border: 3px solid ${({ theme }) => theme?.palette?.slider?.border} !important;
    box-shadow: none !important;
    // border-left: 2px solid white;
  }

  .ant-slider-handle::before,
  .ant-slider-handle::after {
    display: none !important; /* Fully removes the white rings */
  }

  .ant-slider-handle:focus,
  .ant-slider-handle:hover {
    box-shadow: none !important; /* Ensure no glow on hover/focus */
  }
`;

const StyledInput = styled(InputNumber)`
  width: 100%;
  border-radius: 4px !important;

  background: ${({ theme }) =>
    theme?.palette?.default_select?.background || '#f9f9f9'} !important;
  border: none !important;
  color: ${({ theme }) =>
    theme?.palette?.default_input?.primary_text || '#333'} !important;
  height: 30px !important;
  width: 80px !important;
  /* Hover state */
  &:hover {
    border: 1px solid
      ${({ theme }) => theme?.palette?.main_layout?.secondary_text} !important;
    box-shadow: none !important;
  }

  /* Focus state (when input is active) */
  &.ant-input-number-focused {
    border: 1px solid
      ${({ theme }) => theme?.palette?.main_layout?.secondary_text} !important;
    box-shadow: none !important; /* Optional: remove blue shadow */
  }
  .ant-input-number-input {
    color: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || '#333'} !important;
    background: transparent !important;
  }

  .ant-input-number-handler-wrap {
    border: ${({ theme }) => theme?.palette?.default_card?.border} !important;
    background: ${({ theme }) =>
      theme?.palette?.default_input?.background || '#333'} !important;
  }

  .ant-input-number-handler-up-inner svg,
  .ant-input-number-handler-down-inner svg {
    fill: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || '#333'} !important;
  }
`;
const CustomSlider = ({ value, onChange, min = 1, max = 5, step = 0.1 }) => {
  const theme = useTheme();

  return (
    <Row
      gutter={10}
      align="middle"
      justify="start"
      style={{
        padding: '2px 10px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* <Col flex="1">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <p>Pue </p>
          <ThemedSlider
            theme={theme}
            min={min}
            max={max}
            step={step}
            value={typeof value === 'number' ? value : 0}
            onChange={onChange}
            tooltip={{ open: false }}
          />
        </div>
      </Col> */}
      <Col flex="1">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // space between label and slider
          }}
        >
          {/* <p
            style={{
              fontSize: '14px',
              margin: 0,
              whiteSpace: 'nowrap',
              color: theme?.palette?.main_layout?.primary_text,
            }}
          >
            PUE
          </p> */}
          <div style={{ flex: 1 }}>
            <ThemedSlider
              theme={theme}
              min={min}
              max={max}
              step={step}
              value={typeof value === 'number' ? value : 0}
              onChange={onChange}
              tooltip={{ open: false }}
            />
          </div>
        </div>
      </Col>
      <Col>
        <StyledInput
          theme={theme}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default CustomSlider;

import React from 'react';
import { useTheme } from '@mui/material/styles';

const AntdTooltipContent = ({ time, outputPower, inputPower }) => {
  const theme = useTheme();

  const efficiency =
    inputPower && inputPower > 0 ? (outputPower / inputPower) * 100 : 0;

  const tooltipBg = theme?.palette?.mode === 'dark' ? '#1F1F1F' : '#fff';
  const tooltipBorder = theme?.palette?.graph?.tooltip_border || '#d9d9d9';

  let efficiencyColor = '#42AE46';
  if (efficiency <= 50) efficiencyColor = '#fb0200';
  else if (efficiency <= 75)
    efficiencyColor = theme?.name?.includes('Purple')
      ? theme?.palette?.main_layout?.secondary_text
      : '#0490E7';

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        padding: '6px 4px',
        lineHeight: 1.6,
        minWidth: 240,
        color: theme?.palette?.text?.primary || '#000',
      }}
    >
      <div
        style={{
          background: tooltipBg,
          padding: 10,
          borderRadius: 7,
          border: `1px solid ${tooltipBorder}`,
          marginBottom: 6,
        }}
      >
        Efficiency% = <br /> Power Output / Power Input × 100
      </div>
    </div>
  );
};

export default AntdTooltipContent;

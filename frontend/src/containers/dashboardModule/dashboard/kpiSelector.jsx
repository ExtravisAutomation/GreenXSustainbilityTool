import React, { useEffect } from 'react';
import { Select, Space } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

const { OptGroup } = Select;

const KpiSelector = ({
  options,
  setKpiOption,
  setPiOption,
  setThrouputOption,
  throughPut,
  topDevices,
  setTopDevicesOption,
  setThreshholdOption,
  onCurrencyChange,
  handleDurationChange,
  setPueOption,
  setPueOption2,
  onChangePue,
  setDeviceCarbonEmiisionOption,
  deviceCarbonEmission,
  pue,
  pueDash,
  updatedDash,
  pueMode,
  pueDevice,
  threshhold,
  setPcrOption,
  pcr,
  setDuration,
  comparison,
  kpi,
  emmision,
  passwordGroup,
  onChange,
  value,
  placeholder,
  style,
  report,
  inventoryD,
  compareP,
  valueKey = 'value',
  currency,
  disable,
  // setSelectedCurrency,
}) => {
  const theme = useTheme();

  const handleChange = (value) => {
    if (throughPut == 'true') {
      setThrouputOption(value);
    } else if (topDevices == 'true') {
      setTopDevicesOption(value);
    } else if (comparison == 'true') {
      setDuration(value);
    } else if (kpi == 'true') {
      setKpiOption(value);
    } else if (emmision == 'true') {
      setPiOption(value);
    } else if (threshhold == 'true') {
      setThreshholdOption(value);
    } else if (pueDash == 'true') {
      setPueOption(value);
    } else if (pue == 'true') {
      onChangePue(value);
    } else if (pueDevice == 'true') {
      setPueOption2(value);
    } else if (deviceCarbonEmission == 'true') {
      setDeviceCarbonEmiisionOption(value);
    } else if (pcr == 'true') {
      setPcrOption(value);
    } else if (currency == 'true') {
      onCurrencyChange(value);
    } else if (updatedDash && handleDurationChange) {
      handleDurationChange(value); // ✅ call the correct function
    }
  };

  // const StyledSelect = styled(Select)`
  //   margin-top: ${currency ? '-18px' : '0px'};
  //   width: ${report || passwordGroup || pueMode
  //     ? '100%'
  //     : inventoryD
  //       ? '100px'
  //       : compareP
  //         ? '100%'
  //         : currency
  //           ? '100px'
  //           : '150px'} !important;

  //   .ant-select-selector {
  //     border-radius: ${inventoryD ? '0px' : '5px'} !important;
  //     height: ${report || passwordGroup || comparison
  //       ? '42px'
  //       : pueMode
  //         ? '54px'
  //         : currency
  //           ? '56px'
  //           : 'unset'} !important;
  //     color: ${theme?.palette?.default_select?.color} !important;
  //     border: ${inventoryD || currency
  //       ? 'none'
  //       : `1px solid ${theme?.palette?.default_card?.border}`} !important;
  //     background: ${theme?.palette?.default_select?.background}!important;
  //   }

  //   .ant-select-arrow {
  //     color: ${theme?.palette?.default_select?.place_holder} !important;
  //     margin-top: ${report || comparison
  //       ? '1px'
  //       : pue
  //         ? '-4px'
  //         : pueMode || currency
  //           ? '4px'
  //           : ''} !important;
  //   }
  //   .ant-select-item-option-content {
  //     background: red !important;
  //   }
  //   .ant-select-selection-placeholder {
  //     color: ${theme?.palette?.default_select?.place_holder} !important;
  //     font-size: 14px;
  //   }
  //   . ant-select-selection-item {
  //     color: ${({ theme }) =>
  //       theme?.palette?.default_select?.place_holder} !important;
  //   }
  //   &.ant-select-open {
  //     .ant-select-selection-item {
  //       color: ${({ theme }) =>
  //         theme?.palette?.default_select?.place_holder} !important;
  //       opacity: 0.4 !important;
  //     }
  //   }

  //   .ant-select-dropdown {
  //     background-color: ${theme?.palette?.default_select
  //       ?.background} !important;
  //     color: white !important;
  //   }
  // `;

  const StyledSelect = styled(Select)`
    margin-top: ${({ currency }) => (currency ? '-8px' : '0px')}!important;
    width: ${report || passwordGroup || pueMode || pue
      ? '100%'
      : inventoryD
        ? '100px'
        : compareP
          ? '100%'
          : '150px'} !important;

    .ant-select-selector {
      border-radius: ${inventoryD ? '0px' : '5px'} !important;
      height: ${report || passwordGroup || comparison
        ? '42px'
        : pue
          ? '32px'
          : pueMode
            ? currency
              ? '38px'
              : '40px'
            : 'unset'} !important;
      color: ${theme?.palette?.default_select?.color} !important;
      border: ${inventoryD || currency
        ? 'none'
        : `1px solid ${theme?.palette?.default_card?.border}`} !important;
      background: ${theme?.palette?.default_select?.background} !important;
      ${currency &&
      `
      box-shadow: none !important;
    `}
    }

    ${currency &&
    `
    &.ant-select-focused .ant-select-selector {
      box-shadow: none !important;
    }
  `}

    .ant-select-arrow {
      color: ${theme?.palette?.default_select?.place_holder} !important;
      margin-top: ${report || comparison
        ? '1px'
        : pue
          ? '-4px'
          : pueMode || currency
            ? '0px'
            : ''} !important;
    }

    .ant-select-item-option-content {
      background: red !important;
    }

    .ant-select-selection-placeholder {
      color: ${theme?.palette?.default_select?.place_holder} !important;
      font-size: 14px;
    }

    .ant-select-selection-item {
      color: ${({ theme }) =>
        theme?.palette?.default_select?.place_holder} !important;
    }

    &.ant-select-open {
      .ant-select-selection-item {
        color: ${({ theme }) =>
          theme?.palette?.default_select?.place_holder} !important;
        opacity: 0.4 !important;
      }
    }

    .ant-select-dropdown {
      background-color: ${theme?.palette?.default_select
        ?.background} !important;
      color: white !important;
    }
  `;
  return (
    <StyledSelect
      passwordGroup={passwordGroup}
      defaultValue={value}
      placeholder={placeholder}
      onChange={onChange ? onChange : handleChange}
      style={{ ...style }}
      size={passwordGroup == 'true' ? 'large' : ''}
      dropdownStyle={{
        backgroundColor: theme?.palette?.default_select?.dropDown,
        color: 'white',
      }}
    >
      {options.map((option) =>
        option.children ? (
          <OptGroup key={option.value} label={option.label}>
            {option.children.map((child) => (
              <Select.Option
                style={{ color: theme?.palette?.default_select?.color }}
                key={child.value}
                value={child.value}
              >
                {child.label}
              </Select.Option>
            ))}
          </OptGroup>
        ) : (
          <Select.Option
            style={{
              color: theme?.palette?.default_select?.color,
              backgroundColor:
                value === option[valueKey]
                  ? theme?.palette?.default_option?.selected_background
                  : null,
            }}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Select.Option>
        )
      )}
    </StyledSelect>
  );
};

export default KpiSelector;

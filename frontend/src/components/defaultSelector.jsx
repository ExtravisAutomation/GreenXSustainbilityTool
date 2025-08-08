// import styled from 'styled-components';
// import { Select, Spin } from 'antd';
// import { useTheme } from '@mui/material/styles';

// const { Option } = Select;

// // Updated CustomSelect styled component
// const CustomSelect = styled(Select)`
//   width: ${({ addDevice, report, raks, table, width }) =>
//     addDevice
//       ? 'calc(100% - 40px)'
//       : report || raks || table
//         ? '100%'
//         : width
//           ? width
//           : '130px'} !important;

//   margin: ${({ margin }) => (margin ? margin : '')} !important;
//   .ant-select-selector {
//     background: ${({ theme }) =>
//       theme?.palette?.default_select?.background} !important;
//     color: ${({ theme }) => theme?.palette?.default_select?.color} !important;
//     border-color: ${({ theme }) =>
//       theme?.palette?.default_card?.border} !important;
//     font-size: 12px !important;
//     // width: 100% !important;
//     border-radius: ${({ addDevice, table }) =>
//       table ? '0px' : addDevice ? '5px 0px 0px 5px' : '5px'} !important;
//     height: ${({ report, raks, addDevice, cPanel }) =>
//       report || raks || addDevice
//         ? '42px'
//         : cPanel
//           ? '40px'
//           : '32px'} !important;

//     input[type='search'].ant-select-selection-search-input {
//       &::placeholder {
//         color: green !important;
//       }
//     }
//   }

//   .ant-select-selection-placeholder {
//     color: ${({ theme }) =>
//       theme?.palette?.default_select?.place_holder} !important;
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

//   .ant-select-arrow {
//     color: ${({ theme }) =>
//       theme?.palette?.default_select?.place_holder} !important;
//     margin-top: ${({ report, raks, addDevice }) =>
//       report || raks || addDevice ? '1px' : ''} !important;
//   }

//   .ant-select-dropdown {
//     background-color: ${({ theme }) =>
//       theme?.palette?.default_select?.background} !important;
//     color: white !important;
//   }
//   .ant-select-item {
//     background-color: ${({ theme }) =>
//       theme?.palette?.default_select?.background} !important;
//     color: white !important;
//   }
//   .ant-select-item-option {
//     background-color: ${({ theme }) =>
//       theme?.palette?.default_select?.background} !important;
//     color: white !important;
//   }
//   .ant-select-item-option-selected {
//     background-color: ${({ theme }) =>
//       theme?.palette?.default_select?.background} !important;
//     color: red !important;
//   }
// `;

// const CustomLabel = styled.label`
//   color: ${({ theme }) => theme?.palette?.main_layout?.primary_text} !important;
// `;
// const LabelWrapper = styled.div`
//   margin-bottom: 7px !important;
//   font-family: Inter;
// `;

// // DefaultSelector component
// const DefaultSelector = ({
//   options,
//   placeholder,
//   loading,
//   onChange,
//   label = '',
//   value,
//   defaultValue,
//   labelKey = 'label',
//   valueKey = 'value',
//   report,
//   raks,
//   addDevice,
//   table,
//   disabled,
//   // width,
//   onClear = () => {},
//   loader = false,
//   allowClear = true,
//   margin,
//   width = '',
//   mode = undefined,
//   cPanel,
// }) => {
//   const theme = useTheme();

//   const customSelectProps = {
//     ...(value !== undefined && { value }),
//     // defaultValue,
//     defaultActiveFirstOption: true,
//   };

//   return (
//     <Spin spinning={loader} size="small">
//       {label ? (
//         <LabelWrapper style={{ marginBottom: '5px' }}>
//           <CustomLabel theme={theme}>{label}</CustomLabel>
//         </LabelWrapper>
//       ) : null}

//       <CustomSelect
//         allowClear={allowClear}
//         theme={theme}
//         showSearch
//         placeholder={placeholder ? placeholder : 'Search to Select'}
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           (option.children ?? '').toLowerCase().includes(input.toLowerCase())
//         }
//         filterSort={(optionA, optionB) =>
//           (optionA.children ?? '')
//             .toLowerCase()
//             .localeCompare((optionB.children ?? '').toLowerCase())
//         }
//         loading={loading}
//         onChange={onChange}
//         // value={value}
//         dropdownStyle={{
//           backgroundColor: theme?.palette?.default_select?.dropDown,
//           color: 'white',
//         }}
//         disabled={disabled}
//         addDevice={addDevice}
//         report={report}
//         mode={mode}
//         raks={raks}
//         cPanel={cPanel}
//         table={table}
//         width={width}
//         onClear={onClear}
//         margin={margin}
//         {...customSelectProps}
//       >
//         {options?.map((option) => (
//           <Option
//             key={option[valueKey]}
//             value={option[valueKey]}
//             style={{
//               color: theme?.palette?.default_select?.color,
//               backgroundColor:
//                 value === option[valueKey]
//                   ? theme?.palette?.default_option?.selected_background
//                   : null,
//             }}
//           >
//             {option[labelKey]}
//           </Option>
//         ))}
//       </CustomSelect>
//     </Spin>
//   );
// };

// export default DefaultSelector;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Select, Spin } from 'antd';
import { useTheme } from '@mui/material/styles';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

const { Option } = Select;

// Styled Custom Select
const CustomSelect = styled(Select)`
  width: ${({ addDevice, report, raks, table, width }) =>
    addDevice
      ? 'calc(100% - 40px)'
      : report || raks || table
        ? '100%'
        : width
          ? width
          : '130px'} !important;

  margin: ${({ margin }) => (margin ? margin : '')} !important;

  .ant-select-selector {
    background: ${({ theme }) =>
      theme?.palette?.default_select?.background} !important;
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
    border-color: ${({ theme }) =>
      theme?.palette?.default_card?.border} !important;
    font-size: 12px !important;
    border-radius: ${({ addDevice, table }) =>
      table ? '0px' : addDevice ? '5px 0px 0px 5px' : '5px'} !important;
    height: ${({ report, raks, addDevice, cPanel, height }) =>
      report || raks || addDevice
        ? '42px'
        : cPanel
          ? '40px'
          : height
            ? height
            : '32px'} !important;
  }

  .ant-select-selection-placeholder {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
    font-size: 14px;
  }

  .ant-select-selection-item {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
  }

  &.ant-select-open {
    .ant-select-selection-item {
      color: ${({ theme }) =>
        theme?.palette?.default_select?.primary_text} !important;
      opacity: 0.4 !important;
    }
  }

  .ant-select-arrow {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.place_holder} !important;
    margin-top: ${({ report, raks, addDevice, height }) =>
      report || raks || addDevice ? '1px' : height ? '0px' : ''} !important;
  }

  .ant-select-dropdown {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background} !important;
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
  }

  .ant-select-item,
  .ant-select-item-option {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background} !important;
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
  }

  .ant-select-item-option-selected {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background} !important;
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text} !important;
  }
`;

// Label styles
const CustomLabel = styled.label`
  color: ${({ theme }) => theme?.palette?.main_layout?.primary_text} !important;
`;

const LabelWrapper = styled.div`
  margin-bottom: 7px !important;
  font-family: Inter;
`;

// DefaultSelector component
const DefaultSelector = ({
  options,
  placeholder,
  loading,
  onChange,
  label = '',
  value,
  defaultValue,
  labelKey = 'label',
  valueKey = 'value',
  report,
  raks,
  addDevice,
  table,
  disabled,
  onClear = () => {},
  loader = false,
  allowClear = true,
  margin,
  width = '',
  height = '',
  mode = undefined,
  cPanel,
  showSearch = true,
  dropdownRender,
}) => {
  const theme = useTheme();
  const [lastClicked, setLastClicked] = useState(null); // Track last clicked
  const [open, setOpen] = useState(false);
  const customSelectProps = {
    ...(value !== undefined && { value }),
    defaultActiveFirstOption: true,
  };

  return (
    <Spin spinning={loader} size="small">
      {label && (
        <LabelWrapper>
          <CustomLabel theme={theme}>{label}</CustomLabel>
        </LabelWrapper>
      )}
      {/* 
      <CustomSelect
        allowClear={allowClear}
        theme={theme}
        showSearch={showSearch}
        placeholder={placeholder || 'Search to Select'}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option.children ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA.children ?? '')
            .toLowerCase()
            .localeCompare((optionB.children ?? '').toLowerCase())
        }
        loading={loading}
        onChange={onChange}
        dropdownStyle={{
          backgroundColor: theme?.palette?.default_select?.dropDown,
          color: 'white',
        }}
        disabled={disabled}
        addDevice={addDevice}
        report={report}
        mode={mode}
        raks={raks}
        cPanel={cPanel}
        table={table}
        width={width}
        onClear={onClear}
        margin={margin}
        onDropdownVisibleChange={(open) => {
          if (!open) setLastClicked(null); // Reset on close
        }}
        {...customSelectProps}
      >
        {options?.map((option) => {
          const isSelected =
            Array.isArray(value) && value.includes(option[valueKey]);
          const isLastClicked = lastClicked === option[valueKey];

          return (
            <Option
              key={option[valueKey]}
              value={option[valueKey]}
              onClick={() => setLastClicked(option[valueKey])}
              style={{
                color: theme?.palette?.default_select?.color,
                backgroundColor: isSelected
                  ? isLastClicked
                    ? '#2f80ed' // Your custom clicked background
                    : theme?.palette?.default_option?.selected_background
                  : 'transparent',
              }}
            >
              {option[labelKey]}
            </Option>
          );
        })}
      </CustomSelect> */}
      <CustomSelect
        allowClear={allowClear}
        theme={theme}
        showSearch={showSearch}
        placeholder={placeholder || 'Search to Select'}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option.children ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA.children ?? '')
            .toLowerCase()
            .localeCompare((optionB.children ?? '').toLowerCase())
        }
        loading={loading}
        onChange={onChange}
        dropdownStyle={{
          backgroundColor: theme?.palette?.default_select?.dropDown,
          color: 'white',
        }}
        disabled={disabled}
        addDevice={addDevice}
        report={report}
        mode={mode}
        raks={raks}
        cPanel={cPanel}
        table={table}
        width={width}
        height={height}
        onClear={onClear}
        margin={margin}
        open={open}
        onDropdownVisibleChange={(visible) => setOpen(visible)}
        dropdownRender={
          cPanel ? (menu) => dropdownRender?.(menu, setOpen) : undefined
        }
        // onDropdownVisibleChange={(open) => {
        //   if (!open) setLastClicked(null);
        // }}
        // dropdownRender={cPanel ? dropdownRender : undefined}
        {...customSelectProps}
      >
        {!cPanel &&
          options?.map((option) => (
            <Option
              key={option[valueKey]}
              value={option[valueKey]}
              style={{
                color: theme?.palette?.default_select?.primary_text,
                backgroundColor:
                  value === option[valueKey]
                    ? theme?.palette?.default_option?.selected_background
                    : 'transparent',
              }}
            >
              {option[labelKey]}
            </Option>
          ))}
      </CustomSelect>
    </Spin>
  );
};

export default DefaultSelector;

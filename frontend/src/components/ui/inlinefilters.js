import React, { useState } from 'react';
import DefaultSelector from '../defaultSelector';
import DefaultInput from '../inputs';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Modal, Form, Button, theme, Tooltip } from 'antd';
import { useTheme } from '@mui/material';
import CustomModal from '../customModal';
import DefaultButton from '../buttons';
import CustomDatePicker from '../customDatePicker';

const InlineFilters = ({
  styles,
  fetchData = () => {},
  filtersConfig = [],
  handleAdvanceSearch = () => {},
  form,
}) => {
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [isAdvanceFilterActive, setIsAdvanceFilterActive] = useState(false);
  const theme = useTheme();

  const handleAdvanceFilterSearch = (values) => {
    const isActive = Object.values(values).some((value) => Boolean(value));
    setIsAdvanceFilterActive(isActive);
    setShowAdvanceFilter(false);

    handleAdvanceSearch(values);
  };

  const removeFilters = () => {
    form.resetFields();
    handleAdvanceSearch({ page: 1 });
    setIsAdvanceFilterActive(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...styles }}>
      <Form form={form} layout="inline">
        {filtersConfig?.inlineFilters.map((filter, index) => (
          <Form.Item
            key={index}
            name={filter.name}
            style={{ margin: '0 10px' }}
          >
            {filter.type === 'input' ? (
              <DefaultInput
                onChange={(e) => filter.onChange(e.target.value)}
                value={filter.value}
                placeholder={filter.placeholder}
                parent="filter"
                // style={{
                //   color: `${theme?.palette?.main_layout?.primary_text}`,
                // }}
                // style={{ ...filter.filterstyle }}
              />
            ) : (
              <DefaultSelector
                options={filter.options}
                onChange={(value) => filter.onChange(value)}
                value={filter.value}
                placeholder={filter.placeholder}
                width="200px"
                style={{ ...filter.filterstyle }}
              />
            )}
          </Form.Item>
        ))}
      </Form>
      <Tooltip
        title="Advanced Filters"
        color={`${theme?.palette?.main_layout?.secondary_text}`}
      >
        <Button
          onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
          style={{
            padding: '2px 4px',
            backgroundColor: theme?.palette?.main_layout?.secondary_text,
            border: '1px solid gray',
            // color: 'white',
          }}
        >
          <KeyboardDoubleArrowRightOutlinedIcon sx={{ color: 'white' }} />
        </Button>
      </Tooltip>
      {isAdvanceFilterActive && (
        <Button
          onClick={removeFilters}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: '1px solid gray',
          }}
        >
          <CloseOutlinedIcon sx={{ color: 'gray' }} />
        </Button>
      )}
      <AdvanceFilterModal
        form={form}
        visible={showAdvanceFilter}
        onClose={() => setShowAdvanceFilter(false)}
        filtersConfig={filtersConfig.advanceFilters || []}
        handleFinish={handleAdvanceFilterSearch}
      />
    </div>
  );
};

export default InlineFilters;

export const AdvanceFilterModal = ({
  form,
  visible,
  onClose,
  filtersConfig,
  handleFinish = () => {},
  onChange,
}) => {
  const theme = useTheme();
  console.log('advanced Filters::', filtersConfig);

  return (
    <CustomModal
      open={visible}
      title="Advanced Filters"
      handleClose={onClose}
      footer={null}
      // style={{
      //   minWidth: '1000px',
      //   backgroundColor: theme?.palette?.default_card?.background,
      //   border: `1px solid ${theme?.palette?.default_card?.border} !important`,
      // }}
    >
      <div>
        <Form
          form={form}
          layout="inline"
          onFinish={(values) => handleFinish(values)}
          onChange={onChange}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {filtersConfig.map((filter, index) => (
            <Form.Item
              key={index}
              name={filter.name}
              style={{ width: 'calc(25% - 20px)', margin: '5px' }}
            >
              {filter.type === 'input' ? (
                // <DefaultInput
                //   key={index}
                //   placeholder={filter.placeholder}
                //   {...filter}
                // />
                <DefaultInput
                  key={index}
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                  {...filter}
                />
              ) : filter?.type === 'date' ? (
                <CustomDatePicker />
              ) : (
                <DefaultSelector
                  key={index}
                  placeholder={filter.placeholder}
                  style={{ width: '100%', ...filter.filterstyle }}
                  width="100%"
                  {...filter}
                />
              )}
            </Form.Item>
          ))}
          <div
            style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}
          >
            <Button
              onClick={onClose}
              style={{
                backgroundColor: '#a3050d',
                borderColor: '#a3050d',
                color: '#e5e5e5',
                borderRadius: '5px',
                marginRight: '20px',
              }}
              type="primary"
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor:
                  theme?.palette?.drop_down_button?.add_background,
                color: theme?.palette?.drop_down_button?.add_text,

                borderRadius: '5px',
              }}
              type="submit"
              htmlType="submit"
            >
              Apply Filter
            </Button>
          </div>
        </Form>
      </div>
    </CustomModal>
  );
};

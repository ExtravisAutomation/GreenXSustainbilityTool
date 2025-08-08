import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultSelector from '../defaultSelector';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevicesData } from '../../store/features/dashboardModule/actions/devicesAction';
import { Spin } from 'antd';
import CustomSpin from '../CustomSpin';

const kpiOptions = [
  {
    value: '24 hours',
    label: '24 hours',
  },
  {
    value: '7 Days',
    label: '7 Days',
  },

  {
    value: 'Last Month',
    label: 'Last Month',
  },
  {
    value: 'Current Month',
    label: 'Current Month',
  },
  { value: 'First Quarter', label: 'First Quarter' },
  { value: 'Second Quarter', label: 'Second Quarter' },
  { value: 'Third Quarter', label: 'Third Quarter' },
  {
    value: 'Last 3 Months',
    label: 'Last 3 Months',
  },
  {
    value: 'Last 6 Months',
    label: 'Last 6 Months',
  },
  {
    value: 'Last 9 Months',
    label: 'Last 9 Months',
  },
  {
    value: 'Last Year',
    label: 'Last Year',
  },
  {
    value: 'Current Year',
    label: 'Current Year',
  },
];

const GraphWrapper = ({
  loading = false,
  withKpi = false,
  withDeviceFilter = false,
  onDeviceChange = () => {},
  onKpiChange = () => {},
  children,
  title = 'Title',
  siteID = null,
  allowClear = false,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices?.data?.data);
  const [value, setValue] = useState();

  useEffect(() => {
    if (siteID) {
      const access_token = localStorage.getItem('access_token');
      dispatch(fetchDevicesData(siteID, access_token));
    }
  }, [siteID]);
  useEffect(() => {
    if (devices) {
      setValue(devices[0].device_name);
    }
  }, [devices]);

  const ocChange = (value) => {
    setValue(value);
    onDeviceChange(value);
  };

  const updatedDevice = devices?.map((item) => {
    return {
      label: item?.device_name,
      value: item?.id,
    };
  });

  return (
    <>
      <CustomSpin spinning={loading}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.graph?.title,
              marginBottom: '0px',
              marginTop: '0px',
              fontFamily: 'inter',
            }}
          >
            {title}
          </p>
          {withKpi && (
            <DefaultSelector
              options={kpiOptions}
              onChange={onKpiChange}
              // value={threshholdDeviceName}
            />
          )}
          {withDeviceFilter && (
            <DefaultSelector
              options={updatedDevice}
              onChange={ocChange}
              allowClear={allowClear}
              value={value}
              // value={threshholdDeviceName}
            />
          )}
        </div>
        <div>{children}</div>
      </CustomSpin>
    </>
  );
};

export default GraphWrapper;

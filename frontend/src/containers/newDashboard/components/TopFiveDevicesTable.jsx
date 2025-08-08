import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import CustomCard from '../../../components/customCard';
import DefaultTable from '../../../components/tables';

import styled from 'styled-components';
import CustomSpin from '../../../components/CustomSpin';

const TopFiveDevicesTable = ({
  kpiOptions,
  siteId = null,
  spinnerLoading,
  isPue = false,
  columns,
  dataSource,
  title,
  variant,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const modifiedColumns = columns.map((col) => {
    if (typeof col.render === 'function') {
      return {
        ...col,
        render: (text, record, index) =>
          col.render(text, record, index, variant),
      };
    }
    return col;
  });

  return (
    <CustomSpin spinning={spinnerLoading}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <p
          style={{
            fontSize: '16px',
            color: theme?.palette?.main_layout?.primary_text,
            marginBottom: '0px',
            marginTop: '0px',
            fontFamily: 'inter',
          }}
        >
          {title}
        </p>
      </div>
      {dataSource?.length > 0 ? (
        <DefaultTable
          rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
          size="small"
          columns={modifiedColumns}
          dataSource={dataSource || ''}
          rowKey="id"
          style={{ whiteSpace: 'pre' }}
          pagination={false}
          scroll={{
            x: 600,
          }}
        />
      ) : (
        <div
          style={{
            height: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: theme?.palette?.main_layout?.primary_text,
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            No Data
          </p>
        </div>
      )}
      {/* </CustomCard> */}
    </CustomSpin>
  );
};

export default TopFiveDevicesTable;

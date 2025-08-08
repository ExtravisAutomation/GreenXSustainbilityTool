import React from 'react';
import BackButton from '../../backButton';
import DefaultCard from '../../cards';
import { CustomInput } from '../../customInput';
import ExportButton from '../../exportButton';
import { Spin } from 'antd';
import DefaultTable from '../../tables';
import { useTheme } from '@mui/material/styles';

const TableWithResults = ({
  filteredData,
  data,
  width,
  handleSearch,
  kpiData,
  id,
  columns,
  columns3,
  isLoading,
}) => {
  const theme = useTheme();
  return (
    <>
      <BackButton
        style={{ marginLeft: '20px', marginTop: '12px', marginBottom: '10px' }}
      ></BackButton>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.main_layout?.primary_text,
          padding: '3px 10px',
          marginTop: '10px',
          width: '96%',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            color: theme?.palette?.main_layout?.primary_text,
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Details
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>Resultes</span>
          <span
            style={{
              width: '27px',
              height: '27px',
              borderRadius: '100%',
              background: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.drop_down_button?.add_text,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
            }}
          >
            {filteredData.length > 0
              ? filteredData.length
              : data
                ? data?.length
                : ''}
          </span>
        </div>
      </div>

      <DefaultCard
        sx={{
          width: `${width - 105}px`,
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: theme?.palette?.main_layout?.background,
            padding: '1px 10px 10px 10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <CustomInput
              nested="true"
              style={{
                width: '300px',
              }}
              placeholder="Search..."
              onChange={handleSearch}
            />
            <ExportButton
              dataSource={kpiData}
              columns={id === '4' ? columns3 : columns}
              name="report"
            />
          </div>

          <Spin spinning={isLoading}>
            <DefaultTable
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'even' : 'odd'
              }
              size="small"
              scroll={{ x: 1200 }}
              columns={
                id == '1' || id == '2' || id == '3' || id == '5'
                  ? columns
                  : id === '4'
                    ? columns3
                    : null
              }
              dataSource={filteredData?.length > 0 ? filteredData : data}
              rowKey="name"
              style={{ whiteSpace: 'pre' }}
              pagination={{
                defaultPageSize: 10,
                pageSizeOptions: [10, 50, data?.length],
              }}
            />
          </Spin>
        </div>
      </DefaultCard>
    </>
  );
};

export default TableWithResults;

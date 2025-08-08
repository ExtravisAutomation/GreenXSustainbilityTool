import React from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx';
import { ExportOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';

const ExportButton = ({
  dataSource,
  columns,
  name,
  style,
  children,
  onClick = null,
}) => {
  const theme = useTheme();

  const exportToExcel = () => {
    const filteredData = dataSource?.map((record) => {
      const filteredRecord = {};
      columns.forEach((column) => {
        if (column.title !== 'Actions') {
          filteredRecord[column.title] = record[column.dataIndex];
        }
      });
      return filteredRecord;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Set column widths
    const wscols = columns?.map((column, index) => ({
      wch: column.width || 48,
    }));
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `${name}.xlsx`);
  };

  return (
    <Button
      style={{
        // backgroundColor: theme?.palette?.drop_down_button?.add_background,
        background: '#141B26',
        color: theme?.palette?.drop_down_button?.add_text,
        border: 'none',
        // color: "white",
        // background: "#141B26",
        borderRadius: '4px',
        border: '1px solid #7A8CA6',
        // width: "110px",
        height: '38px',
        fontSize: '14px',
        ...style,
      }}
      onClick={onClick ? onClick : exportToExcel}
    >
      <ExportOutlined style={{ fontSize: '12px' }} />
      Export
    </Button>
  );
};

export default ExportButton;

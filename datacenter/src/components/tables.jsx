import React from "react";
import { Table } from "antd";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import DefaultScrollbar from "./scrollbar";

const DefaultStyledAntDesignTable = styled(Table)`
  .ant-table-container {
    thead.ant-table-thead {
      tr {
        th.ant-table-cell {
          .ant-checkbox-inner {
            ${({ theme }) => theme?.palette?.default_table?.check_box_border};
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_inner};
          }
          border-radius: 0 !important;
          background-color: ${({ theme }) =>
            theme?.palette?.default_table?.header_row};
          font-size: 14px;
          margin: 0 !important;
          padding: 0 !important;
          padding: 5px 10px 10px 10px !important;
          font-family: ${({ theme }) =>
            theme?.palette?.default_table?.fontFamily};
          font-weight: 600;
          color: ${({ theme }) => theme?.palette?.default_table?.header_text};
          border: none;
        }
      }
    }

    tbody.ant-table-tbody {
      tr.ant-table-row:hover > td {
        background: ${({ theme }) =>
          theme?.palette?.default_table?.hovered_row};
        color: ${({ theme }) =>
          theme?.palette?.default_table?.hovered_text} !important;
      }

      tr.ant-table-row-selected > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.selected_row} !important;
        color: ${({ theme }) =>
          theme?.palette?.default_table?.selected_text} !important;
      }

      tr {
        td.ant-table-cell {
          .ant-checkbox-wrapper {
            margin-right: 6px;
          }
          .ant-checkbox-inner {
            border-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_border};
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_inner};
          }

          font-size: 12px !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-left: 10px !important;
          height: ${(p) => p.cellHeight || "33px"} !important;
          color: ${({ theme }) => theme?.palette?.default_table?.primary_text};
          border: none;
        }
      }

      tr.odd > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.odd_row};
      }

      tr.even > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.even_row};
      }
    }
  }

  .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    transition: none;
  }

  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }

  .ant-pagination-item,
  .ant-pagination-item-active a {
    border-radius: 20px;
    background-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_background};
    border: none;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    background-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_background};
  }

  .ant-select-arrow {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }
`;

export default function DefaultTable(props) {
  const theme = useTheme();
  return (
    <DefaultScrollbar>
      <DefaultStyledAntDesignTable theme={theme} {...props} />
    </DefaultScrollbar>
  );
}

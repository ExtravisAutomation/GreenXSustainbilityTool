import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Spin, Upload } from "antd";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const { Dragger } = Upload;

const StyledDragger = styled(Dragger)`
  border-radius: 0 !important;
  .ant-upload {
    border-radius: 0;
  }
  .ant-upload-list-item {
    .ant-upload-list-item-name {
      color: ${({ theme }) =>
        theme.palette.main_layout?.primary_text} !important;
    }
    .ant-upload-list-item-card-actions {
      .anticon-delete {
        color: ${({ theme }) =>
          theme.palette.main_layout?.primary_text} !important;
      }
    }
  }
`;

const UploadFile = ({ setUploadedFile, loading, fileRef }) => {
  const theme = useTheme();

  const props = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",
    beforeUpload(file) {
      // fileRef.current = file;
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // setUploadedFile(info.file);
        fileRef.current = info.file;
      }
      if (status === "done" || status === "error") {
        message.success(`${info.file.name} file selected successfully.`);
        // setUploadedFile(info.file);
        fileRef.current = info.file;
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Spin spinning={loading}>
      <StyledDragger {...props} theme={theme}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p style={{ color: "gray" }} className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p style={{ color: "gray" }} className="ant-upload-hint">
          Support for a single file upload. Strictly prohibited from uploading
          company data or other banned files.
        </p>
      </StyledDragger>
    </Spin>
  );
};

export default UploadFile;

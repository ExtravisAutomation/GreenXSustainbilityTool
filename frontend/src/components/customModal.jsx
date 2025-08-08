import React from 'react';
import { useTheme } from '@mui/material/styles';

import { Modal } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  top: 20px;
  width: ${({
    addDevice,
    buildingModal,
    addPasswordGroup,
    importFile,
    score,
    width,
  }) =>
    addDevice
      ? '60%'
      : buildingModal
        ? '400px'
        : addPasswordGroup || importFile
          ? '35%'
          : score // Mycode: Score Modal Width
            ? '60%'
            : width
              ? width
              : '55%'} !important;
  .ant-modal-header {
    background: ${({ theme }) =>
      theme?.name.includes('Purple')
        ? 'linear-gradient(to right, #791b9c, #5454be)'
        : theme?.palette?.drop_down_button?.add_background} !important;
    padding: 13px 10px 1px 20px;
    margin-bottom: ${({ importFile }) => (importFile ? '5px' : '20px')};
  }

  .ant-modal-title {
    color: #e5e5e5;
    margin-top: 5px !important;
    font-size: 14px !important;
  }
  .ant-modal-content {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background} !important;
    border-radius: 10px !important;
    border: 1px solid ${({ theme }) => theme?.palette?.default_card?.border} !important;
  }
`;

const CustomModal = React.memo(
  ({
    open,
    handleClose,
    importFile,
    footer,
    title,
    children,
    width,
    ...rest
  }) => {
    const theme = useTheme();

    return (
      <StyledModal
        open={open}
        title={<h3 style={{ color: 'white', marginTop: '0px' }}>{title}</h3>}
        // onOk={handleOk}
        onCancel={handleClose}
        closeIcon={false}
        footer={importFile ? footer : false}
        width={width}
        theme={theme}
        {...rest}
      >
        {children}
      </StyledModal>
    );
  }
);

export default CustomModal;

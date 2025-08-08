import React, { useEffect, useState } from 'react';
import CustomForm from '../../../components/customForm';
import CustomFormRacks from './form';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { baseUrl } from '../../../utils/axios';
import { BaseUrl } from '../../../utils/axios';
import { createRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Modal } from 'antd';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';

import dayjs from 'dayjs';
import { useShowAlert } from '../../../components/ui/showAlert';
const access_token = localStorage.getItem('access_token');
// console.log(access_token, "access toke");
const CustomModalRacks = ({ handleClose, open, recordToEdit, fetchRacks }) => {
  const theme = useTheme();
  const isDarkMode = theme?.mode === 'dark';
  const openPopup = useShowAlert();
  const dispatch = useDispatch();
  const StyledModal = styled(Modal)`
    width: 70% !important;
    color: white;
    top: 20px;
    .ant-modal {
      border-radius: 10px !important;
    }

    .ant-modal-header {
      background-color: transparent !important;
    }

    .ant-modal-content {
      background-color: ${theme?.palette?.default_card?.background} !important;
      border-radius: 10px !important;
      border: 1px solid ${theme?.palette?.default_card?.border} !important;
    }

    .tour_modal .ant-modal-content {
      background-color: ${theme?.palette?.default_card?.background} !important;
      backdrop-filter: blur(10.4px) !important;
      -webkit-backdrop-filter: blur(10.4px) !important;
    }

    .pdf_file_modal .ant-modal-content {
      background-color: white !important;
      padding: 50px !important;
    }
  `;

  const CustomCloseIcon = styled.span`
    color: red;
    font-size: 25px;
  `;
  // const handleOk = (values) => {
  //   try {
  //     dispatch(createRackAsync({ values }));
  //     handleCancel();
  //     setTimeout(() => {
  //       fetchRacks();
  //       Swal.fire({
  //         title: 'Rack added successfully',
  //         icon: 'success',
  //         confirmButtonText: 'OK',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         onClose: () => {
  //           console.log('Popup closed');
  //         },

  //         // add Rack
  //         customClass: {
  //           container:
  //             theme?.mode == 'light'
  //               ? 'custom-swal-container'
  //               : 'custom-swal-container-dark',
  //           title: 'custom-swal-title',
  //           confirmButton: theme?.name?.includes('Purple')
  //             ? 'custom-swal-button-purple'
  //             : theme?.name?.includes('Green')
  //               ? 'custom-swal-button-green'
  //               : 'custom-swal-button-blue',
  //         },
  //       });
  //       // openPopup({
  //       //   title: 'Rack added successfully done',
  //       //   icon: 'success',

  //       //   onClose: () => {
  //       //     console.log('Popup closed');
  //       //   },
  //       // });
  //     }, 1000);
  //   } catch (error) {
  //     console.error('Error adding rack:', error.message);

  //     Swal.fire({
  //       title: 'Error',
  //       text: 'Failed to add rack',
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //       customClass: {
  //         container: isDarkMode
  //           ? 'custom-swal-container-dark'
  //           : 'custom-swal-container-light',
  //         title: isDarkMode
  //           ? 'custom-swal-title-dark'
  //           : 'custom-swal-title-light',
  //         confirmButton: isDarkMode
  //           ? 'custom-swal-button-dark'
  //           : 'custom-swal-button-light',
  //       },
  //       onClose: () => {
  //         console.log('Popup closed');
  //       },
  //     });
  //   }
  // };
  const handleOk = async (values) => {
    try {
      await dispatch(createRackAsync({ values }));

      handleCancel();

      fetchRacks(); // fetch immediately after rack is added
      Swal.fire({
        title: 'Rack added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container:
            theme?.mode == 'light'
              ? 'custom-swal-container'
              : 'custom-swal-container-dark',
          title: 'custom-swal-title',
          confirmButton: theme?.name?.includes('Purple')
            ? 'custom-swal-button-purple'
            : theme?.name?.includes('Green')
              ? 'custom-swal-button-green'
              : 'custom-swal-button-blue',
        },
        onClose: () => {
          console.log('Popup closed');
        },
      });
    } catch (error) {
      console.error('Error adding rack:', error.message);

      Swal.fire({
        title: 'Error',
        text: 'Failed to add rack',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: isDarkMode
            ? 'custom-swal-container-dark'
            : 'custom-swal-container-light',
          title: isDarkMode
            ? 'custom-swal-title-dark'
            : 'custom-swal-title-light',
          confirmButton: isDarkMode
            ? 'custom-swal-button-dark'
            : 'custom-swal-button-light',
        },
        onClose: () => {
          console.log('Popup closed');
        },
      });
    }
  };

  const handleCancel = (e) => {
    console.log(e);
    handleClose();
  };
  return (
    <StyledModal
      width={'auto'}
      open={open}
      title={
        <h3 style={{ color: 'white' }}>
          {recordToEdit ? 'Update Rack' : 'Add Rack'}
        </h3>
      }
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={
        <CustomCloseIcon>
          <Icon icon="material-symbols:close" />
        </CustomCloseIcon>
      }
      footer={false}
    >
      <CustomFormRacks
        onCancel={handleCancel}
        submit={handleOk}
        recordToEdit={recordToEdit}
        fetchRacks={fetchRacks}
      />
    </StyledModal>
  );
};

export default CustomModalRacks;

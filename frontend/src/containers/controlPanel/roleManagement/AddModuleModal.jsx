import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import styled from 'styled-components';
import { CustomInput } from '../../../components/customInput';
import CustomModal from '../../../components/customModal';

const StyledForm = styled(Form)`
  padding: 10px 20px;
`;

const AddModuleModal = ({
  open,
  handleClose,
  handleModuleSubmit,
  moduleForm,
  theme,
  editModule,
}) => {
  useEffect(() => {
    if (editModule) {
      console.log('Edit Module', editModule);

      moduleForm.setFieldsValue({
        moduleName: editModule?.value,
      });
    }
  }, [editModule, moduleForm]);

  return (
    <CustomModal
      open={open}
      title={editModule ? 'Edit Module' : 'Add Module'}
      onCancel={handleClose}
      footer={null}
    >
      <StyledForm
        layout="vertical"
        form={moduleForm}
        onFinish={(values) => {
          handleModuleSubmit(values);
        }}
      >
        <Form.Item
          label={
            <p style={{ color: 'gray', marginBottom: '0px' }}>Module Name</p>
          }
          name="moduleName"
          rules={[{ required: true, message: 'Please enter a module name' }]}
        >
          <CustomInput
            placeholder="Enter Module Name"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            onClick={() => {
              handleClose();
              moduleForm.resetFields();
            }}
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
              backgroundColor: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.drop_down_button?.add_text,
              borderRadius: '5px',
            }}
            type="primary"
            htmlType="submit"
          >
            {editModule ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </StyledForm>
    </CustomModal>
  );
};

export default AddModuleModal;

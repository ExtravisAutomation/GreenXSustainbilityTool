import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import styled from 'styled-components';
import { CustomInput } from '../../../components/customInput';
import CustomModal from '../../../components/customModal';

const StyledForm = styled(Form)`
  padding: 10px 20px;
`;

const AddRoleModal = ({
  open,
  handleClose,
  handleSubmit,
  roleForm,
  theme,
  editRole,
}) => {
  useEffect(() => {
    if (editRole) {
      roleForm.setFieldsValue({
        roleName: editRole?.value,
      });
    }
  }, [editRole, roleForm]);

  return (
    <CustomModal
      open={open}
      title={editRole ? 'Edit Role' : 'Add Role'}
      onCancel={handleClose}
      footer={null}
    >
      <StyledForm
        layout="vertical"
        form={roleForm}
        onFinish={(values) => {
          handleSubmit(values);
        }}
      >
        <Form.Item
          label={
            <p style={{ color: 'gray', marginBottom: '0px' }}>Role Name</p>
          }
          name="roleName"
          rules={[{ required: true, message: 'Please enter a role name' }]}
        >
          <CustomInput
            placeholder="Enter Role Name"
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
              roleForm.resetFields();
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
            {editRole ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </StyledForm>
    </CustomModal>
  );
};

export default AddRoleModal;

import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'antd';
import styled from 'styled-components';
import { CustomInput } from '../../../components/customInput';
import DefaultSelector from '../../../components/defaultSelector';
import CustomModal from '../../../components/customModal';

const StyledForm = styled(Form)`
  padding: 10px 20px;
`;

const EditUserRoleModal = ({
  open,
  handleClose,
  handleSubmit,
  userForm,
  modules = [],
  roles = [],
  theme,
  editUser,
}) => {
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const formItemsConfig = [
    {
      label: 'Role',
      name: 'role',
      type: 'select',
      rules: [{ required: true, message: 'Please select a role' }],
      props: {
        options: roles,
        placeholder: 'Select Role',
      },
    },
    {
      label: 'Modules',
      name: 'modules',
      type: 'select',
      rules: [{ required: true, message: 'Please select at least one module' }],
      props: {
        options: modules,
        mode: 'multiple',
        placeholder: 'Select Modules',
      },
    },
    {
      label: 'Status',
      name: 'status',
      type: 'select',
      rules: [{ required: true, message: 'Please select status' }],
      props: {
        options: statusOptions,
        placeholder: 'Select Status',
      },
    },
  ];

  const renderComponent = (type, props) => {
    const finalProps = { style: { width: '100%' }, ...props };
    switch (type) {
      case 'input':
        return <CustomInput {...finalProps} />;
      case 'select':
        return (
          <DefaultSelector
            {...finalProps}
            width="100%"
            raks={true}
            mode={props?.mode}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (editUser) {
      userForm.setFieldsValue({
        ...editUser,
        modules: Array.isArray(editUser.modules)
          ? editUser.modules
          : typeof editUser.modules === 'string'
            ? editUser.modules.split(',').map((m) => m.trim())
            : [],
      });
    }
  }, [editUser, userForm]);

  return (
    <CustomModal
      open={open}
      title="Edit User Access"
      onCancel={handleClose}
      footer={null}
    >
      <StyledForm layout="vertical" form={userForm} onFinish={handleSubmit}>
        <Row>
          {formItemsConfig.map((item, index) => (
            <Col xs={24} key={index} style={{ padding: '10px' }}>
              <Form.Item
                label={
                  <p style={{ color: 'gray', marginBottom: '0px' }}>
                    {item.label}
                  </p>
                }
                name={item.name}
                rules={item.rules}
              >
                {renderComponent(item.type, item.props)}
              </Form.Item>
            </Col>
          ))}
        </Row>

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
              userForm.resetFields();
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
            Update
          </Button>
        </Form.Item>
      </StyledForm>
    </CustomModal>
  );
};

export default EditUserRoleModal;

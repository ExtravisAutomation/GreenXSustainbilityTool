import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tooltip, Form } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import AddUserModal from './AddUserModal';
import { useTheme } from '@mui/material';
import AddUserModal from './AddUserModal';
import CustomCard from '../../../components/customCard';
import DefaultTable from '../../../components/tables';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import {
  addUserService,
  fetchAllModules,
  fetchAllRoles,
  fetchAllUsers,
} from '../../../services/controlPanelServices/controlPanelServices';

const StyledWrapper = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const AllUsers = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [userForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [modules, setModules] = useState([]);
  const [addUser, setAddUser] = useState(false);
  // const [password, setPassword] = useState('');

  // Random password generator:

  const handleAddUser = () => {
    setEditUser(null);
    userForm.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditUser(record);
    userForm.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    // const payload = {};
    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...values } : u))
      );
    } else {
      console.log('new User', values);
      try {
        const response = await addUserService(values);
        if (response.status == 200) {
          setAddUser(true);
        }
      } catch (error) {}
    }

    setIsModalOpen(false);
    userForm.resetFields();
    setEditUser(null);
  };

  const handleDelete = (id) => {};

  const fetchData = async () => {
    try {
      const usersResponse = await fetchAllUsers();
      const rolesResponse = await fetchAllRoles();
      const modulesResponse = await fetchAllModules();

      const formattedRoles = rolesResponse?.map((role) => ({
        id: role?.id,
        label: role?.role_name,
        value: role?.role_name,
      }));
      const formattedModules = modulesResponse?.map((modules) => ({
        id: modules?.id,
        label: modules?.modules_name,
        value: modules?.modules_name,
      }));
      const updatedUsers = usersResponse.map((user) => {
        const matchedRole = formattedRoles.find(
          (role) => role.id === user.role_id
        );
        return {
          ...user,
          role: matchedRole ? matchedRole.role_name : 'Unknown',
        };
      });
      setModules(formattedModules);
      setRoleOptions(formattedRoles);
      setUsers(updatedUsers);
    } catch (error) {
      console.log('Error fetching users or roles:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (addUser) fetchData();
  }, [addUser]);

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      onCell: (record) => ({
        onClick: () =>
          navigate(`/main_layout/control-panel/view-user/${record.id}`, {
            state: record,
          }),
        style: {
          cursor: 'pointer',
          color: theme?.palette?.main_layout?.secondary_text,
        },
      }),
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },

    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Access Modules',
      dataIndex: 'modules',
      key: 'modules',
      render: (modules) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {modules?.map((m) => (
            <div
              key={m}
              style={{
                color: theme?.palette?.access_module?.color,
                background: theme?.palette?.access_module?.background,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Tooltip title="Edit">
            <FaRegEdit
              style={{
                fontSize: 17,
                color: theme?.palette?.main_layout?.secondary_text,
              }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBin6Line
              style={{ fontSize: 17, color: '#ff4d4f' }}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  console.log('all Users::', users);

  const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Viewer', value: 'Viewer' },
  ];

  // const modules = [
  //   { label: 'Dashboard', value: 'Dashboard' },
  //   { label: 'Inventory', value: 'Inventory' },
  //   { label: 'AI Engine', value: 'AI Engine' },
  //   { label: 'Report Module', value: 'Report Module' },
  //   { label: 'V center', value: 'V center' },
  //   { label: 'onBoarding Device', value: 'onBoarding Device' },
  // ];

  const handleAddModule = (newModule) => {
    if (!newModule) return;
    const exists = modules.find(
      (m) => m.value.toLowerCase() === newModule.toLowerCase()
    );
    if (!exists) {
      modules.push({ label: newModule, value: newModule });
    }
  };

  return (
    <CustomCard
      style={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
        backgroundColor: theme?.palette?.main_layout?.background,
        borderRadius: '7px',
      }}
    >
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          style={{
            color: theme?.palette?.default_button?.primary_text,
            background: theme?.palette?.default_button?.add_background,
            border: 'none',
          }}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </div>

      {/* <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 5 }}
      /> */}

      <DefaultTable
        rowKey="id"
        // rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
        rowClassName={(record, index) =>
          `custom-row-spacing ${index % 2 === 0 ? 'even' : 'odd'}`
        }
        size="small"
        dataSource={users}
        columns={columns}
        pagination={{
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 50, users?.length],
        }}
      />

      <AddUserModal
        open={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
          setEditUser(null);
          userForm.resetFields();
        }}
        handleSubmit={handleSubmit}
        userForm={userForm}
        modules={modules}
        handleAddModule={handleAddModule}
        roles={roleOptions}
        // password={password}
        theme={theme}
        editUser={editUser}
      />
    </CustomCard>
  );
};

export default AllUsers;

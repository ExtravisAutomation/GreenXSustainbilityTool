import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import CustomCard from '../../../components/customCard';
import BackButton from '../../../components/backButton';
import { useTheme } from '@mui/material';

// Sample user (you can replace this with props or context data)
const user = {
  key: '2',
  id: '2',
  name: 'Michael Chen',
  email: 'michael.chen@company.com',
  role: 'Manager',
  modules: ['Dashboard', 'Analytics'],
  status: 'active',
  lastLogin: '2024-01-14',
};

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ProfileCard = styled(Card)`
  width: 100%;
  max-width: 700px;
  border: none;
  background: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Info = styled.div`
  margin-left: 16px;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
`;

const Email = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme?.palette?.main_layout?.secondary_text};
`;

const ModuleTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const UserStatus = styled.div`
  color: ${(props) =>
    props?.status == 'active' ? props.theme.palette?.status?.color : 'red'};
  background: ${(props) =>
    props?.status == 'active'
      ? props.theme.palette?.status?.background
      : '#f2d7d2'};
  disple: flex;
  width: max-content;
  padding: 2px 8px;
  border-radius: 12px;

  font-size: 12px;
`;

const ViewUser = () => {
  const location = useLocation();
  //   console.log('Clicked User data', location?.state);
  const userData = location?.state;

  const theme = useTheme();
  return (
    <>
      <BackButton
        style={{
          marginLeft: '20px',
          marginTop: '12px',
          marginBottom: '10px',
        }}
      ></BackButton>{' '}
      <ProfileWrapper>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
          }}
        >
          <ProfileCard>
            <Header>
              <Avatar size={64} icon={<UserOutlined />} />
              <Info>
                <Name theme={theme}>{userData?.name}</Name>
                <Email theme={theme}>{userData?.email}</Email>
              </Info>
            </Header>

            <Descriptions
              column={1}
              labelStyle={{
                fontWeight: '600',
                color: theme?.palette?.main_layout?.primary_text,
              }}
              contentStyle={{
                //   fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <Descriptions.Item label={<>Role</>}>
                {userData?.role}
              </Descriptions.Item>
              <Descriptions.Item label={<>Last Login</>}>
                {userData?.lastLogin}
              </Descriptions.Item>
              <Descriptions.Item label={<>Modules</>}>
                <ModuleTags>
                  {userData?.modules.map((mod) => (
                    <div
                      key={mod}
                      style={{
                        color: theme?.palette?.access_module?.color,
                        background: theme?.palette?.access_module?.background,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {mod}
                    </div>
                  ))}
                </ModuleTags>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <UserStatus theme={theme} status={userData?.status}>
                  {userData?.status}
                </UserStatus>
              </Descriptions.Item>
            </Descriptions>
          </ProfileCard>
        </CustomCard>
      </ProfileWrapper>
    </>
  );
};

export default ViewUser;

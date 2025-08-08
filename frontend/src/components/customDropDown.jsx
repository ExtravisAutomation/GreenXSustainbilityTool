import styled from 'styled-components';
import { Dropdown, Button } from 'antd';
import { Menu } from 'antd';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';

const StyledMenu = styled(Menu)`
  width: ${(props) => (props.profile ? '200px' : '')};
  && {
    background: ${(props) =>
      props.theme?.palette?.main_layout?.background} !important;
    color: ${(props) => props.theme?.palette?.default_select?.color} !important;
    border: 1px solid ${(props) => props.theme?.palette?.default_card?.border} !important;
    .ant-dropdown-menu-item {
      background-color: transparent;
      font-weight: 500;
      color: ${(props) => props.theme?.palette?.default_select?.color};
      &:hover {
        color: ${(props) =>
          props.theme?.palette?.main_layout?.secondary_text ||
          '#ffffff'} !important;
        background-color: transparent;
      }
    }
  }
`;
const CustomDropdown = ({
  items,
  style,
  icon,
  button,
  profile,
  dashboard,
  children,
  trigger,
  gradient,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Dropdown
      overlay={<StyledMenu profile={profile} theme={theme} items={items} />}
      trigger={trigger}
      {...rest}
    >
      {button == 'false' ? (
        <div
          style={{
            display: 'flex',
            items: 'center',
            gap: '10px',
          }}
        >
          <p>{children}</p>
          <p>{icon}</p>
        </div>
      ) : (
        <Button
          style={{
            background: `${
              gradient
                ? `${
                    theme?.name.includes('Purple')
                      ? 'linear-gradient(to right, #791b9c, #5454be)'
                      : theme?.palette?.drop_down_button?.add_background
                  }`
                : theme?.palette?.drop_down_button?.add_background
            }`,
            // background: theme?.palette?.drop_down_button?.add_background,
            // color: theme?.palette?.main_layout?.primary_text,
            color: 'white',
            border: 'none',
            height: dashboard ? '32px' : '38px',
            textTransform: 'capitalize',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: '4px',
          }}
        >
          {children}
          {icon}
        </Button>
      )}
    </Dropdown>
  );
};

export default CustomDropdown;

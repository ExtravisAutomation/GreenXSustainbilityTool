import React from 'react';
import { useTheme } from '@mui/material/styles';

export default function DefaultInput({
  field,
  type = 'text',
  sx,
  children,
  parent = '',
  ...rest
}) {
  const theme = useTheme();

  return (
    <input
      {...field}
      type={type}
      style={{
        borderStyle: 'solid',
        color: theme?.palette?.default_input?.primary_text,
        backgroundColor: theme?.palette?.default_input?.background,
        border: `1px solid ${theme?.palette?.default_input?.border}`,
        borderRadius: '5px',
        padding: '7px 10px',
        // width: `${parent == 'filter' ? '60%' : '90%'}`,
        width: '90%',
        // margin: '0px 10px',
        ...sx,
      }}
      className={`${theme?.mode == 'dark' ? 'filter_input' : 'filter_input_light'}`}
      {...rest}
    >
      {children}
    </input>
  );
}

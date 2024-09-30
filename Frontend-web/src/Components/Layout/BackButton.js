import React from 'react';
import { BackwardOutlined } from '@ant-design/icons';

const BackIcon = ({ onClick, style = {} }) => {
  return (
    <BackwardOutlined
      onClick={onClick}
      style={{ fontSize: '2.5rem', marginRight: '1rem', cursor: 'pointer', ...style }}
    />
  );
};

export default BackIcon;

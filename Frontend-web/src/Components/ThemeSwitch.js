import React from 'react';
import { Switch, FloatButton } from 'antd';
import { SunFilled, MoonFilled } from '@ant-design/icons';

const ThemeSwitch = ({ onToggle }) => {
  const [checkWindows, setCheckWindows] = React.useState(true);
  
  let checked = false;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && checkWindows) {
    onToggle(true);
    checked = true;
  }

  return (
    <Switch
      checkedChildren={<MoonFilled />}
      unCheckedChildren={<SunFilled />}
      size='xl'
      defaultChecked={checked}
      onChange={onToggle}
      onClick={() => setCheckWindows(false)}
      style={{ margin: '0 1% 6% 0' }}
    />
  );
};

export default ThemeSwitch;

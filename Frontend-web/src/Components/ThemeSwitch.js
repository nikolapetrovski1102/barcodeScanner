import React from 'react';
import { Switch } from 'antd';
import { SunFilled, MoonFilled } from '@ant-design/icons';

const ThemeSwitch = ({ onToggle }) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    setChecked(isDark);
    onToggle(isDark);
  }, [onToggle]);

  const handleToggle = (value) => {
    setChecked(value);
    localStorage.setItem('darkTheme', value);
    onToggle(value);
  };

  return (
    <Switch
      checkedChildren={<MoonFilled />}
      unCheckedChildren={<SunFilled />}
      size="xl"
      checked={checked}
      onChange={handleToggle}
      style={{ margin: '0 1% 6% 0' }}
    />
  );
};

export default ThemeSwitch;

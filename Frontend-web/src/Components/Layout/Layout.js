import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Row, Col, Divider } from 'antd';
import BackIcon from './BackButton';
import {
  DesktopOutlined,
  PlusSquareOutlined,
  UserOutlined,
  FallOutlined
} from '@ant-design/icons';
import Table from '../Table/MainTable/Table';
import ThemeSwitch from '../ThemeSwitch';
import ImageLogo from '../../images/HEMPROMAK_LOGO.png';

const { Header, Content, Footer, Sider } = Layout;
const { defaultAlgorithm, darkAlgorithm, getDesignToken } = theme;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <a href="/home">
      <img src={ImageLogo} width={150} alt="HEMPROMAK" style={{ marginTop: '15%' }} />
    </a>, 
    '0', 
    ''
  ),
  getItem(
    <a href="/menu">Menu</a>, 
    '2', 
    <DesktopOutlined />
  ),
  getItem(
    'Tables', 
    'sub1', 
    <UserOutlined />, [
      getItem(<a href="/data">Adapteri nipli</a>, '3'),
      getItem(<a href="/data">Bill</a>, '4'),
      getItem(<a href="/data">Alex</a>, '5'),
    ]
  ),
  getItem(
    <a href="/transactions">Transakcii</a>, 
    '2', 
    <DesktopOutlined />
  ),
  getItem(
    <a href="/add_new">Add</a>,
    '2', 
    <PlusSquareOutlined />
  ),
  getItem(
    <a href="/low_stock">Low on Stock Items</a>,
    '2',
    <FallOutlined />
  ),
];


const App = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const themeAlgorithm = isDarkMode ? darkAlgorithm : defaultAlgorithm;
  const designToken = getDesignToken({ algorithm: themeAlgorithm });

  const handleThemeSwitch = (checked) => {
    setIsDarkMode(checked);
  };

  return (
    <ConfigProvider theme={{ algorithm: themeAlgorithm }}>
      <Layout style={{ minHeight: '100vh', width: '100%' }}>
        <Sider id='sider' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: isDarkMode ? designToken.colorBgContainer : '#f5f5f5', opacity: 0.9}}>
          <Menu defaultSelectedKeys={['1']} items={items} mode="inline" style={{ background: isDarkMode ? designToken.colorBgContainer : '#f5f5f5', opacity: 0.9 }} />
        </Sider>
        <Layout
          style={{
            marginTop: '-1%',
            marginBottom: '-1%',
            height: '100vh',
          }}
        >
          <Content style={{ margin: '0 16px', height: '100vh', overflow: 'auto' }}>
            <div
              id='content'
              style={{
                padding: 24,
                minHeight: 360,
                height: '95%',
                background: designToken.colorBgContainer,
                borderRadius: designToken.borderRadiusLG,
                marginTop: '2%',
              }}
            >
            <Header style={{ padding: 0, background: designToken.colorBgContainer, marginBottom: '0%' }}>
              <Row>
              <Col style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }} span={11}>
              {(title !== 'Login' && title !== 'Menu') ? (
                <BackIcon onClick={() => window.history.back()} />
              ) : ('')}
                <h1 id='title' style={{ margin: '0 0 0% 5%' }}>
                  {title}
                </h1>
              </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <ThemeSwitch onToggle={handleThemeSwitch} />
                </Col>
              </Row>
            </Header>
            <Divider style={{ margin: '-.5% 0 1.5% 0', padding: 0}} />
              { children }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', padding: '.2%' }}>
            HEMPROMAK ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;

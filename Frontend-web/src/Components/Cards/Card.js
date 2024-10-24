import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Switch, notification } from 'antd';

import nipple from '../../images/nipple.png';
import { useLocale } from "antd/es/locale";


const actions = [
  <EditOutlined key="edit" />,
  <SettingOutlined key="setting" />,
  <EllipsisOutlined key="ellipsis" />,
];

const cards = [
  {
    title: 'Adapteri Nipli'
  },
  {
    title: 'ALFAGOMMA'
  },
  {
    title: 'Cauri'
  },
  {
    title: 'Cidat'
  },
  {
    title: 'Contitex'
  }
];

const App = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const record = location.state?.record || [];
  const [loading, setLoading] = useState(true);

  const openNotification = () => {
    notification.open({
      placement: 'topLeft',
      type: 'warning',
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  useEffect( () => {
    setTimeout( () => {
      openNotification();
      setLoading(false);
    }, 1000)
  })

  return (
    <>
      {/* <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} /> */}
      <div style={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row', gap: '16px' }}>
        {cards.map((card, index) => (
          <Card
            onClick={() => navigate("/data", { state: { record: record } }) }
            id='menu-cards'
            key={index}
            loading={loading}
            actions={actions}
            style={{
              minWidth: 200,
              width: 300,
            }}
          >
            <Card.Meta
              avatar={<Avatar src={`${nipple}`} />}
              title={card.title}
              description={
                <>
                  <p>This is the description for {card.title}</p>
                  <p>This is another description</p>
                </>
              }
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default App;

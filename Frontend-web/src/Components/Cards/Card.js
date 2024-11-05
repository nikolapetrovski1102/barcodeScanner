import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { CaretDownFilled, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Switch, notification } from 'antd';
import { Axios } from '../Axios';
import nipple from '../../images/nipple.png';
import { useLocale } from "antd/es/locale";

const axios = new Axios();

const actions = [
  <EditOutlined key="edit" />,
  <SettingOutlined key="setting" />,
  <EllipsisOutlined key="ellipsis" />,
];

const cards = [
  {
    title: 'Adapteri Nipli',
    table_name: "adapteri_nipli"
  }
];

const App = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const record = location.state?.record || [];
  const [loading, setLoading] = useState(true);
  const isInitialized = React.useRef(false);
  const [numberOfItems, setnumberOfItems] = useState(0);

  const openNotification = (item) => {
    notification.open({
      placement: 'topLeft',
      type: 'warning',
      message: 'Running Low on Stock',
      description:
        `The code ${item.sifra} from ${item.table_from} is running low on stock`,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  useEffect( () => {
      setLoading(true);
      axios.get('/api/Data/getCriticalItems').then( succ => {
        if (succ.status === 401)
          navigate('/');

        setLoading(true);
        if (succ.data.length > 0)
          succ.data.forEach(element => {
            openNotification(element);
          });

          axios.get(`/api/Data/getTableCount?tables=${encodeURIComponent(JSON.stringify(cards))}`)
          .then( response => {
            Array.from(response.data).forEach( element => {
              var tables = Object.keys(element)[1];
              if (tables != 'key'){
                document.getElementById(tables).innerHTML = `Total of ${element[tables]}`
              }
            })
          })
          .catch( error => {
            console.log(error);
          })
      }).catch(err =>{
        setLoading(true);
        if (err.status === 401)
          navigate('/');
      }).finally( () => setLoading(false));

  }, [navigate])

  return (
    <>
      {/* <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} /> */}
      <div style={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row', gap: '16px' }}>
        {cards.map((card, index) => (
          <Card
            onClick={() => navigate(`/data`, { state: { record: record, table_name: card.table_name, title: card.title } }) }
            id='menu-cards'
            key={index}
            loading={loading}
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
                  <p id={card.table_name} ></p>
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

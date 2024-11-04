import React, { useState, useEffect } from 'react';
import { List, Col, Row, Tabs, Skeleton, Space, Spin } from 'antd';
import ListData from '../Table/Data';
import { DatabaseOutlined, DollarOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Details from './Details';
import TransactionTable from '../Table/TransactionTable/TransactionTable';
import TransferLayout from '../Transfer/TransferLayout';
import { Axios } from '../Axios';

const axios = new Axios();

function renderItems (items) {
  return Array.from(items).map((item) => ({
    sifra: item.sifra,
    head_type: item.head_type,
    opis: item.opis,
    type: item.type,
    cena: item.cena,
    komada: item.komada
  }));
};

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const MyList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [record, setRecord] = useState(location.state?.record || JSON.parse(localStorage.getItem('record')) || []);
  const current_table = location.state?.table || localStorage.getItem('current_table') || '';
  const [skeletonLoad, setSkeletonLoad] = useState(false);
  const [selectedItem, setSelectedItem] = useState(record.length > 0 ? record : []);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [colsTransfer, setColsTransfer] = useState(0);
  const [colsTabs, setColsTabs] = useState(18);
  const [listsCol, setListsCol] = useState(6);
  const [listPageSize, setListPageSize] = useState(5);
  const [tabsClass, setTabsClass] = useState('toggle_show');
  const [transferClass, setTransferClass] = useState('toggle_hide');
  const [listDisplay, setListDisplay] = useState('block');
  const [tabsDisplay, setTabsDisplay] = useState('block');
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [doShowTotal, setDoShowTotal] = useState("true");

  // Restore the saved classes when the component mounts
  useEffect(() => {
    if (selectedItem.length == 1){
      axios.get(`/api/Data?current_table=${encodeURIComponent(current_table)}`, {})
      .then(function (response) {
        setSpinning(false);
        setListData(response.data.result);
        console.log("Selected item: ");
        console.log(selectedItem);
        setData(renderItems(response.data.result));
      })
      .catch(function (error) {
        setSpinning(false);
        if (error.status === 401){
          navigate('/');
        }
        console.log(error);
      });
    }else
      setData(selectedItem);

    let table_cell_height = 123;
    let content_div_height = document.getElementById('content').offsetHeight - 200;

    setListPageSize(Math.floor(content_div_height / table_cell_height));

    // Load saved state from localStorage
    const savedTabsClass = localStorage.getItem('tabsClass');
    const savedTransferClass = localStorage.getItem('transferClass');
    const savedColsTransfer = localStorage.getItem('colsTransfer');
    const savedColsTabs = localStorage.getItem('colsTabs');
    const savedColsList = localStorage.getItem('colsList');
    const savedRecord = localStorage.getItem('record');
    const savedDoShowTotal = localStorage.getItem('doShowTotal');
  
    if (savedTabsClass && savedTransferClass && savedColsTransfer !== null && savedColsTabs !== null && savedRecord !== null && savedColsList !== null) {
      console.log("Loading from localStorage");
      const parsedRecord = JSON.parse(savedRecord);
      setListsCol(Number(savedColsList));
      setTimeout( () => {
        setColsTransfer(Number(savedColsTransfer));
        setColsTabs(Number(savedColsTabs));
      }, 500)
        setTabsClass(savedTabsClass);
        setTransferClass(savedTransferClass);
        setSelectedItem(parsedRecord);
        setData(renderItems(parsedRecord.length > 1 ? parsedRecord : listData));
        setDoShowTotal(savedDoShowTotal);
        console.log(savedDoShowTotal);
        console.log(doShowTotal);
    }
  
    // Clear localStorage on back navigation
    const handlePopState = () => {
      if (transferClass === 'toggle_hide')
        localStorage.removeItem('record');

      setTransferClass('toggle_hide');
      setDoShowTotal('true');
      setListsCol(6);
      setTimeout( () => {
        setColsTransfer(0);
        setColsTabs(18);
      }, 500)
      setTabsClass('');
      setTabsClass('toggle_show');
      setTimeout( () => {
        localStorage.removeItem('tabsClass');
        localStorage.removeItem('transferClass');
        localStorage.removeItem('colsTransfer');
        localStorage.removeItem('colsTabs');
        localStorage.removeItem('colsList');
        localStorage.removeItem('current_table');
        localStorage.removeItem('doShowTotal');
      }, 700)
    };
    
    window.addEventListener('popstate', handlePopState);

  }, []);

  const handleFormSubmit = (formData) => {
    if (formData === 'Back') {
      setTabsClass('toggle_show');
      setTransferClass('toggle_hide');
      setDoShowTotal('true');
      setListsCol(6);
      setTimeout( () => {
        setColsTransfer(0);
        setColsTabs(18);
      }, 500)
  
      // Save state to localStorage
      localStorage.setItem('tabsClass', 'toggle_show');
      localStorage.setItem('transferClass', 'toggle_hide');
      localStorage.setItem('colsTransfer', 0);
      localStorage.setItem('colsTabs', 18);
  
    } else if (formData === 'Continue') {
      window.history.pushState({ record: selectedItem }, null, '/details');
      setTabsClass('toggle_hide');
      setTransferClass('toggle_show');
      setListsCol(4);
      setDoShowTotal('false');
      setTimeout( () => {
        setColsTransfer(20);
        setColsTabs(0);
      }, 500)
  
      localStorage.setItem('tabsClass', 'toggle_hide');
      localStorage.setItem('transferClass', 'toggle_show');
      localStorage.setItem('colsTransfer', 20);
      localStorage.setItem('colsList', 4);
      localStorage.setItem('colsTabs', 0);
      localStorage.setItem('record', JSON.stringify(selectedItem));
      localStorage.setItem('current_table', current_table);
      localStorage.setItem('doShowTotal', false);
    }
  
    console.log('Form submitted with data:', formData);
    setIsFormSubmitted(true);
  };

  const style = {
    lists: {
        display: listDisplay,
    },
    tabs: {
        display: tabsDisplay,
    }

  }

  const items = [
    {
      label: `Details`,
      key: '1',
      children: !skeletonLoad ? <Details item={selectedItem} onFormSubmit={handleFormSubmit} /> : <Skeleton active />,
    },
    {
      label: `Transakcii`,
      key: '2',
      children: !skeletonLoad ? <TransactionTable item={selectedItem} /> : <Skeleton active />,
    },
    {
      label: `Istorija`,
      key: '3',
      children: !skeletonLoad ? <p>Details for Tab 3: {selectedItem.sifra}</p> : <Skeleton active />,
    },
  ];

  const handleClick = (item) => {
    setSkeletonLoad(true);
    setTimeout( () => {
      setSelectedItem(item);
      setSkeletonLoad(false);
    }, 1000)
  };

  const onChange = (key) => {
    console.log('Selected Tab:', key);
  };

  return (
  <Row id='details_row'>
  <Col 
    id='lists'
    span={listsCol}
    style={style.lists}
  >
    <List
      itemLayout="vertical"
      size="medium"
      style={{ cursor: 'pointer' }}
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        showTotal: doShowTotal === 'false' ? '' : (total, range) => `${range[0]}-${range[1]} of ${total}`,
        pageSize: listPageSize,
        size: 'small',
        showSizeChanger: false
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
        actions={[
          <IconText icon={DollarOutlined} text={item.cena} key="list-vertical-dollar-0" />,
          <IconText icon={DatabaseOutlined} text={item.komada} key="list-vertical-like-o" />,
        ]}
        key={item.head_type} onClick={() => handleClick(item)}>
          <List.Item.Meta
            style={{ height: '60px' }}
            title={<a>{item.opis}</a>}
            description={
              <p style={{ paddingBottom: '15%' }} >
                <strong>{item.sifra}</strong> - {item.head_type}
              </p>
            }
          />
        </List.Item>
      )}
    />
  </Col>

  <Col 
    id='tabs' 
    // style={style.tabs}
    span={colsTabs}
    className={tabsClass}
  >
    <Tabs
      tabPosition={'left'}
      key={1}
      onChange={onChange}
      defaultActiveKey="1"
      items={items}
    />
  </Col>
  <Col span={colsTransfer} className={transferClass} >
  <TransferLayout 
    item={selectedItem.length === 1 ? selectedItem : record} 
  />
  </Col>
  <Spin spinning={spinning} fullscreen />
</Row>
  );
};

export default MyList;

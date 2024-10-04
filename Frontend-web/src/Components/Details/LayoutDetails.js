import React, { useState, useEffect } from 'react';
import { List, Col, Row, Tabs, Skeleton, Space } from 'antd';
import ListData from '../Table/Data';
import { DatabaseOutlined, DollarOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import Details from './Details';
import TransactionTable from '../Table/TransactionTable/TransactionTable';
import TransferLayout from '../Transfer/TransferLayout';

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
  const [record, setRecord] = useState(location.state?.record || JSON.parse(localStorage.getItem('record')) || []);
  const [skeletonLoad, setSkeletonLoad] = useState(false);
  const [selectedItem, setSelectedItem] = useState(record.length > 0 ? record : []);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [colsTransfer, setColsTransfer] = useState(0);
  const [colsTabs, setColsTabs] = useState(20);
  const [listsCol, setListsCol] = useState(4);
  const [listPageSize, setListPageSize] = useState(5);
  const [tabsClass, setTabsClass] = useState('toggle_show');
  const [transferClass, setTransferClass] = useState('toggle_hide');
  const [listDisplay, setListDisplay] = useState('block');
  const [tabsDisplay, setTabsDisplay] = useState('block');
  const [data, setData] = useState([]);

  // Restore the saved classes when the component mounts
  useEffect(() => {
       
    let table_cell_height = 123;
    let content_div_height = document.getElementById('content').offsetHeight - 200;

    console.log("Content div height: ", content_div_height);

    setListPageSize(Math.floor(content_div_height / table_cell_height));

    console.log("ListPageSize: ", listPageSize);
    // Load saved state from localStorage
    const savedTabsClass = localStorage.getItem('tabsClass');
    const savedTransferClass = localStorage.getItem('transferClass');
    const savedColsTransfer = localStorage.getItem('colsTransfer');
    const savedColsTabs = localStorage.getItem('colsTabs');
    const savedRecord = localStorage.getItem('record');
  
    setData(renderItems(selectedItem.length > 1 ? selectedItem : ListData));

    if (savedTabsClass && savedTransferClass && savedColsTransfer !== null && savedColsTabs !== null && savedRecord !== null) {
      console.log("Loading from localStorage");
      const parsedRecord = JSON.parse(savedRecord);
      setTabsClass(savedTabsClass);
      setTransferClass(savedTransferClass);
      setColsTransfer(Number(savedColsTransfer));
      setColsTabs(Number(savedColsTabs));
      setSelectedItem(parsedRecord);
      setData(renderItems(parsedRecord.length > 1 ? parsedRecord : ListData));
    }
  
    // Clear localStorage on back navigation
    const handlePopState = () => {
      if (transferClass === 'toggle_hide')
        localStorage.removeItem('record');

      setTransferClass('toggle_hide');
      setTimeout( () => {
        setColsTabs(20);
        setColsTransfer(0);
      }, 300)
      setTabsClass('');
      setTabsClass('toggle_show');
      setTimeout( () => {
        localStorage.removeItem('tabsClass');
        localStorage.removeItem('transferClass');
        localStorage.removeItem('colsTransfer');
        localStorage.removeItem('colsTabs');
      }, 700)
    };
    
    window.addEventListener('popstate', handlePopState);

  }, []);

  const handleFormSubmit = (formData) => {
    if (formData === 'Back') {
      setTabsClass('toggle_show');
      setTransferClass('toggle_hide');
      setTimeout( () => {
        setColsTransfer(0);
        setColsTabs(20);
      }, 500)
  
      // Save state to localStorage
      localStorage.setItem('tabsClass', 'toggle_show');
      localStorage.setItem('transferClass', 'toggle_hide');
      localStorage.setItem('colsTransfer', 0);
      localStorage.setItem('colsTabs', 20);
  
    } else if (formData === 'Continue') {
      window.history.pushState({ record: selectedItem }, null, '/details');
      setTabsClass('toggle_hide');
      setTransferClass('toggle_show');
      setTimeout( () => {
        setColsTransfer(20);
        setColsTabs(0);
      }, 500)
  
      // Save state to localStorage
      localStorage.setItem('tabsClass', 'toggle_hide');
      localStorage.setItem('transferClass', 'toggle_show');
      localStorage.setItem('colsTransfer', 20);
      localStorage.setItem('colsTabs', 0);
      localStorage.setItem('record', JSON.stringify(selectedItem));
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
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        pageSize: listPageSize,
        size: 'small'
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
      item={selectedItem.length == 1 ? selectedItem : record}
    />
  </Col>
</Row>
  );
};

export default MyList;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, ConfigProvider, Form, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
// import Data from '../TransactionHistory';
import { Axios } from '../../Axios';

const TableComponent = ({ element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record || [];
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {

    const axios = new Axios();

    axios.get('/getTransaction', {})
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      if (error.status === 401) {
        navigate('/');
      }
      console.log(error);
    });

    let table_cell_height = document.querySelector('.ant-table-cell').offsetHeight;
    let content_div_height = document.getElementById('content').offsetHeight - 230;

    setPageSize(Math.floor(content_div_height / table_cell_height));
    
    if (record.length > 0) {
      const selectedKeys = record
        .map(item => item.key.toString())
  
      console.log('Selected Keys:', selectedKeys);
  
      onSelectChange(selectedKeys);
    }
  }, []);
  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: '15%',
      ...getColumnSearchProps('ID'),
      sorter: (a, b) => Date.parse(a.ID) - Date.parse(b.ID),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Seriski broj',
      dataIndex: 'seriski_broj',
      key: 'seriski_broj',
      width: '15%',
      ...getColumnSearchProps('date'),
      sorter: (a, b) => Date.parse(a.seriski_broj) - Date.parse(b.seriski_broj),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Data',
      dataIndex: 'date_created',
      key: 'date_created',
      width: '15%',
      ...getColumnSearchProps('date_created'),
      sorter: (a, b) => Date.parse(a.date_created) - Date.parse(b.date_created),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Do/Od',
      dataIndex: 'from_to',
      key: 'from_to',
      width: '30%',
      ...getColumnSearchProps('to'),
    },
    {
      title: 'Broj na produkti',
      dataIndex: 'no_items',
      key: 'no_items',
      width: '10%',
      ...getColumnSearchProps('no_items'),
      sorter: (a, b) => parseInt(a.no_items) - parseInt(b.no_items),
    },
    {
      title: 'Vozilo broj',
      dataIndex: 'vozilo_broj',
      key: 'vozilo_broj',
      ...getColumnSearchProps('vozilo_broj'),
    },
    {
      title: 'ispratnica broj',
      dataIndex: 'ispratnica_broj',
      key: 'ispratnica_broj',
      ...getColumnSearchProps('ispratnica_broj'),
    },

  ];

  // Handle row selection change
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedRows = data.filter((item) => newSelectedRowKeys.includes(item.key));
    setSelectedRows(selectedRows);
  };

  const handleRedirect = () => {
    console.log('Selected Rows:');
    console.log(selectedRows);
    navigate(`/details/`, { state: { record: selectedRows } });
  }

  const handleSingleClick = (record) => {
      selectedRows.push(record);
      navigate(`/transactionDetails/`, { state: { record } });
  };

  return (
    <ConfigProvider theme={element}>
      <Row>
        <Col span={12} >
        </Col>
        <Col style={{ display: 'flex', 'justifyContent': 'end' }} span={12}>
          <Button onClick={handleRedirect} style={{ display: selectedRowKeys.length > 0 ? 'block' : 'none' }} >Continue</Button>
        </Col >
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: () => handleSingleClick(record)
        })}
        pagination={{
          position: ['bottomRight'],
          pageSize: pageSize,
          showTitle: true,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
        }}
        size="large"
      />
    </ConfigProvider>
  );
};

export default TableComponent;

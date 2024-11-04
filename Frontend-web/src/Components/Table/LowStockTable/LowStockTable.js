import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import Notification from '../Notification'
import { Button, Input, Space, Table, ConfigProvider, Form, Row, Col, Spin } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/reset.css';
import Data from '../Data';
import Paragraph from 'antd/es/skeleton/Paragraph';
import { Axios } from '../../Axios';

const axios = new Axios();

const LowStockTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);

  useEffect( () => {
    let table_cell_height = document.querySelector('.ant-table-cell').offsetHeight;
    let content_div_height = document.getElementById('content').offsetHeight - 285;

    setPageSize(Math.floor(content_div_height / table_cell_height));

    axios.get('/api/Data/criticalItem', {})
    .then( response =>{
      setData(response.data[0]);
    }).catch( error => {
      console.log(error);
    })

  })

  const handleOnClick = (record) => {
    navigate(`/add_new/`, { state: { record } });
  }

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
      title: 'sifra',
      dataIndex: 'sifra',
      key: 'sifra',
      width: '10%',
      ...getColumnSearchProps('sifra'),
      sorter: (a, b) => parseInt(a.sifra) - parseInt(b.sifra),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'head_type',
      dataIndex: 'head_type',
      key: 'head_type',
      width: '30%',
      ...getColumnSearchProps('head_type'),
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: '35%',
      ...getColumnSearchProps('type'),
    },
    {
      title: 'komada',
      dataIndex: 'komada',
      key: 'komada',
      sorter: (a, b) => parseInt(a.komada) - parseInt(b.komada),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'cena',
      dataIndex: 'cena',
      key: 'cena',
      sorter: (a, b) => parseInt(a.cena) - parseInt(b.cena),
      sortDirections: ['descend', 'ascend'],
    },
  ];

    return (
        <Table
        onRow={(record) => ({
          style: { cursor: 'pointer' },
          onClick: () => handleOnClick(record),
        })}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ['bottomRight'],
          pageSize: pageSize,
          showTitle: true,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: false,
        }}
        size="large"
      />
    )
}

export default LowStockTable;
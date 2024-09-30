import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
// const data = [

// ];

const App = ({ item }) => {
  const date = new Date();

  const data = [{
    sifra: item.sifra,
    head_type: item.head_type,
    opis: item.opis,
    type: item.type,
    date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
    cena: item.cena,
    komada: item.komada
  }];

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
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
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'head type',
      dataIndex: 'head_type',
      key: 'head_type',
      width: '22%',
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      ...getColumnSearchProps('date'),
      sorter: (a, b) => parseInt(a.date) - parseInt(b.date),
      sortDirections: ['descend', 'ascend'],  
    },
    {
      title: 'komada',
      dataIndex: 'komada',
      key: 'komada',
      width: '15%',
      ...getColumnSearchProps('komada'),
      sorter: (a, b) => parseInt(a.komada) - parseInt(b.komada),
      sortDirections: ['descend', 'ascend'],
    },
  ];
  return (
    <>
       {/* <h2 style={{ paddingBottom: '1%' }} > {item.sifra} - {item.opis} </h2> */}
        <Table size='small' columns={columns} dataSource={data} />
        <Button>Continue</Button>
    </>
    );
};
export default App;
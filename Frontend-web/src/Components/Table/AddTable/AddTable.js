import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, ConfigProvider, Form, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import Data from '../Data';
import Paragraph from 'antd/es/skeleton/Paragraph';

const TableComponent = ({ element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record || [];
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowSelectionEnabled, setRowSelectionEnabled] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [spanText, setSpanText] = useState('Disable Row Selection');
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState(Data);

  console.log(record);

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
  ];

  // Toggle row selection feature on/off
  const handleRowSelectionToggle = (enable) => {
    setRowSelectionEnabled(enable);
    setSpanText(enable ? 'Disable Row Selection' : 'Enable Row Selection');
    if (!enable) {
      setSelectedRowKeys([]);
    }
  };

  // Handle row selection change
  const onSelectChange = (newSelectedRowKeys) => {

    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleRedirect = () => {
    navigate(`/details/`, { state: { record: selectedRows } });
  }

  const handleSingleClick = (record) => {
    selectedRows.push(record);
    if (!rowSelectionEnabled) {
      navigate(`/details/`, { state: { record } });
    } else {
      const newSelectedRowKeys = [...selectedRowKeys]; // Copy the current selected keys
  
      const selectedRowIndex = newSelectedRowKeys.indexOf(record.key);
  
      if (selectedRowIndex > -1) {
        newSelectedRowKeys.splice(selectedRowIndex, 1);
      } else {
        newSelectedRowKeys.push(record.key);
      }

      onSelectChange(newSelectedRowKeys);
    }
  };

  const rowSelection = rowSelectionEnabled
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
      }
    : null;

  return (
    <ConfigProvider theme={element}>
      <Row>
        <Col span={12} >
          <Form.Item>
            <span style={{ textDecoration: 'undreline', cursor: 'pointer' }} onClick={() => handleRowSelectionToggle(!rowSelectionEnabled)} >{spanText}</span>
          </Form.Item>
        </Col>
        <Col style={{ display: 'flex', 'justifyContent': 'end' }} span={12}>
          <Button onClick={handleRedirect} style={{ display: selectedRowKeys.length > 0 ? 'block' : 'none' }} >Continue</Button>
        </Col >
      </Row>
      <Table
        rowSelection={rowSelection}
        onRow={(record) => ({
          style: { cursor: 'pointer' },
          onClick: () => handleSingleClick(record)
        })}
        columns={columns}
        dataSource={data}
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

import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Row, Col, Divider } from 'antd';
import TransferTable from './TransferTable';

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  },
};


const TransferLayout = ({ onTransferSubmit, item, trigger }) => {

  const onFinish = (values) => {
    if (onTransferSubmit) {
      onTransferSubmit(values);
    }
  };

  return (
    <Row>
    <Col id='divider' span={1}>
    <div style={{ display: 'flex', alignItems: 'right', height: '100%', marginLeft: '40%' }}>
    <Divider type="vertical" style={{ height: "100%"}} />
    </div>
  </Col>
    <Col span={23}>
      {item != undefined ? <TransferTable item={item} /> : <p>Loading...</p>}
    </Col>
    </Row>
  );
};

export default TransferLayout;

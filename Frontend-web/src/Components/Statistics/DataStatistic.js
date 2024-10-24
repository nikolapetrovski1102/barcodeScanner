import React from 'react';
import { Flex, Splitter, Typography, Row, Col } from 'antd';
import HighLow from './HighLow';
import DataChart from './DataChart';

const App = () => {

  const highLowComponents = Array.from({ length: 5 }, (_, i) => <HighLow key={i} />);

  return (
    <Row>
      <Col span={8}>
        {highLowComponents}
      </Col>
      <Col span={16} >
        <DataChart />
      </Col>
    </Row>
  )
};

export default App;
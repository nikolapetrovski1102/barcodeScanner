import React from 'react';
import { Flex, Splitter, Typography, Row, Col } from 'antd';
import HighLow from './HighLow';
import DataChart from './DataChartTabs';

const App = () => {

  const highLowComponents = <HighLow key={1} />;

  return (
    <Row>
      <Col span={24} >
        <DataChart />
      </Col>
    </Row>
  )
};

export default App;
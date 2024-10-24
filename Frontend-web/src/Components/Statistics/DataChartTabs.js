import React from 'react';
import { Tabs } from 'antd';
import { Column } from '@ant-design/charts';

const onChange = (key) => {
    console.log(key);
  };

const DataChart = () => {
    const stockData = [
        { item: 'Item A', stock: 50 },
        { item: 'Item B', stock: 30 },
        { item: 'Item C', stock: 70 },
        { item: 'Item D', stock: 50 },
        { item: 'Item E', stock: 30 },
        { item: 'Item F', stock: 70 },
        { item: 'Item G', stock: 50 },
        { item: 'Item H', stock: 30 },
      ];
      
      const config = {
        data: stockData,
        xField: 'item',
        yField: 'stock',
        columnWidthRatio: 0.3,
        label: {
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        color: '#40a9ff',
      };

    return (
        <Tabs
            onChange={onChange}
            type="card"
            items={new Array(3).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
                label: `Tab ${id}`,
                key: id,
                children: <Column {...config} />,
            };
            })}
        />
    )

};

export default DataChart;
import React from 'react';
import { Tabs } from 'antd';
import { Column, Line, Pie, Radar } from '@ant-design/charts';

const onChange = (key, label) => {
    
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

      const fillRateData = [
        { type: 'Filled Orders', value: 98 },
        { type: 'Stockouts', value: 2 },
      ];

      const salesData = [
        { date: '2024-10-01', sales: 150 },
        { date: '2024-10-02', sales: 200 },
        { date: '2024-10-03', sales: 170 },
      ];
      
      const supplierData = [
        { metric: 'Lead Time', SupplierA: 7, SupplierB: 5 },
        { metric: 'Cost', SupplierA: 80, SupplierB: 90 },
        { metric: 'Quality', SupplierA: 85, SupplierB: 88 },
      ];

      const configRadar = {
        data: supplierData,
        xField: 'metric',
        yField: 'value',
        seriesField: 'supplier',
        smooth: true,
        point: { size: 4 },
      };

      const configLine = {
        data: salesData,
        xField: 'date',
        yField: 'sales',
        smooth: true,
        lineStyle: { stroke: '#ff4d4f' },
      };
      
      const configPie = {
        data: fillRateData,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
          labelHeight: 28,
          content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            content: 'Stock vs Fill',
          },
        },
      };

      const configColumn = {
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
      };

      const chartTypes = { 'Stock Levels': <Column {...configColumn} />, 'Sales Data': <Line {...configLine} />, 'Stockouts vs Fill Rate': <Pie {...configPie} />, 'Supplier Performance': <Radar {...configRadar} /> };

      return (
        <Tabs
          onChange={onChange}
          type="card"
          items={Object.entries(chartTypes).map(([title, component], i) => {
            const id = String(i + 1);
            return {
              label: title,
              key: id,
              children: component,
            };
          })}
        />
      );

};

export default DataChart;
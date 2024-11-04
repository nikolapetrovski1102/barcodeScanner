import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';

import Table from './Components/Table/MainTable/Table';
import LayoutDetails from './Components/Details/LayoutDetails';
import Login from './Components/Authentication/Login';
import Layout from './Components/Layout/Layout';
import Cards from './Components/Cards/Card';
import TransactionHistoryTable from './Components/Table/TransactionHistory/TransactionHistoryTable';
import TransactionHistoryDetails from './Components/Table/TransactionHistory/TransactionHistoryDetails';
import AddNew from './Components/Add/AddNew';
import LowStockTable from './Components/Table/LowStockTable/LowStockTable';

function App() {

  return (
      <Router>
        <Routes>
            <Route path='/' element={<Layout title='Login' > <Login /> </Layout>} />
            <Route path='/menu' element={<Layout title={'Menu'} > <Cards /> </Layout>} />
            <Route path='/data' element={<Layout> <Table /> </Layout>} />
            <Route path='/details' element={<Layout> <LayoutDetails /> </Layout>} />
            <Route path='/transactions' element={<Layout title={'Transakcii'} > <TransactionHistoryTable /> </Layout>} />
            <Route path='/transactionDetails' element={<Layout title={'Transakcii'} > <TransactionHistoryDetails /> </Layout>} />
            <Route path='/add_new' element={<Layout title={'Add'} > <AddNew /> </Layout>} />
            <Route path='/low_stock' element={<Layout title={'Low Stock'} > <LowStockTable /> </Layout>} />
        </Routes>
      </Router>
  );
  
}

export default App;

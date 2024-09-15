import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

import ThemeToggle from './Components/DarkMode/ThemeToggle';

import Table from './Components/Table/Table';

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/data')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Table data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;

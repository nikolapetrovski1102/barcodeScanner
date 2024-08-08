import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';

import ThemeToggle from './Components/DarkMode/ThemeToggle';

import Table from './Components/Table/Table';

function App() {
  return (
      <ThemeToggle>
    <Router>
      <Routes>
        <Route path='/' element={<Table />} />
      </Routes>
    </Router>
      </ThemeToggle>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import ThemeToggle from './Components/DarkMode/ThemeToggle';

import Table from './Components/Table/Table';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#262626",
      dark: "#FFFFFF",
      light: "#000000",
    },
   }
})

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Table />} />
      </Routes>
    </Router>
  );
}

export default App;

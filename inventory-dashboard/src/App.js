import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { withCredentials: true })
      .then(response => {
        console.log('Products:', response.data);
      })
      .catch(error => {
        console.error('API error:', error);
      });
  }, []);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* Add more routes here as you build more pages */}
      </Routes>
    </Router>
  );
}

export default App;

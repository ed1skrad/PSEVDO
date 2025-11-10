import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DatabasePage from './pages/DatabasePage';
import VoenkomatPage from './pages/VoenkomatPage';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/voenkomat" element={<VoenkomatPage />} />
              <Route path="/" element={<DatabasePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
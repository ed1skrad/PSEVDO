// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DatabasePage from './pages/DatabasePage';
import VoenkomatPage from './pages/VoenkomatPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="main-content">
              <Sidebar />
              <div className="content">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                      path="/database"
                      element={
                        <ProtectedRoute>
                          <DatabasePage />
                        </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/voenkomat"
                      element={
                        <ProtectedRoute>
                          <VoenkomatPage />
                        </ProtectedRoute>
                      }
                  />
                  <Route path="/" element={<Navigate to="/database" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
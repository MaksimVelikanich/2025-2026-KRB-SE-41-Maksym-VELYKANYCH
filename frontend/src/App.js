import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginContainer    from './pages/Login/LoginContainer';
import RegisterContainer from './pages/Register/RegisterContainer';
import DashboardContainer from './pages/Dashboard/DashboardContainer';
import HistoryContainer  from './pages/History/HistoryContainer';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<LoginContainer />} />
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/dashboard" element={
            <PrivateRoute><DashboardContainer /></PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute><HistoryContainer /></PrivateRoute>
          } />
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
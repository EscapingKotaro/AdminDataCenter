import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import NotificationsLogs from './pages/NotificationsLogs'; // Новая страница
import BillingSettingsPage from './pages/BillingSettingsPage';
import UserPage from './pages/UserPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/notifications-logs" element={<NotificationsLogs />} /> {/* Новый маршрут */}
              <Route path="/billing-settings" element={<BillingSettingsPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
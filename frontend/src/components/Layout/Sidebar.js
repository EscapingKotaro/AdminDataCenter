import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/monitoring', label: 'Monitoring', icon: '👁️' },
    { path: '/notifications-logs', label: 'Notifications & Logs', icon: '📋' }, // Новая страница
    { path: '/billing-settings', label: 'Billing Settings', icon: '💰' },
    { path: '/user', label: 'User Profile', icon: '👤' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>System Online</span>
        </div>
        <div className="sidebar-version">
          v1.0.0
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
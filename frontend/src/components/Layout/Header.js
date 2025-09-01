import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>🏢 DataCenter Admin</h1>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          <Link to="/user" className="user-profile-link">
            👤 Мой профиль
          </Link>
        </div>
        
        <div className="user-menu">
          <span className="user-name">Admin User</span>
          <div className="user-avatar">👤</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
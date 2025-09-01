import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile/UserProfile';
import ServerBackups from '../components/ServerBackups/ServerBackups';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';
import './UserPage.css';

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: '👤 Профиль', component: <UserProfile /> },
    { id: 'backups', label: '💾 Бэкапы серверов', component: <ServerBackups /> },
    { id: 'transactions', label: '📋 История транзакций', component: <TransactionHistory /> }
  ];

  return (
    <div className="user-page">
      <div className="page-header">
        <h1>👨‍💼 Панель пользователя</h1>
        <p>Управление профилем и персональными настройками</p>
      </div>

      <div className="user-content">
        <div className="tabs-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
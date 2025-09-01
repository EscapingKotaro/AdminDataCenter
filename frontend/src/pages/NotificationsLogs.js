import React, { useState } from 'react';
import NotificationsPanel from '../components/NotificationsPanel/NotificationsPanel';
import LogViewer from '../components/LogViewer/LogViewer';
import ReportGenerator from '../components/ReportGenerator/ReportGenerator';
import './NotificationsLogs.css';

const NotificationsLogs = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'notifications', label: '🔔 Уведомления', component: <NotificationsPanel /> },
    { id: 'logs', label: '📋 Логи', component: <LogViewer /> },
    { id: 'reports', label: '📊 Отчеты', component: <ReportGenerator /> }
  ];

  return (
    <div className="notifications-logs-page">
      <div className="page-header">
        <h1>📋 Уведомления и логи</h1>
        <p>Мониторинг событий, просмотр логов и генерация отчетов</p>
      </div>

      <div className="nl-content">
        <div className="nl-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nl-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="nl-tab-content">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default NotificationsLogs;
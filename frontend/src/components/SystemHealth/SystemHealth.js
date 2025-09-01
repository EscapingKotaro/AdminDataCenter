import React, { useState, useEffect } from 'react';
import './SystemHealth.css';

const SystemHealth = ({ serverId }) => {
  const [healthStatus, setHealthStatus] = useState({});

  useEffect(() => {
    const updateHealthStatus = () => {
      setHealthStatus({
        cpu: Math.random() > 0.1 ? 'healthy' : 'warning',
        memory: Math.random() > 0.15 ? 'healthy' : 'warning',
        disk: Math.random() > 0.2 ? 'healthy' : 'critical',
        network: Math.random() > 0.1 ? 'healthy' : 'warning',
        temperature: Math.random() > 0.05 ? 'healthy' : 'critical'
      });
    };

    updateHealthStatus();
    const interval = setInterval(updateHealthStatus, 10000);
    
    return () => clearInterval(interval);
  }, [serverId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Норма';
      case 'warning': return 'Предупреждение';
      case 'critical': return 'Критично';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="system-health">
      <h3>❤️ Состояние системы</h3>
      
      <div className="health-status">
        <div className="health-item">
          <span className="health-icon">⚡</span>
          <span className="health-label">Процессор</span>
          <span 
            className="health-status"
            style={{ color: getStatusColor(healthStatus.cpu) }}
          >
            {getStatusIcon(healthStatus.cpu)} {getStatusText(healthStatus.cpu)}
          </span>
        </div>

        <div className="health-item">
          <span className="health-icon">💾</span>
          <span className="health-label">Память</span>
          <span 
            className="health-status"
            style={{ color: getStatusColor(healthStatus.memory) }}
          >
            {getStatusIcon(healthStatus.memory)} {getStatusText(healthStatus.memory)}
          </span>
        </div>

        <div className="health-item">
          <span className="health-icon">💿</span>
          <span className="health-label">Диск</span>
          <span 
            className="health-status"
            style={{ color: getStatusColor(healthStatus.disk) }}
          >
            {getStatusIcon(healthStatus.disk)} {getStatusText(healthStatus.disk)}
          </span>
        </div>

        <div className="health-item">
          <span className="health-icon">🌐</span>
          <span className="health-label">Сеть</span>
          <span 
            className="health-status"
            style={{ color: getStatusColor(healthStatus.network) }}
          >
            {getStatusIcon(healthStatus.network)} {getStatusText(healthStatus.network)}
          </span>
        </div>

        <div className="health-item">
          <span className="health-icon">🔥</span>
          <span className="health-label">Температура</span>
          <span 
            className="health-status"
            style={{ color: getStatusColor(healthStatus.temperature) }}
          >
            {getStatusIcon(healthStatus.temperature)} {getStatusText(healthStatus.temperature)}
          </span>
        </div>
      </div>

      <div className="health-summary">
        <div className="summary-item">
          <span className="summary-label">Общее состояние:</span>
          <span className="summary-value">
            {Object.values(healthStatus).every(s => s === 'healthy') ? 'Отличное' : 'Требует внимания'}
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Последняя проверка:</span>
          <span className="summary-value">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
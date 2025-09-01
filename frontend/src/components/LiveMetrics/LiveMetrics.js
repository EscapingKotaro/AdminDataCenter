import React from 'react';
import './LiveMetrics.css';

const LiveMetrics = ({ isLive, onToggleLive, servers = [] }) => {
  // Динамически вычисляем статистику с защитой от undefined
  const totalServers = servers.length;
  const onlineServers = servers.filter(server => server.status === 'online').length;
  const offlineServers = servers.filter(server => server.status === 'offline').length;
  const otherServers = totalServers - onlineServers - offlineServers;

  // Вычисляем общую загрузку CPU (только для online серверов)
  const onlineServersList = servers.filter(server => server.status === 'online');
  const totalCpuUsage = onlineServersList.reduce((sum, server) => {
    // Заглушка для средней загрузки CPU каждого сервера
    const avgCpu = server.id === 1 ? 40 : server.id === 2 ? 65 : 85;
    return sum + avgCpu;
  }, 0);
  const avgCpuUsage = onlineServersList.length > 0 
    ? Math.round(totalCpuUsage / onlineServersList.length) 
    : 0;

  return (
    <div className="live-metrics">
      <div className="metrics-header">
        <h3>📊 Общая статистика</h3>
        <button 
          className={`live-toggle ${isLive ? 'active' : ''}`}
          onClick={onToggleLive}
        >
          {isLive ? '⏸️ Приостановить' : '▶️ Включить Live'}
        </button>
      </div>

      <div className="metrics-info">
        <p>
          {isLive 
            ? 'Метрики обновляются в реальном времени'
            : 'Мониторинг приостановлен'
          }
        </p>
        
        {isLive && (
          <div className="update-info">
            <span className="pulse"></span>
            Активно
          </div>
        )}
      </div>

      <div className="server-stats">
        <div className="stat-item">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <span className="stat-value">{totalServers}</span>
            <span className="stat-label">Всего серверов</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#10b981' }}>🟢</div>
          <div className="stat-content">
            <span className="stat-value">{onlineServers}</span>
            <span className="stat-label">Online</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#ef4444' }}>🔴</div>
          <div className="stat-content">
            <span className="stat-value">{offlineServers}</span>
            <span className="stat-label">Offline</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ color: '#f59e0b' }}>⚡</div>
          <div className="stat-content">
            <span className="stat-value">{avgCpuUsage}%</span>
            <span className="stat-label">Средняя загрузка CPU</span>
          </div>
        </div>
      </div>

      {totalServers > 0 && (
        <div className="status-breakdown">
          <h4>Состояние системы:</h4>
          <div className="status-bars">
            <div 
              className="status-bar online" 
              style={{ width: `${(onlineServers / totalServers) * 100}%` }}
              title={`Online: ${onlineServers}`}
            ></div>
            <div 
              className="status-bar offline" 
              style={{ width: `${(offlineServers / totalServers) * 100}%` }}
              title={`Offline: ${offlineServers}`}
            ></div>
            <div 
              className="status-bar other" 
              style={{ width: `${(otherServers / totalServers) * 100}%` }}
              title={`Other: ${otherServers}`}
            ></div>
          </div>
          <div className="status-legend">
            <span className="legend-item">
              <span className="legend-color online"></span>
              Online
            </span>
            <span className="legend-item">
              <span className="legend-color offline"></span>
              Offline
            </span>
            <span className="legend-item">
              <span className="legend-color other"></span>
              Other
            </span>
          </div>
        </div>
      )}

      {totalServers === 0 && (
        <div className="no-servers-message">
          <p>⏳ Серверы загружаются...</p>
        </div>
      )}
    </div>
  );
};

export default LiveMetrics;
import React from 'react';
import './SystemOverview.css';

const SystemOverview = ({ servers }) => {
  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const offlineServers = servers.filter(s => s.status === 'offline').length;
  const maintenanceServers = servers.filter(s => s.status === 'maintenance').length;

const totalCostPerHour = servers.reduce((sum, server) => {
    const hourlyRate = parseFloat(server.hourly_rate) || 0;
    return sum + hourlyRate;
  }, 0);
  const totalCostPerDay = totalCostPerHour * 24;
  const totalCostPerMonth = totalCostPerDay * 30;

  return (
    <div className="system-overview">
      <h3>📊 Общая статистика</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🖥️</div>
          <div className="stat-info">
            <div className="stat-value">{totalServers}</div>
            <div className="stat-label">Всего серверов</div>
          </div>
        </div>

        <div className="stat-card online">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{onlineServers}</div>
            <div className="stat-label">Online</div>
          </div>
        </div>

        <div className="stat-card offline">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{offlineServers}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>

        <div className="stat-card maintenance">
          <div className="stat-icon">🔧</div>
          <div className="stat-info">
            <div className="stat-value">{maintenanceServers}</div>
            <div className="stat-label">Обслуживание</div>
          </div>
        </div>
      </div>

      <div className="cost-overview">
        <h4>💸 Стоимость инфраструктуры</h4>
        <div className="cost-item">
          <span>В час:</span>
          <span className="cost-value">${totalCostPerHour.toFixed(2)}</span>
        </div>
        <div className="cost-item">
          <span>В день:</span>
          <span className="cost-value">${totalCostPerDay.toFixed(2)}</span>
        </div>
        <div className="cost-item">
          <span>В месяц:</span>
          <span className="cost-value">${totalCostPerMonth.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
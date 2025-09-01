import React from 'react';
import './ServerCard.css';

const ServerCard = ({ server, onAction, isSelected, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '✅';
      case 'offline': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const handleAction = (action) => {
    onAction(server.id, action);
  };

  return (
    <div className={`server-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="card-header">
        <h3 className="server-name">{server.name}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(server.status) }}
        >
          {getStatusIcon(server.status)} {server.status}
        </span>
      </div>

      <div className="card-content">
        <div className="server-info">
          <div className="info-row">
            <span className="label">IP:</span>
            <span className="value">{server.ip_address}</span>
          </div>
          <div className="info-row">
            <span className="label">CPU:</span>
            <span className="value">{server.cpu_cores} cores @ {server.cpu_frequency}GHz</span>
          </div>
          <div className="info-row">
            <span className="label">RAM:</span>
            <span className="value">{server.ram}GB</span>
          </div>
          <div className="info-row">
            <span className="label">Storage:</span>
            <span className="value">{server.storage}GB</span>
          </div>
          <div className="info-row">
            <span className="label">Стоимость:</span>
            <span className="value">${server.hourly_rate}/час</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        {server.status === 'offline' && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleAction('start'); }}
            className="btn btn-success"
          >
            ▶️ Запустить
          </button>
        )}
        
        {server.status === 'online' && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAction('stop'); }}
              className="btn btn-danger"
            >
              ⏹️ Остановить
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAction('restart'); }}
              className="btn btn-warning"
            >
              🔄 Перезагрузить
            </button>
          </>
        )}
        
        <button 
          onClick={(e) => { e.stopPropagation(); handleAction('maintenance'); }}
          className="btn btn-secondary"
        >
          🔧 Обслуживание
        </button>
      </div>
    </div>
  );
};

export default ServerCard;
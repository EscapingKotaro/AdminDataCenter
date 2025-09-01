import React, { useState } from 'react';
import { serverService } from '../../services/api';
import './ServerControls.css';

const ServerControls = ({ server, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('');

  const handlePowerAction = async (action) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setCurrentAction(action);

    try {
      switch (action) {
        case 'start':
          await serverService.powerOn(server.id);
          onStatusChange(server.id, 'online');
          break;
        case 'stop':
          await serverService.powerOff(server.id);
          onStatusChange(server.id, 'offline');
          break;
        case 'restart':
          await serverService.restart(server.id);
          // Симуляция перезагрузки на 15 секунд
          onStatusChange(server.id, 'restarting');
          setTimeout(() => {
            onStatusChange(server.id, 'online');
          }, 15000);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsLoading(false);
      setCurrentAction('');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'start': return '▶️';
      case 'stop': return '⏹️';
      case 'restart': return '🔄';
      default: return '';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'start': return 'Включить';
      case 'stop': return 'Выключить';
      case 'restart': return 'Перезагрузить';
      default: return '';
    }
  };

  return (
    <div className="server-controls">
      <h4>Управление сервером</h4>
      
      <div className="controls-grid">
        <button
          className={`control-btn ${isLoading && currentAction === 'start' ? 'loading' : ''} ${server.status === 'online' ? 'disabled' : ''}`}
          onClick={() => handlePowerAction('start')}
          disabled={server.status === 'online' || isLoading}
        >
          <span className="control-icon">▶️</span>
          <span className="control-label">Включить</span>
          {isLoading && currentAction === 'start' && <div className="loading-spinner"></div>}
        </button>

        <button
          className={`control-btn ${isLoading && currentAction === 'stop' ? 'loading' : ''} ${server.status !== 'online' ? 'disabled' : ''}`}
          onClick={() => handlePowerAction('stop')}
          disabled={server.status !== 'online' || isLoading}
        >
          <span className="control-icon">⏹️</span>
          <span className="control-label">Выключить</span>
          {isLoading && currentAction === 'stop' && <div className="loading-spinner"></div>}
        </button>

        <button
          className={`control-btn ${isLoading && currentAction === 'restart' ? 'loading' : ''} ${server.status !== 'online' ? 'disabled' : ''}`}
          onClick={() => handlePowerAction('restart')}
          disabled={server.status !== 'online' || isLoading}
        >
          <span className="control-icon">🔄</span>
          <span className="control-label">Перезагрузить</span>
          {isLoading && currentAction === 'restart' && <div className="loading-spinner"></div>}
        </button>
      </div>

      {server.status === 'restarting' && (
        <div className="restart-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">Перезагрузка... 15 сек</span>
        </div>
      )}
    </div>
  );
};

export default ServerControls;
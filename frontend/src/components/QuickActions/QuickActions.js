import React, { useState } from 'react';
import './QuickActions.css';

const QuickActions = ({ servers, onServerAction }) => {
  const [selectedAction, setSelectedAction] = useState('start');
  const [selectedServer, setSelectedServer] = useState('');

  const handleExecute = () => {
    if (!selectedServer) {
      alert('Выберите сервер');
      return;
    }

    onServerAction(parseInt(selectedServer), selectedAction);
    setSelectedServer('');
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'start': return '▶️';
      case 'stop': return '⏹️';
      case 'restart': return '🔄';
      case 'maintenance': return '🔧';
      default: return '⚡';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'start': return 'Запуск';
      case 'stop': return 'Остановка';
      case 'restart': return 'Перезагрузка';
      case 'maintenance': return 'Обслуживание';
      default: return 'Действие';
    }
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      
      <div className="action-controls">
        <div className="form-group">
          <label>Действие:</label>
          <select 
            value={selectedAction} 
            onChange={(e) => setSelectedAction(e.target.value)}
            className="action-select"
          >
            <option value="start">▶️ Запуск</option>
            <option value="stop">⏹️ Остановка</option>
            <option value="restart">🔄 Перезагрузка</option>
            <option value="maintenance">🔧 Обслуживание</option>
          </select>
        </div>

        <div className="form-group">
          <label>Сервер:</label>
          <select 
            value={selectedServer} 
            onChange={(e) => setSelectedServer(e.target.value)}
            className="server-select"
          >
            <option value="">Выберите сервер</option>
            {servers.map(server => (
              <option key={server.id} value={server.id}>
                {server.name} ({server.status})
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleExecute}
          disabled={!selectedServer}
          className="execute-btn"
        >
          {getActionIcon(selectedAction)} Выполнить {getActionLabel(selectedAction)}
        </button>
      </div>

      <div className="mass-actions">
        <h4>📦 Массовые действия</h4>
        <div className="mass-buttons">
          <button 
            onClick={() => servers.forEach(server => onServerAction(server.id, 'start'))}
            className="mass-btn start-all"
          >
            ▶️ Запустить все
          </button>
          <button 
            onClick={() => servers.forEach(server => onServerAction(server.id, 'stop'))}
            className="mass-btn stop-all"
          >
            ⏹️ Остановить все
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
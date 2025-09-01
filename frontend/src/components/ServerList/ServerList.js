import React from 'react';
import ServerCard from '../ServerCard/ServerCard';
import './ServerList.css';

const ServerList = ({ servers, onServerAction, onServerSelect, selectedServer, onRefresh }) => {
  const handleAction = (serverId, action) => {
    onServerAction(serverId, action);
  };

  return (
    <div className="server-list">
      <div className="list-header">
        <div>
          <h2>🖥️ Список серверов</h2>
          <span className="server-count">{servers.length} серверов в базе данных</span>
        </div>
        <button onClick={onRefresh} className="btn btn-secondary">
          🔄 Обновить
        </button>
      </div>

      <div className="servers-grid">
        {servers.map(server => (
          <ServerCard 
            key={server.id} 
            server={server}
            onAction={handleAction}
            isSelected={selectedServer === server.id}
            onSelect={() => onServerSelect(server.id)}
          />
        ))}
      </div>

      {servers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>Серверы не найдены</h3>
          <p>В базе данных нет серверов. Запустите seed команду на бэкенде.</p>
        </div>
      )}
    </div>
  );
};

export default ServerList;
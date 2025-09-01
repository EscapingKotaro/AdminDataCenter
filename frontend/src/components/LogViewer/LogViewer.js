import React, { useState, useEffect } from 'react';
import './LogViewer.css';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Заглушка данных логов
    setTimeout(() => {
      const demoLogs = [
        {
          id: 1,
          level: 'info',
          message: 'Сервер web-01 запущен успешно',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          server: 'web-01'
        },
        {
          id: 2,
          level: 'warning',
          message: 'Высокая загрузка CPU на сервере db-01: 85%',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          server: 'db-01'
        },
        {
          id: 3,
          level: 'error',
          message: 'Ошибка подключения к базе данных на сервере db-01',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          server: 'db-01'
        },
        {
          id: 4,
          level: 'debug',
          message: 'Проверка соединения с сервером backup-01',
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          server: 'backup-01'
        },
        {
          id: 5,
          level: 'critical',
          message: 'Сервер backup-01 недоступен',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          server: 'backup-01'
        }
      ];
      setLogs(demoLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLogs = logs.filter(log => {
    // Фильтр по уровню
    if (filter !== 'all' && log.level !== filter) return false;
    
    // Поиск по сообщению или серверу
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.message.toLowerCase().includes(searchLower) ||
        log.server.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getLevelIcon = (level) => {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'critical': return '🚨';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'info': return '#2563eb';
      case 'warning': return '#d97706';
      case 'error': return '#dc2626';
      case 'critical': return '#7c2d12';
      case 'debug': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toLocaleString()}] [${log.level}] [${log.server}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Загрузка логов...</div>;
  }

  return (
    <div className="log-viewer">
      <div className="viewer-header">
        <h3>📋 Просмотр логов</h3>
        <div className="viewer-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по логам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="level-filter"
          >
            <option value="all">Все уровни</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
            <option value="debug">Debug</option>
          </select>
          
          <button onClick={exportLogs} className="btn btn-primary">
            📥 Экспорт
          </button>
          
          <button onClick={clearLogs} className="btn btn-danger">
            🗑️ Очистить
          </button>
        </div>
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h4>Логи не найдены</h4>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className="log-entry">
                <div className="log-level" style={{ color: getLevelColor(log.level) }}>
                  {getLevelIcon(log.level)}
                </div>
                
                <div className="log-content">
                  <div className="log-message">{log.message}</div>
                  <div className="log-meta">
                    <span className="log-server">{log.server}</span>
                    <span className="log-time">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="viewer-footer">
        <div className="log-stats">
          <span>Всего записей: {filteredLogs.length}</span>
          <span>Показано: {filteredLogs.length}</span>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
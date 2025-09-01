import React, { useState, useEffect } from 'react';
import ServerMetrics from '../components/ServerMetrics/ServerMetrics';
import VisitorStats from '../components/VisitorStats/VisitorStats';
import NetworkMonitor from '../components/NetworkMonitor/NetworkMonitor';
import SystemHealth from '../components/SystemHealth/SystemHealth';
import { serverService, demoService } from '../services/api';
import './Monitoring.css';

const Monitoring = () => {
  const [selectedServer, setSelectedServer] = useState(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем серверы из API или демо-данных
      const response = await serverService.getAll();
      setServers(response.data);
      
      // Автоматически выбираем первый сервер, если есть
      if (response.data.length > 0) {
        setSelectedServer(response.data[0].id);
      }
      
    } catch (err) {
      console.error('Error fetching servers for monitoring:', err);
      setError('Не удалось загрузить серверы для мониторинга');
      
      // Используем демо-данные в случае ошибки
      try {
        const demoResponse = await demoService.getServers();
        setServers(demoResponse.data);
        if (demoResponse.data.length > 0) {
          setSelectedServer(demoResponse.data[0].id);
        }
      } catch (demoError) {
        console.error('Failed to load demo data:', demoError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServerChange = (serverId) => {
    const serverIdNum = parseInt(serverId);
    setSelectedServer(serverIdNum);
  };

  if (loading) {
    return (
      <div className="monitoring-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка серверов для мониторинга...</p>
      </div>
    );
  }

  if (error && servers.length === 0) {
    return (
      <div className="monitoring-error">
        <div className="error-icon">❌</div>
        <h3>Ошибка загрузки</h3>
        <p>{error}</p>
        <button onClick={fetchServers} className="btn btn-primary">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div className="monitoring-page">
      <div className="monitoring-header">
        <h1>👁️ Мониторинг в реальном времени</h1>
        <p>Отслеживание производительности серверов из базы данных</p>
        
        <div className="monitoring-controls">
          <div className="server-selector">
            <label>Сервер:</label>
            <select 
              value={selectedServer || ''} 
              onChange={(e) => handleServerChange(e.target.value)}
              disabled={servers.length === 0}
            >
              <option value="">Выберите сервер</option>
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name} ({server.ip_address}) - {server.status}
                </option>
              ))}
            </select>
          </div>
          
          <div className="time-selector">
            <label>Период:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1h">1 час</option>
              <option value="6h">6 часов</option>
              <option value="24h">24 часа</option>
              <option value="7d">7 дней</option>
            </select>
          </div>

          <button onClick={fetchServers} className="btn btn-secondary refresh-btn">
            🔄 Обновить
          </button>
        </div>
      </div>

      {error && (
        <div className="monitoring-warning">
          <span>⚠️ {error} Используются демо-данные для мониторинга.</span>
        </div>
      )}

      {servers.length === 0 ? (
        <div className="no-servers">
          <div className="empty-icon">🏢</div>
          <h3>Нет серверов для мониторинга</h3>
          <p>Добавьте серверы в базу данных или проверьте подключение к API</p>
        </div>
      ) : !selectedServer ? (
        <div className="no-selection">
          <div className="info-icon">ℹ️</div>
          <h3>Выберите сервер для мониторинга</h3>
          <p>Выберите сервер из выпадающего списка чтобы увидеть метрики</p>
        </div>
      ) : (
        <div className="monitoring-grid">
          <div className="metrics-section">
            <ServerMetrics serverId={selectedServer} timeRange={timeRange} />
          </div>
          
          <div className="visitors-section">
            <VisitorStats serverId={selectedServer} timeRange={timeRange} />
          </div>
          
          <div className="network-section">
            <NetworkMonitor serverId={selectedServer} timeRange={timeRange} />
          </div>
          
          <div className="health-section">
            <SystemHealth serverId={selectedServer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
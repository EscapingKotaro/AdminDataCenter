import React, { useState, useEffect } from 'react';
import ServerList from '../components/ServerList/ServerList';
import QuickActions from '../components/QuickActions/QuickActions';
import SystemOverview from '../components/SystemOverview/SystemOverview';
import { serverService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serverService.getAll();
      setServers(response.data);
    } catch (err) {
      console.error('Error fetching servers:', err);
      setError('Не удалось загрузить серверы. Проверьте подключение к API.');
      // Заглушка для демонстрации
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServerAction = async (serverId, action) => {
    try {
      const response = await serverService.manage(serverId, action);
      
      if (response.data.success) {
        // Обновляем локальное состояние
        setServers(prev => prev.map(server => {
          if (server.id === serverId) {
            return { 
              ...server, 
              status: response.data.new_status 
            };
          }
          return server;
        }));
        
        console.log(response.data.message);
      } else {
        console.error('Action failed:', response.data.message);
      }
    } catch (err) {
      console.error('Error performing action:', err);
      // Можно показать уведомление об ошибке
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка серверов из базы данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🏢 Панель управления серверами</h1>
        <p>Управление реальными серверами из базы данных</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <QuickActions 
            servers={servers}
            onServerAction={handleServerAction}
          />
          
          <SystemOverview servers={servers} />
        </div>

        <div className="dashboard-main">
          <ServerList 
            servers={servers}
            onServerAction={handleServerAction}
            onServerSelect={setSelectedServer}
            selectedServer={selectedServer}
            onRefresh={fetchServers}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
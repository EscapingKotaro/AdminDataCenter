import React, { useState, useEffect } from 'react';
import { serverService } from '../../services/api';
import './ServerBackups.css';

const ServerBackups = () => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  useEffect(() => {
    if (selectedServer) {
      fetchBackups(selectedServer);
    }
  }, [selectedServer]);

  const fetchServers = async () => {
    try {
      const response = await serverService.getAll();
      setServers(response.data);
      if (response.data.length > 0) {
        setSelectedServer(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      // Заглушка для демонстрации
      setServers([
        { id: 1, name: 'Web Server 01', ip_address: '192.168.1.101' },
        { id: 2, name: 'Database Server', ip_address: '192.168.1.102' }
      ]);
      setSelectedServer(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async (serverId) => {
    // Заглушка для бэкапов
    const demoBackups = [
      {
        id: 1,
        name: `backup-${serverId}-${new Date().toISOString().split('T')[0]}.tar.gz`,
        size: '2.4 GB',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
        status: 'completed'
      },
      {
        id: 2,
        name: `backup-${serverId}-${new Date(Date.now() - 172800000).toISOString().split('T')[0]}.tar.gz`,
        size: '2.1 GB',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
        status: 'completed'
      }
    ];
    setBackups(demoBackups);
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      // Имитация создания бэкапа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup = {
        id: Date.now(),
        name: `backup-${selectedServer}-${new Date().toISOString().split('T')[0]}.tar.gz`,
        size: `${(Math.random() * 3 + 1).toFixed(1)} GB`,
        created_at: new Date().toISOString(),
        status: 'completed'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      alert('✅ Бэкап успешно создан!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('❌ Ошибка при создании бэкапа');
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownloadBackup = (backup) => {
    // Заглушка для скачивания
    alert(`📥 Начато скачивание бэкапа: ${backup.name}\n\nВ реальной системе здесь бы началась загрузка файла.`);
    
    // Имитация скачивания
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,This is a demo backup file content';
    link.download = backup.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Загрузка серверов...</div>;

  return (
    <div className="server-backups">
      <h3>💾 Управление бэкапами</h3>

      <div className="backup-controls">
        <div className="server-selector">
          <label>Выберите сервер:</label>
          <select 
            value={selectedServer || ''} 
            onChange={(e) => setSelectedServer(parseInt(e.target.value))}
          >
            {servers.map(server => (
              <option key={server.id} value={server.id}>
                {server.name} ({server.ip_address})
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleCreateBackup} 
          disabled={creatingBackup}
          className="btn btn-primary"
        >
          {creatingBackup ? '🔄 Создание...' : '➕ Создать бэкап'}
        </button>
      </div>

      {selectedServer && (
        <div className="backups-list">
          <h4>📦 Доступные бэкапы</h4>
          
          {backups.length === 0 ? (
            <div className="no-backups">
              <p>🤷‍♂️ Бэкапы не найдены</p>
              <p>Создайте первый бэкап для этого сервера</p>
            </div>
          ) : (
            <div className="backups-grid">
              {backups.map(backup => (
                <div key={backup.id} className="backup-item">
                  <div className="backup-info">
                    <h5>{backup.name}</h5>
                    <p>Размер: {backup.size}</p>
                    <p>Создан: {new Date(backup.created_at).toLocaleDateString()}</p>
                    <span className={`status status-${backup.status}`}>
                      {backup.status === 'completed' ? '✅ Готов' : '🔄 В процессе'}
                    </span>
                  </div>
                  <div className="backup-actions">
                    <button 
                      onClick={() => handleDownloadBackup(backup)}
                      className="btn btn-download"
                    >
                      📥 Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="backup-info-box">
        <h4>ℹ️ Информация о бэкапах</h4>
        <ul>
          <li>Бэкапы создаются ежедневно автоматически</li>
          <li>Хранятся в течение 30 дней</li>
          <li>Можно скачать в формате .tar.gz</li>
          <li>Включают все данные сервера и конфигурации</li>
        </ul>
      </div>
    </div>
  );
};

export default ServerBackups;
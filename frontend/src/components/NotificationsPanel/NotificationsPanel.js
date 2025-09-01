import React, { useState, useEffect } from 'react';
import './NotificationsPanel.css';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Заглушка данных уведомлений
    setTimeout(() => {
      const demoNotifications = [
        {
          id: 1,
          type: 'error',
          title: 'Высокая загрузка CPU',
          message: 'Сервер web-01: загрузка CPU достигла 95%',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          server: 'web-01',
          read: false
        },
        {
          id: 2,
          type: 'warning',
          title: 'Мало свободной памяти',
          message: 'Сервер db-01: осталось менее 10% свободной памяти',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          server: 'db-01',
          read: true
        },
        {
          id: 3,
          type: 'critical',
          title: 'Сервер недоступен',
          message: 'Сервер backup-01 не отвечает на ping-запросы',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          server: 'backup-01',
          read: false
        },
        {
          id: 4,
          type: 'info',
          title: 'Резервное копирование завершено',
          message: 'Ежедневное резервное копирование выполнено успешно',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          server: 'backup-01',
          read: true
        }
      ];
      setNotifications(demoNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'error': return '⚠️';
      case 'warning': return '🔶';
      case 'critical': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'critical': return '#7c2d12';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="loading">Загрузка уведомлений...</div>;
  }

  return (
    <div className="notifications-panel">
      <div className="panel-header">
        <h3>🔔 Системные уведомления</h3>
        <div className="header-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все</option>
            <option value="unread">Непрочитанные</option>
            <option value="error">Ошибки</option>
            <option value="warning">Предупреждения</option>
            <option value="critical">Критические</option>
            <option value="info">Информационные</option>
          </select>
          <button onClick={markAllAsRead} className="btn btn-secondary">
            📭 Прочитать все
          </button>
          <button onClick={clearAll} className="btn btn-danger">
            🗑️ Очистить все
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4>Уведомлений нет</h4>
            <p>Все системы работают в штатном режиме</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon" style={{ color: getTypeColor(notification.type) }}>
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                <div className="notification-meta">
                  <span className="server-badge">Сервер: {notification.server}</span>
                  <span className="type-badge" style={{ backgroundColor: getTypeColor(notification.type) }}>
                    {notification.type}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="action-btn read-btn"
                    title="Отметить как прочитанное"
                  >
                    👁️
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="action-btn delete-btn"
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="panel-footer">
        <div className="stats">
          <span>Всего: {notifications.length}</span>
          <span>Не прочитано: {notifications.filter(n => !n.read).length}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
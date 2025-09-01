// Сервис для работы с уведомлениями
class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
    this.nextId = 1;
  }

  // Генератор уведомлений
  generateNotification(server, type, message) {
    const notification = {
      id: this.nextId++,
      serverId: server.id,
      serverName: server.name,
      type,
      message,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(notification);
    this.notifySubscribers();
    
    return notification;
  }

  // Генерация тестовых уведомлений
  generateTestNotifications(servers) {
    const types = ['error', 'warning', 'info'];
    const messages = {
      error: [
        'Критическая ошибка CPU',
        'Перегрев сервера',
        'Сбой дискового массива',
        'Потеря сетевого соединения'
      ],
      warning: [
        'Высокая загрузка памяти',
        'Повышенная температура',
        'Медленное сетевое соединение',
        'Резервное копирование завершено с предупреждениями'
      ],
      info: [
        'Сервер перезагружен',
        'Обновление завершено',
        'Резервное копирование начато',
        'Плановое техническое обслуживание'
      ]
    };

    for (let i = 0; i < 5; i++) {
      const server = servers[Math.floor(Math.random() * servers.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const message = messages[type][Math.floor(Math.random() * messages[type].length)];
      
      this.generateNotification(server, type, message);
    }
  }

  // Получить все уведомления
  getNotifications() {
    return this.notifications;
  }

  // Пометить как прочитанное
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
    }
  }

  // Пометить все как прочитанные
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifySubscribers();
  }

  // Подписка на изменения
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Уведомление подписчиков
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Очистка уведомлений
  clearAll() {
    this.notifications = [];
    this.notifySubscribers();
  }
}

// Создаем и экспортируем экземпляр
const notificationService = new NotificationService();
export default notificationService;
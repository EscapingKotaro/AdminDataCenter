// Сервис для работы с логами
class LoggerService {
  constructor() {
    this.logs = [];
    this.nextId = 1;
  }

  // Добавление лога
  addLog(server, level, message) {
    const log = {
      id: this.nextId++,
      serverId: server.id,
      serverName: server.name,
      level,
      message,
      timestamp: new Date()
    };

    this.logs.unshift(log);
    return log;
  }

  // Генерация тестовых логов
  generateSampleLogs(servers) {
    const levels = ['info', 'warning', 'error', 'debug'];
    const messages = {
      info: [
        'Сервер запущен',
        'Пользователь вошел в систему',
        'Конфигурация загружена',
        'Сетевое соединение установлено'
      ],
      warning: [
        'Высокая загрузка CPU',
        'Мало свободной памяти',
        'Медленный отклик сети',
        'Температура приближается к критической'
      ],
      error: [
        'Ошибка чтения диска',
        'Сбой сетевого интерфейса',
        'Процессор перегрет',
        'Недостаточно памяти'
      ],
      debug: [
        'Отладочная информация',
        'Диагностика завершена',
        'Тестовое соединение',
        'Проверка конфигурации'
      ]
    };

    for (let i = 0; i < 50; i++) {
      const server = servers[Math.floor(Math.random() * servers.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const message = messages[level][Math.floor(Math.random() * messages[level].length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      this.logs.push({
        id: this.nextId++,
        serverId: server.id,
        serverName: server.name,
        level,
        message,
        timestamp
      });
    }
  }

  // Получить логи с фильтрацией
  getLogs(filters = {}) {
    let filteredLogs = this.logs;

    if (filters.serverId) {
      filteredLogs = filteredLogs.filter(log => log.serverId === filters.serverId);
    }

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate);
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        log.serverName.toLowerCase().includes(searchLower)
      );
    }

    return filteredLogs;
  }

  // Генерация отчета
  generateReport(filters = {}) {
    const logs = this.getLogs(filters);
    
    const report = {
      totalLogs: logs.length,
      byLevel: {},
      byServer: {},
      timeRange: {
        start: filters.startDate || new Date(Math.min(...logs.map(l => l.timestamp))),
        end: filters.endDate || new Date(Math.max(...logs.map(l => l.timestamp)))
      }
    };

    logs.forEach(log => {
      report.byLevel[log.level] = (report.byLevel[log.level] || 0) + 1;
      report.byServer[log.serverName] = (report.byServer[log.serverName] || 0) + 1;
    });

    return report;
  }
}

// Создаем и экспортируем экземпляр
const loggerService = new LoggerService();
export default loggerService;
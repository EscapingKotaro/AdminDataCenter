import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем interceptor для JWT токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если refresh тоже невалидный, разлогиниваем
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
};


// Реальные методы для работы с серверами (из БД)
export const serverService = {
  // Основные CRUD операции
  getAll: () => api.get('/servers/'),
  getById: (id) => api.get(`/servers/${id}/`),
  create: (data) => api.post('/servers/', data),
  update: (id, data) => api.put(`/servers/${id}/`, data),
  delete: (id) => api.delete(`/servers/${id}/`),
  
  // Управление сервером
  manage: (serverId, action) => 
    api.post(`/servers/${serverId}/manage/`, { action }),
  
  // Получение истории действий
  getActions: (serverId) => 
    api.get(`/servers/${serverId}/actions/`),
  
  // Статистика посещений (заглушка)
  getVisitorStats: async (serverId, days = 7) => {
    try {
      return await api.get(`/servers/${serverId}/visitor_stats/?days=${days}`);
    } catch (error) {
      console.log('Using demo visitor stats');
      // Заглушка для демонстрации
      return {
        data: [
          {
            timestamp__date: new Date().toISOString().split('T')[0],
            total_visitors: Math.floor(Math.random() * 1000) + 500,
            desktop_visitors: Math.floor(Math.random() * 600) + 300,
            mobile_visitors: Math.floor(Math.random() * 400) + 200,
            avg_cpu: Math.floor(Math.random() * 60) + 20,
            avg_memory: Math.floor(Math.random() * 50) + 30
          }
        ]
      };
    }
  },
  
  // Старые методы для совместимости (заглушки)
  restart: async (id) => {
    console.log('Deprecated: Use manage() instead');
    return { data: { success: true, message: 'Server restart initiated' } };
  }
};

// Сервис мониторинга (заглушки)
export const monitoringService = {
  getLiveMetrics: (serverId) => {
    return {
      cpu_usage: Math.floor(Math.random() * 100),
      memory_usage: Math.floor(Math.random() * 100),
      network_in: Math.floor(Math.random() * 500),
      network_out: Math.floor(Math.random() * 300),
      temperature: Math.floor(Math.random() * 40) + 30,
      timestamp: new Date().toISOString()
    };
  }
};

// Сервис пользователей
export const userService = {
  getProfile: () => api.get('/user/profile/'),
  deposit: (data) => api.post('/user/profile/deposit/', data),
  getTransactions: () => api.get('/user/transactions/')
};

// Сервис биллинга
export const billingService = {
  // Получить текущие настройки
  getSettings: async () => {
    try {
      return await api.get('/billing/settings/current/');
    } catch (error) {
      console.error('Error fetching billing settings:', error);
      // Заглушка с настройками по умолчанию
      return {
        data: {
          cpu_price_per_hour: 0.0025,
          ram_price_per_hour: 0.0010,
          storage_price_per_hour: 0.0005,
          gpu_price_per_hour: 0.0100,
          updated_at: new Date().toISOString()
        }
      };
    }
  },
  
  // Обновить настройки
  updateSettings: async (data) => {
    try {
      return await api.put('/billing/settings/1/', data);
    } catch (error) {
      console.error('Error updating billing settings:', error);
      throw error;
    }
  },
  
  // Частичное обновление
  patchSettings: async (data) => {
    try {
      return await api.patch('/billing/settings/1/', data);
    } catch (error) {
      console.error('Error patching billing settings:', error);
      throw error;
    }
  }
};

// Сервис действий с серверами
export const serverActionsService = {
  getAll: (params) => api.get('/server-actions/', { params }),
  getById: (id) => api.get(`/server-actions/${id}/`),
};

// Заглушки для демонстрации (fallback)
export const demoService = {
  getServers: async () => {
    console.log('Using demo servers data');
    return {
      data: [
        {
          id: 1,
          name: 'Demo Web Server',
          ip_address: '192.168.1.100',
          cpu_cores: 4,
          cpu_frequency: 2.4,
          ram: 16,
          storage: 500,
          status: 'online',
          hourly_rate: 0.45
        },
        {
          id: 2,
          name: 'Demo DB Server',
          ip_address: '192.168.1.101',
          cpu_cores: 8,
          cpu_frequency: 3.2,
          ram: 32,
          storage: 1000,
          status: 'online',
          hourly_rate: 0.85
        }
      ]
    };
  }
};

// Утилиты для работы с API
export const apiUtils = {
  // Проверка доступности API
  checkHealth: async () => {
    try {
      await api.get('/');
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Повторная попытка запроса
  retry: async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiUtils.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }
};

export default api;
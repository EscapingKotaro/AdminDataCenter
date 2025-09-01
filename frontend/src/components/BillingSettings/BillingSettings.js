import React, { useState, useEffect } from 'react';
import { billingService } from '../../services/api';
import { safeParseFloat, safeToFixed } from '../../utils/numbers';
import './BillingSettings.css';

const BillingSettings = () => {
  const [settings, setSettings] = useState({
    cpu_price_per_hour: 0.0025,
    ram_price_per_hour: 0.0010,
    storage_price_per_hour: 0.0005,
    gpu_price_per_hour: 0.0100
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await billingService.getSettings();
      setSettings(response.data);
      setLastUpdated(response.data.updated_at);
    } catch (error) {
      console.error('Error fetching billing settings:', error);
      // Используем значения по умолчанию
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await billingService.updateSettings(settings);
      setLastUpdated(response.data.updated_at);
      
      // Показываем успешное сообщение
      const successMessage = document.createElement('div');
      successMessage.className = 'save-success-message';
      successMessage.innerHTML = '✅ Настройки успешно сохранены!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Показываем сообщение об ошибке
      const errorMessage = document.createElement('div');
      errorMessage.className = 'save-error-message';
      errorMessage.innerHTML = '❌ Ошибка при сохранении настроек';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    const numericValue = safeParseFloat(value);
    setSettings(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleReset = () => {
    if (window.confirm('Вернуть настройки по умолчанию?')) {
      setSettings({
        cpu_price_per_hour: 0.0025,
        ram_price_per_hour: 0.0010,
        storage_price_per_hour: 0.0005,
        gpu_price_per_hour: 0.0100
      });
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Загрузка настроек тарифов...</p>
      </div>
    );
  }

  return (
    <div className="billing-settings">
      <div className="settings-header">
        <h3>⚙️ Настройка тарифов</h3>
        {lastUpdated && (
          <div className="last-updated">
            Обновлено: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
      
      <p className="settings-description">
        Установите цены за использование ресурсов серверов (в USD за час)
      </p>

      <div className="price-grid">
        <div className="price-item">
          <label>💻 Цена за ядро CPU/час:</label>
          <div className="input-group">
            <span className="currency">$</span>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={settings.cpu_price_per_hour}
              onChange={(e) => handleChange('cpu_price_per_hour', e.target.value)}
            />
          </div>
          <div className="price-example">
            Сервер с 8 ядрами: <strong>${(safeParseFloat(settings.cpu_price_per_hour) * 8 * 24).toFixed(2)}/день</strong>
          </div>
        </div>

        <div className="price-item">
          <label>🧠 Цена за GB RAM/час:</label>
          <div className="input-group">
            <span className="currency">$</span>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={settings.ram_price_per_hour}
              onChange={(e) => handleChange('ram_price_per_hour', e.target.value)}
            />
          </div>
          <div className="price-example">
            Сервер с 32GB RAM: <strong>${(safeParseFloat(settings.ram_price_per_hour) * 32 * 24).toFixed(2)}/день</strong>
          </div>
        </div>

        <div className="price-item">
          <label>💾 Цена за GB Storage/час:</label>
          <div className="input-group">
            <span className="currency">$</span>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={settings.storage_price_per_hour}
              onChange={(e) => handleChange('storage_price_per_hour', e.target.value)}
            />
          </div>
          <div className="price-example">
            Сервер с 500GB: <strong>${(safeParseFloat(settings.storage_price_per_hour) * 500 * 24).toFixed(2)}/день</strong>
          </div>
        </div>

        <div className="price-item">
          <label>🎮 Цена за GPU/час:</label>
          <div className="input-group">
            <span className="currency">$</span>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={settings.gpu_price_per_hour}
              onChange={(e) => handleChange('gpu_price_per_hour', e.target.value)}
            />
          </div>
          <div className="price-example">
            Сервер с GPU: <strong>${(safeParseFloat(settings.gpu_price_per_hour) * 24).toFixed(2)}/день</strong>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          onClick={handleReset}
          className="btn btn-secondary"
        >
          🔄 Сбросить
        </button>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? '⏳ Сохранение...' : '💾 Сохранить настройки'}
        </button>
      </div>

      <div className="settings-info">
        <h4>📊 Расчет стоимости сервера</h4>
        <div className="calculation-example">
          <p>Пример: Сервер с 4 ядрами, 16GB RAM, 250GB Storage</p>
          <p>
            <strong>Стоимость в день:</strong> $
            {safeToFixed(
              safeParseFloat(settings.cpu_price_per_hour) * 4 * 24 +
              safeParseFloat(settings.ram_price_per_hour) * 16 * 24 +
              safeParseFloat(settings.storage_price_per_hour) * 250 * 24
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
import React from 'react';
import BillingSettings from '../components/BillingSettings/BillingSettings';
import './BillingSettingsPage.css';

const BillingSettingsPage = () => {
  return (
    <div className="billing-settings-page">
      <div className="page-header">
        <h1>💰 Настройка тарифов</h1>
        <p>Управление ценами на ресурсы серверов</p>
      </div>

      <div className="billing-content">
        <BillingSettings />
      </div>

      <div className="billing-info">
        <h3>📋 Информация о тарифах</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>💡 Как рассчитывается стоимость?</h4>
            <p>Стоимость = (CPU ядра × цена CPU) + (RAM GB × цена RAM) + (Storage GB × цена Storage) + (GPU × цена GPU)</p>
          </div>
          
          <div className="info-card">
            <h4>⏰ Периодичность списаний</h4>
            <p>Списания происходят ежедневно в 00:00 по времени сервера</p>
          </div>
          
          <div className="info-card">
            <h4>📊 Влияние на клиентов</h4>
            <p>Изменения цен применяются к новым серверам сразу, к существующим - с следующего дня</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettingsPage;
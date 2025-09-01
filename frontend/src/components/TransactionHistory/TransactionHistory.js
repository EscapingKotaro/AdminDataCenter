import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Заглушка данных транзакций
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          amount: 50.00,
          type: 'deposit',
          description: 'Пополнение баланса',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          amount: -12.45,
          type: 'daily_charge',
          description: 'Ежедневное списание за сервер Web-01',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 3,
          amount: -8.20,
          type: 'daily_charge',
          description: 'Ежедневное списание за сервер DB-01',
          date: new Date().toISOString(),
          status: 'completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getAmountColor = (amount) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getAmountSign = (amount) => {
    return amount >= 0 ? '+' : '';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return '💳';
      case 'daily_charge': return '⏰';
      case 'server_creation': return '🖥️';
      case 'refund': return '↩️';
      default: return '📝';
    }
  };

  if (loading) {
    return <div className="loading">Загрузка истории транзакций...</div>;
  }

  return (
    <div className="transaction-history">
      <h3>📋 История транзакций</h3>
      
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>📭 Транзакций не найдено</p>
          </div>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {getTypeIcon(transaction.type)}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-description">
                  {transaction.description}
                </div>
                <div className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()} • 
                  {new Date(transaction.date).toLocaleTimeString()}
                </div>
              </div>
              
              <div className={`transaction-amount ${getAmountColor(transaction.amount)}`}>
                {getAmountSign(transaction.amount)}${Math.abs(transaction.amount).toFixed(2)}
              </div>
              
              <div className={`transaction-status status-${transaction.status}`}>
                {transaction.status === 'completed' ? '✅' : '⏳'}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="transactions-summary">
        <div className="summary-item">
          <span>Всего пополнений:</span>
          <span className="summary-value">
            ${transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span>Всего списаний:</span>
          <span className="summary-value">
            ${Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
          </span>
        </div>
        <div className="summary-item total">
          <span>Баланс изменений:</span>
          <span className="summary-value">
            ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
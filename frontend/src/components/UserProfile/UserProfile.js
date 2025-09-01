import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    try {
      await userService.deposit({ amount: parseFloat(depositAmount) });
      setDepositAmount('');
      fetchProfile(); // Обновляем баланс
      alert('Баланс успешно пополнен!');
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Ошибка при пополнении баланса');
    }
  };

  if (loading) return <div className="loading">Загрузка профиля...</div>;
  if (!profile) return <div>Ошибка загрузки профиля</div>;

  return (
    <div className="user-profile">
      <h3>👤 Мой профиль</h3>
      
      <div className="profile-info">
        <div className="info-item">
          <span className="label">Имя пользователя:</span>
          <span className="value">{profile.username}</span>
        </div>
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{profile.email}</span>
        </div>
        <div className="info-item">
          <span className="label">Баланс:</span>
          <span className="value balance">${parseFloat(profile.balance).toFixed(2)}</span>
        </div>
      </div>

      <div className="deposit-section">
        <h4>💳 Пополнить баланс</h4>
        <div className="deposit-form">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Сумма пополнения"
            min="1"
            step="0.01"
          />
          <button onClick={handleDeposit} className="btn-primary">
            Пополнить
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
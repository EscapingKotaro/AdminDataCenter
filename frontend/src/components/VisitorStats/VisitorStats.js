import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './VisitorStats.css';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const VisitorStats = ({ serverId }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); // 'bar' или 'line'

  useEffect(() => {
    setTimeout(() => {
      const demoData = [
        { date: '2024-01-01', desktop: 120, mobile: 80, total: 200 },
        { date: '2024-01-02', desktop: 150, mobile: 100, total: 250 },
        { date: '2024-01-03', desktop: 180, mobile: 120, total: 300 },
        { date: '2024-01-04', desktop: 200, mobile: 150, total: 350 },
        { date: '2024-01-05', desktop: 160, mobile: 140, total: 300 },
      ];
      setStats(demoData);
      setLoading(false);
    }, 1000);
  }, [serverId]);

  // Подготовка данных для графика
  const chartData = {
    labels: stats.map(day => day.date),
    datasets: [
      {
        label: 'Компьютеры',
        data: stats.map(day => day.desktop),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Телефоны',
        data: stats.map(day => day.mobile),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Всего',
        data: stats.map(day => day.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Статистика посещений',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="loading">Загрузка статистики...</div>;
  }

  return (
    <div className="visitor-stats">
      <h3>📊 Статистика посещений</h3>
      
      {/* Переключатель типа графика */}
      <div className="chart-controls">
        <button 
          className={chartType === 'bar' ? 'active' : ''}
          onClick={() => setChartType('bar')}
        >
          Столбчатая диаграмма
        </button>
        <button 
          className={chartType === 'line' ? 'active' : ''}
          onClick={() => setChartType('line')}
        >
          Линейный график
        </button>
      </div>

      {/* График */}
      <div className="chart-container">
        {chartType === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      {/* Сводка */}
      <div className="stats-summary">
        <div className="stat-item">
          <span>Всего посетителей: </span>
          <strong>{stats.reduce((sum, day) => sum + day.total, 0)}</strong>
        </div>
        <div className="stat-item">
          <span>С компьютеров: </span>
          <strong>{stats.reduce((sum, day) => sum + day.desktop, 0)}</strong>
        </div>
        <div className="stat-item">
          <span>С телефонов: </span>
          <strong>{stats.reduce((sum, day) => sum + day.mobile, 0)}</strong>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
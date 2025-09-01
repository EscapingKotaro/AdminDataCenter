import React, { useState, useEffect } from 'react';
import './ServerMetrics.css';

const ServerMetrics = ({ serverId, timeRange }) => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    // Заглушка данных метрик
    const generateMetrics = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now - i * 2 * 60 * 1000); // Каждые 2 минуты
        data.push({
          time: time.toLocaleTimeString(),
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 35) + 45,
          disk: Math.floor(Math.random() * 20) + 15
        });
      }
      
      setMetrics(data);
    };

    generateMetrics();
    const interval = setInterval(generateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, [serverId, timeRange]);

  const getColor = (value) => {
    if (value > 80) return '#ef4444';
    if (value > 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="server-metrics">
      <h3>📊 Метрики производительности</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚡</span>
            <span className="metric-title">CPU Usage</span>
          </div>
          <div className="metric-value" style={{ color: getColor(metrics[metrics.length - 1]?.cpu || 0) }}>
            {metrics[metrics.length - 1]?.cpu || 0}%
          </div>
          <div className="metric-chart">
            {metrics.slice(-15).map((metric, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{
                  height: `${metric.cpu}%`,
                  backgroundColor: getColor(metric.cpu)
                }}
                title={`CPU: ${metric.cpu}% at ${metric.time}`}
              />
            ))}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">💾</span>
            <span className="metric-title">Memory Usage</span>
          </div>
          <div className="metric-value" style={{ color: getColor(metrics[metrics.length - 1]?.memory || 0) }}>
            {metrics[metrics.length - 1]?.memory || 0}%
          </div>
          <div className="metric-chart">
            {metrics.slice(-15).map((metric, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{
                  height: `${metric.memory}%`,
                  backgroundColor: getColor(metric.memory)
                }}
                title={`Memory: ${metric.memory}% at ${metric.time}`}
              />
            ))}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">💿</span>
            <span className="metric-title">Disk Usage</span>
          </div>
          <div className="metric-value" style={{ color: getColor(metrics[metrics.length - 1]?.disk || 0) }}>
            {metrics[metrics.length - 1]?.disk || 0}%
          </div>
          <div className="metric-chart">
            {metrics.slice(-15).map((metric, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{
                  height: `${metric.disk}%`,
                  backgroundColor: getColor(metric.disk)
                }}
                title={`Disk: ${metric.disk}% at ${metric.time}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="metrics-table">
        <h4>История метрик (последние 5 минут)</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Время</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Disk</th>
              </tr>
            </thead>
            <tbody>
              {metrics.slice(-5).map((metric, index) => (
                <tr key={index}>
                  <td>{metric.time}</td>
                  <td>
                    <span style={{ color: getColor(metric.cpu) }}>
                      {metric.cpu}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: getColor(metric.memory) }}>
                      {metric.memory}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: getColor(metric.disk) }}>
                      {metric.disk}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServerMetrics;
import React, { useState, useEffect } from 'react';
import './NetworkMonitor.css';

const NetworkMonitor = ({ serverId, timeRange }) => {
  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    const generateNetworkData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now - i * 2 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString(),
          in: Math.floor(Math.random() * 400) + 100,
          out: Math.floor(Math.random() * 200) + 50
        });
      }
      
      setNetworkData(data);
    };

    generateNetworkData();
    const interval = setInterval(generateNetworkData, 5000);
    
    return () => clearInterval(interval);
  }, [serverId, timeRange]);

  const current = networkData[networkData.length - 1] || { in: 0, out: 0 };

  return (
    <div className="network-monitor">
      <h3>🌐 Сетевая активность</h3>
      
      <div className="network-stats">
        <div className="network-stat">
          <span className="stat-label">Download</span>
          <span className="stat-value">{current.in} Mbps</span>
          <div className="stat-trend">↗️</div>
        </div>
        
        <div className="network-stat">
          <span className="stat-label">Upload</span>
          <span className="stat-value">{current.out} Mbps</span>
          <div className="stat-trend">↘️</div>
        </div>
        
        <div className="network-stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{current.in + current.out} Mbps</span>
          <div className="stat-trend">→</div>
        </div>
      </div>

      <div className="network-chart">
        <div className="chart-title">Трафик за последний час</div>
        <div className="chart-bars">
          {networkData.slice(-12).map((data, index) => (
            <div key={index} className="chart-column">
              <div 
                className="traffic-in" 
                style={{ height: `${data.in / 5}%` }}
                title={`In: ${data.in} Mbps`}
              />
              <div 
                className="traffic-out"
                style={{ height: `${data.out / 5}%` }} 
                title={`Out: ${data.out} Mbps`}
              />
              <div className="time-label">{data.time.slice(0, 5)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
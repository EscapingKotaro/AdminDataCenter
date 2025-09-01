import React, { useState } from 'react';
import './ReportGenerator.css';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'daily', label: '📅 Ежедневный отчет', description: 'Статистика за выбранный день' },
    { value: 'weekly', label: '📊 Еженедельный отчет', description: 'Сводка за неделю' },
    { value: 'monthly', label: '📈 Ежемесячный отчет', description: 'Анализ за месяц' },
    { value: 'performance', label: '⚡ Отчет производительности', description: 'Метрики нагрузки серверов' },
    { value: 'billing', label: '💸 Биллинг отчет', description: 'Финансовая статистика' },
    { value: 'errors', label: '🚨 Отчет об ошибках', description: 'Анализ сбоев и инцидентов' }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Имитация генерации отчета
    setTimeout(() => {
      setIsGenerating(false);
      
      // Заглушка для скачивания
      const blob = new Blob(['Это демо-отчет. В реальной системе здесь был бы реальный отчет.'], 
        { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  return (
    <div className="report-generator">
      <h3>📊 Генерация отчетов</h3>
      
      <div className="report-form">
        <div className="form-section">
          <label>Тип отчета:</label>
          <div className="report-types">
            {reportTypes.map(type => (
              <div
                key={type.value}
                className={`report-type-card ${reportType === type.value ? 'selected' : ''}`}
                onClick={() => setReportType(type.value)}
              >
                <div className="type-icon">{type.label.split(' ')[0]}</div>
                <div className="type-info">
                  <div className="type-title">{type.label.split(' ').slice(1).join(' ')}</div>
                  <div className="type-description">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Период:</label>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
            <span>по</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
          </div>
        </div>

        <div className="form-section">
          <label>Формат:</label>
          <div className="format-selector">
            <label className="format-option">
              <input
                type="radio"
                value="pdf"
                checked={format === 'pdf'}
                onChange={() => setFormat('pdf')}
              />
              <span>📄 PDF</span>
            </label>
            <label className="format-option">
              <input
                type="radio"
                value="csv"
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
              />
              <span>📊 CSV</span>
            </label>
            <label className="format-option">
              <input
                type="radio"
                value="excel"
                checked={format === 'excel'}
                onChange={() => setFormat('excel')}
              />
              <span>📝 Excel</span>
            </label>
          </div>
        </div>

        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="generate-btn"
        >
          {isGenerating ? '⏳ Генерация...' : '🚀 Сгенерировать отчет'}
        </button>
      </div>

      <div className="report-preview">
        <h4>👀 Предпросмотр</h4>
        <div className="preview-content">
          <p>Отчет: {reportTypes.find(t => t.value === reportType)?.label}</p>
          <p>Период: {dateRange.start} - {dateRange.end}</p>
          <p>Формат: {format.toUpperCase()}</p>
          <p className="preview-note">
            В реальной системе здесь отображался бы предпросмотр отчета
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
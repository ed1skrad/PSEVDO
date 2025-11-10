import React, { useState } from 'react';
import axios from 'axios';

const ExportManager = () => {
  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('export.xlsx');
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/export', {
        query,
        fileName
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName || 'export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('Экспорт завершен успешно!');

    } catch (error) {
      const errorMessage = error.response?.data instanceof Blob
        ? await error.response.data.text()
        : error.message;

      setMessage(`Ошибка экспорта: ${errorMessage}`);
    }
  };

  return (
    <div className="export-manager">
      <h3>Экспорт данных</h3>
      <div className="export-form">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите запрос для экспорта результатов"
          rows={5}
        />
        <div className="file-name">
          <label>Имя файла:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <button onClick={handleExport}>Экспортировать в Excel</button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ExportManager;

import React, { useState } from 'react';
import axios from 'axios';

const QueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [queryName, setQueryName] = useState('');
  const [error, setError] = useState('');

  const executeQuery = async () => {
    try {
      const response = await axios.post('/api/queries/execute', { query });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Ошибка выполнения запроса');
      setResults([]);
    }
  };

  const saveQuery = async () => {
    if (!queryName.trim()) {
      alert('Пожалуйста, введите имя для запроса');
      return;
    }
    try {
      await axios.post('/api/queries', {
        name: queryName,
        query
      });
      alert('Запрос сохранен успешно!');
      setQueryName('');
    } catch (err) {
      alert('Ошибка сохранения запроса: ' + err.response?.data);
    }
  };

  return (
    <div className="query-executor">
      <h3>Выполнение запросов</h3>
      <div className="query-input">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите ваш SQL-запрос здесь"
          rows={5}
        />
      </div>
      <div className="query-actions">
        <button onClick={executeQuery}>Выполнить</button>
        <div className="save-query">
          <input
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            placeholder="Имя запроса"
          />
          <button onClick={saveQuery}>Сохранить запрос</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <div className="query-results">
          <h4>Результаты</h4>
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QueryExecutor;

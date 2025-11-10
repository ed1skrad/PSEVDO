import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavedQueries = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    fetchSavedQueries();
  }, []);

  const fetchSavedQueries = async () => {
    try {
      const response = await axios.get('/api/queries');
      setQueries(response.data);
    } catch (error) {
      console.error('Ошибка при получении сохраненных запросов:', error);
    }
  };

  const executeSavedQuery = async (query) => {
    setSelectedQuery(query);
    try {
      const response = await axios.post('/api/queries/execute', { query: query.query });
      setSelectedQuery({
        ...query,
        results: response.data
      });
    } catch (error) {
      setSelectedQuery({
        ...query,
        error: error.response?.data || 'Ошибка выполнения запроса'
      });
    }
  };

  return (
    <div className="saved-queries">
      <h3>Сохраненные запросы</h3>
      <div className="queries-list">
        {queries.map(query => (
          <div key={query.id} className="query-item">
            <h4>{query.name}</h4>
            <p className="query-text">{query.query}</p>
            <button onClick={() => executeSavedQuery(query)}>Выполнить</button>
          </div>
        ))}
      </div>

      {selectedQuery && (
        <div className="query-results">
          <h4>Результаты для: {selectedQuery.name}</h4>
          {selectedQuery.error && (
            <div className="error">{selectedQuery.error}</div>
          )}
          {selectedQuery.results && selectedQuery.results.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(selectedQuery.results[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedQuery.results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !selectedQuery.error && (
            <p>Результаты не найдены</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedQueries;

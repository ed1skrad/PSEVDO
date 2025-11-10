import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lab4Queries = () => {
  const [activeQuery, setActiveQuery] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    return () => source.cancel("Компонент отмонтирован");
  }, []);

  const queries = [
    {
      id: 'unfit',
      name: 'Негодные призывники (Сортировка)',
      endpoint: '/lab4/conscripts/unfit',
      description: 'Получить всех призывников, признанных негодными, отсортированных по фамилии'
    },
    {
      id: 'fit',
      name: 'Призывники с годным осмотром',
      endpoint: '/lab4/conscripts/fit',
      description: 'Получить призывников, прошедших медицинский осмотр с результатом "годен"'
    },
    {
      id: 'unit4',
      name: 'Солдаты в подразделении 4',
      endpoint: '/lab4/military/unit4',
      description: 'Получить всех солдат, служащих в подразделении 4'
    },
    {
      id: 'all-units',
      name: 'Все подразделения с призывниками',
      endpoint: '/lab4/military/all-units',
      description: 'Получить все военные подразделения с их призывниками'
    },
    {
      id: 'medical-fit',
      name: 'Годные призывники',
      endpoint: '/lab4/medical/fit',
      description: 'Получить призывников с результатом медицинского осмотра "годен"'
    },
    {
      id: 'units-sorted',
      name: 'Подразделения, отсортированные по типу',
      endpoint: '/lab4/units/sorted',
      description: 'Получить все военные подразделения, отсортированные по их типу'
    },
    {
      id: 'units-notices',
      name: 'Подразделения и повестки',
      endpoint: '/lab4/units/notices',
      description: 'Получить все военные подразделения с их повестками'
    },
    {
      id: 'notices-2023',
      name: 'Повестки за 2023 год',
      endpoint: '/lab4/notices/2023',
      description: 'Получить все повестки, выданные в 2023 году'
    },
    {
      id: 'all-notices',
      name: 'Все повестки и призывники',
      endpoint: '/lab4/notices/all',
      description: 'Получить все повестки с их получателями-призывниками'
    },
    {
      id: 'completed',
      name: 'Завершенные курсы 2023',
      endpoint: '/lab4/training/completed',
      description: 'Получить все учебные курсы, завершенные в 2023 году'
    },
    {
      id: 'full-info',
      name: 'Курсы с деталями',
      endpoint: '/lab4/training/full-info',
      description: 'Получить учебные курсы с деталями о призывниках и военных подразделениях'
    }
  ];

  const executeQuery = async (query) => {
    const source = axios.CancelToken.source();

    setLoading(true);
    setError(null);
    setActiveQuery(query);

    try {
      const response = await axios.get(`/api/voenkomat${query.endpoint}`, {
        cancelToken: source.token
      });

      let processedData = response.data;

      if (!Array.isArray(processedData)) {
        processedData = processedData ? [processedData] : [];
      }

      setResults(processedData);
    } catch (err) {
      if (!axios.isCancel(err)) {
        const errorData = err.response?.data || {
          error: 'Запрос не выполнен',
          message: err.message,
        };
        setError(errorData);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="lab4-queries">
      <h3>Предопределенные запросы для Лабораторной 4</h3>
      <div className="queries-grid">
        {queries.map((query) => (
          <div
            key={query.id}
            className={`query-card ${activeQuery?.id === query.id ? 'active' : ''}`}
            onClick={() => executeQuery(query)}
          >
            <h4>{query.name}</h4>
            <p>{query.description}</p>
          </div>
        ))}
      </div>

      <div className="query-results">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            Загрузка...
          </div>
        )}

        {error && (
          <div className="error">
            <h4>Ошибка</h4>
            <p>Статус: {error.status || 'Н/Д'}</p>
            <p>Сообщение: {error.message || 'Неизвестная ошибка'}</p>
            {error.path && <p>Путь: {error.path}</p>}
          </div>
        )}

        {!loading && results && (
          <>
            <h4>Результаты для: {activeQuery.name}</h4>
            {results.length === 0 ? (
              <p>Результаты не найдены</p>
            ) : (
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                  {results.map((row, index) => (
  <tr key={`${activeQuery.id}-${index}-${row.id || JSON.stringify(row)}`}>
    {Object.values(row).map((value, i) => (
      <td key={`${activeQuery.id}-${index}-${i}`}>
        {renderValue(value)}
      </td>
    ))}
  </tr>
))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Lab4Queries;

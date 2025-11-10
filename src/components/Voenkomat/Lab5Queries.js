import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lab5Queries = () => {
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
      id: 'examined-2023',
      name: 'Осмотренные в 2023 году',
      endpoint: '/lab5/medical/examined-2023',
      description: 'Получить призывников, прошедших медицинский осмотр в 2023 году'
    },
    {
      id: 'units-above-avg',
      name: 'Подразделения выше среднего',
      endpoint: '/lab5/military/units-above-avg',
      description: 'Получить военные подразделения с количеством призывников выше среднего'
    },
    {
      id: 'notice-no-training',
      name: 'Повестка, но нет обучения',
      endpoint: '/lab5/conscripts/notice-no-training',
      description: 'Получить призывников с повесткой, но без обучения'
    },
    {
      id: 'units-more-3',
      name: 'Подразделения с более чем 3 призывниками',
      endpoint: '/lab5/military/units-more-3',
      description: 'Получить военные подразделения с более чем 3 призывниками'
    },
    {
      id: 'last-notice',
      name: 'Последний получатель повестки',
      endpoint: '/lab5/notices/last',
      description: 'Получить получателя последней повестки'
    },
    {
      id: 'units-with-fit',
      name: 'Подразделения с годными призывниками',
      endpoint: '/lab5/units/with-fit',
      description: 'Получить военные подразделения, в которых есть годные призывники'
    },
    {
      id: 'notice-and-training',
      name: 'Повестка и обучение',
      endpoint: '/lab5/conscripts/notice-and-training',
      description: 'Получить призывников с повесткой и обучением'
    },
    {
      id: 'positive-days',
      name: 'Положительные учебные дни',
      endpoint: '/lab5/training/positive-days',
      description: 'Получить военные подразделения с положительными учебными днями'
    },
    {
      id: 'courses-per-unit',
      name: 'Курсы на подразделение',
      endpoint: '/lab5/training/courses-per-unit',
      description: 'Подсчитать количество завершенных учебных курсов на каждое военное подразделение'
    },
    {
      id: 'total-days',
      name: 'Общее количество учебных дней',
      endpoint: '/lab5/training/total-days',
      description: 'Рассчитать общее количество учебных дней по всем подразделениям'
    },
    {
      id: 'involved',
      name: 'Вовлеченные призывники',
      endpoint: '/lab5/conscripts/involved',
      description: 'Получить призывников, вовлеченных в военные процессы'
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
          status: 500,
          error: 'Запрос не выполнен',
          message: err.message,
          path: query.endpoint
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
    <div className="lab5-queries">
      <h3>Предопределенные запросы для Лабораторной 5</h3>
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

export default Lab5Queries;

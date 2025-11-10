import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const TableViewer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8080/api/get/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Ошибка при получении таблиц:', error);
      setError('Не удалось загрузить список таблиц');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8080/api/tables/${tableName}/rows`);
      setTableData(response.data);

      // Инициализируем newRow с правильными ключами
      if (response.data.length > 0) {
        const sampleRow = response.data[0];
        const initialNewRow = {};
        Object.keys(sampleRow).forEach(key => {
          if (key.toLowerCase() !== 'id') {
            initialNewRow[key] = '';
          }
        });
        setNewRow(initialNewRow);
      } else {
        setNewRow({});
      }
    } catch (error) {
      console.error('Ошибка при получении данных таблицы:', error);
      if (error.response?.status === 403) {
        setError('Доступ запрещен. Недостаточно прав для просмотра этой таблицы.');
      } else {
        setError('Не удалось загрузить данные таблицы');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableName) => {
    if (!isAdmin()) {
      alert('Только администраторы могут удалять таблицы');
      return;
    }

    if (window.confirm(`Вы уверены, что хотите удалить таблицу "${tableName}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/tables/${tableName}`);
        fetchTables();
        if (selectedTable === tableName) {
          setSelectedTable('');
          setTableData([]);
        }
      } catch (error) {
        console.error('Ошибка при удалении таблицы:', error);
        if (error.response?.status === 403) {
          alert('Доступ запрещен. Требуются права администратора.');
        } else {
          alert('Ошибка при удалении таблицы: ' + (error.response?.data || error.message));
        }
      }
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      const rowId = getIdFromRow(row);
      if (!rowId) {
        alert('Не удалось определить идентификатор строки');
        return;
      }

      await axios.delete(`http://localhost:8080/api/tables/${selectedTable}/rows/${rowId}`);
      fetchTableData(selectedTable);
    } catch (error) {
      console.error('Ошибка при удалении строки:', error);
      if (error.response?.status === 403) {
        alert('Доступ запрещен. Требуются права администратора.');
      } else {
        alert('Ошибка при удалении строки: ' + (error.response?.data || error.message));
      }
    }
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    try {
      // Фильтруем пустые значения
      const rowData = Object.fromEntries(
          Object.entries(newRow).filter(([_, value]) => value !== '')
      );

      await axios.post(`http://localhost:8080/api/tables/${selectedTable}/rows`, rowData);
      fetchTableData(selectedTable);

      // Сбрасываем форму
      const resetNewRow = {};
      Object.keys(newRow).forEach(key => {
        resetNewRow[key] = '';
      });
      setNewRow(resetNewRow);
    } catch (error) {
      console.error('Ошибка при добавлении строки:', error);
      alert('Ошибка при добавлении строки: ' + (error.response?.data || error.message));
    }
  };

  const handleUpdateRow = async (e) => {
    e.preventDefault();
    try {
      const rowId = editingRow.id;
      // Удаляем id из данных для обновления
      const { id, ...updateData } = editingRow;

      await axios.patch(`http://localhost:8080/api/tables/${selectedTable}/rows/${rowId}`, updateData);
      setEditingRow(null);
      fetchTableData(selectedTable);
    } catch (error) {
      console.error('Ошибка при обновлении строки:', error);
      alert('Ошибка при обновлении строки: ' + (error.response?.data || error.message));
    }
  };

  const handleEditClick = (row) => {
    const rowId = getIdFromRow(row);
    if (!rowId) {
      alert('Не удалось определить идентификатор строки для редактирования');
      return;
    }

    setEditingRow({
      ...row,
      id: rowId
    });
  };

  const getIdFromRow = (row) => {
    // Ищем поле с идентификатором в разных вариантах написания
    return row.id || row.ID || row.Id || row.iD;
  };

  const handleNewRowChange = (key, value) => {
    setNewRow(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEditingRowChange = (key, value) => {
    setEditingRow(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading && !selectedTable) {
    return (
        <div className="table-viewer">
          <div className="loading">
            <div className="spinner"></div>
            Загрузка таблиц...
          </div>
        </div>
    );
  }

  return (
      <div className="table-viewer">
        <h3>Управление таблицами</h3>

        {error && (
            <div className="error">
              <h4>Ошибка</h4>
              {error}
            </div>
        )}

        <div className="tables-section">
          <h4>Список таблиц</h4>
          <div className="tables-list">
            {tables.map(table => (
                <div key={table} className={`table-item ${selectedTable === table ? 'active' : ''}`}>
              <span
                  className="table-name"
                  onClick={() => setSelectedTable(table)}
              >
                {table}
              </span>
                  {isAdmin() && (
                      <button
                          className="btn-danger"
                          onClick={() => handleDeleteTable(table)}
                      >
                        Удалить
                      </button>
                  )}
                </div>
            ))}
          </div>
        </div>

        {selectedTable && (
            <div className="table-data-section">
              <div className="section-header">
                <h4>Данные таблицы: {selectedTable}</h4>
                {loading && (
                    <div className="loading-inline">
                      <div className="spinner small"></div>
                      Загрузка...
                    </div>
                )}
              </div>

              {tableData.length > 0 ? (
                  <div className="results-table">
                    <table>
                      <thead>
                      <tr>
                        {Object.keys(tableData[0]).map(key => (
                            <th key={key}>{key}</th>
                        ))}
                        <th>Действия</th>
                      </tr>
                      </thead>
                      <tbody>
                      {tableData.map((row, index) => (
                          <tr key={index}>
                            {Object.entries(row).map(([key, value]) => (
                                <td key={key}>
                                  {typeof value === 'object' ? (
                                      <pre>{JSON.stringify(value, null, 2)}</pre>
                                  ) : (
                                      String(value)
                                  )}
                                </td>
                            ))}
                            <td className="actions">
                              <button
                                  className="btn-warning"
                                  onClick={() => handleEditClick(row)}
                              >
                                Редактировать
                              </button>
                              <button
                                  className="btn-danger"
                                  onClick={() => handleDeleteRow(row)}
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                  !loading && <p>Таблица пуста</p>
              )}

              {/* Форма редактирования */}
              {editingRow && (
                  <form onSubmit={handleUpdateRow} className="row-form edit-form">
                    <h5>Редактирование строки</h5>
                    <div className="form-fields">
                      {Object.entries(editingRow)
                          .filter(([key]) => key !== 'id')
                          .map(([key, value]) => (
                              <div key={key} className="form-field">
                                <label>{key}:</label>
                                <input
                                    type="text"
                                    value={value || ''}
                                    onChange={(e) => handleEditingRowChange(key, e.target.value)}
                                    placeholder={`Введите ${key}`}
                                />
                              </div>
                          ))}
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Обновить</button>
                      <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setEditingRow(null)}
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
              )}

              {/* Форма добавления новой строки */}
              {Object.keys(newRow).length > 0 && (
                  <form onSubmit={handleAddRow} className="row-form add-form">
                    <h5>Добавить новую строку</h5>
                    <div className="form-fields">
                      {Object.entries(newRow).map(([key, value]) => (
                          <div key={key} className="form-field">
                            <label>{key}:</label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleNewRowChange(key, e.target.value)}
                                placeholder={`Введите ${key}`}
                            />
                          </div>
                      ))}
                    </div>
                    <button type="submit" className="btn-primary">Добавить строку</button>
                  </form>
              )}
            </div>
        )}
      </div>
  );
};

export default TableViewer;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableViewer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Ошибка при получении таблиц:', error);
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tables/${tableName}/rows`);
      setTableData(response.data);
      if (response.data.length > 0) {
        setNewRow(Object.fromEntries(
          Object.keys(response.data[0]).map(key => [key, ''])
        ));
      }
    } catch (error) {
      console.error('Ошибка при получении данных таблицы:', error);
    }
  };

  const handleDeleteTable = async (tableName) => {
    if (window.confirm(`Вы уверены, что хотите удалить таблицу ${tableName}?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/tables/${tableName}`);
        fetchTables();
        if (selectedTable === tableName) {
          setSelectedTable('');
          setTableData([]);
        }
      } catch (error) {
        console.error('Ошибка при удалении таблицы:', error);
      }
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tables/${selectedTable}/rows/${id}`);
      fetchTableData(selectedTable);
    } catch (error) {
      console.error('Ошибка при удалении строки:', error);
    }
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/tables/${selectedTable}/rows`, newRow);
      fetchTableData(selectedTable);
      setNewRow(Object.fromEntries(
        Object.keys(newRow).map(key => [key, ''])
      ));
    } catch (error) {
      console.error('Ошибка при добавлении строки:', error);
    }
  };

  const handleUpdateRow = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8080/api/tables/${selectedTable}/rows/${editingRow.id}`, editingRow);
      setEditingRow(null);
      fetchTableData(selectedTable);
    } catch (error) {
      console.error('Ошибка при обновлении строки:', error);
    }
  };

  const handleEditClick = async (row) => {
    // Проверяем, есть ли в строке идентификатор
    const rowId = row.id || row.ID || row.Id; // проверяем разные варианты названия поля
    if (!rowId) {
      return;
    }
    
    setEditingRow({
      ...row,
      id: rowId // сохраняем идентификатор под фиксированным именем 'id'
    });
  };

  return (
    <div className="table-viewer">
      <h3>Таблицы</h3>
      <div className="tables-list">
        {tables.map(table => (
          <div key={table} className="table-item">
            <span onClick={() => setSelectedTable(table)}>
              {table}
            </span>
            <button onClick={() => handleDeleteTable(table)}>Удалить</button>
          </div>
        ))}
      </div>

      {selectedTable && (
        <div className="table-data">
          <h4>Данные таблицы {selectedTable}</h4>
          <table>
            <thead>
              <tr>
                {tableData.length > 0 && Object.keys(tableData[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i}>{String(value)}</td>
            ))}
            <td>
              <button onClick={() => handleEditClick(row)}>
                Редактировать
              </button>
              <button onClick={() => handleDeleteRow(row.id || row.ID || row.Id)}>
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
          </table>

          {editingRow ? (
            <form onSubmit={handleUpdateRow} className="row-form">
              <h5>Редактировать строку</h5>
              {Object.entries(editingRow).map(([key, value]) => (
                key !== 'id' && (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => setEditingRow({
                        ...editingRow,
                        [key]: e.target.value
                      })}
                    />
                  </div>
                )
              ))}
              <button type="submit">Обновить</button>
              <button type="button" onClick={() => setEditingRow(null)}>
                Отмена
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddRow} className="row-form">
              <h5>Добавить новую строку</h5>
              {newRow && Object.keys(newRow).map(key => (
                <div key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={newRow[key] || ''}
                    onChange={(e) => setNewRow({
                      ...newRow,
                      [key]: e.target.value
                    })}
                  />
                </div>
              ))}
              <button type="submit">Добавить строку</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TableViewer;

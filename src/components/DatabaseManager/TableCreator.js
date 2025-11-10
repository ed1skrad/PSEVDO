import React, { useState } from 'react';
import axios from 'axios';

const TableCreator = () => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'VARCHAR' }]);

  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: 'VARCHAR' }]);
  };

  const handleRemoveColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tables', {
        tableName,
        columns
      });
      alert('Таблица создана успешно!');
      setTableName('');
      setColumns([{ name: '', type: 'VARCHAR' }]);
    } catch (error) {
      alert('Ошибка создания таблицы: ' + error.response.data);
    }
  };

  return (
    <div className="table-creator">
      <h3>Создание новой таблицы</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя таблицы:</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
          />
        </div>

        <h4>Колонки:</h4>
        {columns.map((column, index) => (
          <div key={index} className="column-row">
            <input
              type="text"
              placeholder="Имя колонки"
              value={column.name}
              onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
              required
            />
            <select
              value={column.type}
              onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
            >
              <option value="VARCHAR">VARCHAR</option>
              <option value="INT">INT</option>
              <option value="DATE">DATE</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="FLOAT">FLOAT</option>
            </select>
            <button type="button" onClick={() => handleRemoveColumn(index)}>
              Удалить
            </button>
          </div>
        ))}

        <div className="buttons">
          <button type="button" onClick={handleAddColumn}>
            Добавить колонку
          </button>
          <button type="submit">Создать таблицу</button>
        </div>
      </form>
    </div>
  );
};

export default TableCreator;

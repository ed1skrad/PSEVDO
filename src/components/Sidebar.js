import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Операции с базой данных</h3>
      <ul>
        <li>Создать таблицу</li>
        <li>Управление таблицами</li>
        <li>Выполнение запросов</li>
        <li>Резервное копирование/Восстановление</li>
        <li>Экспорт данных</li>
      </ul>
    </div>
  );
};

export default Sidebar;

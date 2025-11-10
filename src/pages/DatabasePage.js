import React, { useState } from 'react';
import TableCreator from '../components/DatabaseManager/TableCreator';
import TableViewer from '../components/DatabaseManager/TableViewer';
import QueryExecutor from '../components/DatabaseManager/QueryExecutor';
import BackupManager from '../components/DatabaseManager/BackupManager';
import ExportManager from '../components/DatabaseManager/ExportManager';
import SavedQueries from '../components/DatabaseManager/SavedQueries';

const DatabasePage = () => {
  const [activeTab, setActiveTab] = useState('tables');

  return (
    <div className="database-page">
      <div className="tabs">
        <button
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          Таблицы
        </button>
        <button
          className={activeTab === 'query' ? 'active' : ''}
          onClick={() => setActiveTab('query')}
        >
          Выполнение запросов
        </button>
        <button
          className={activeTab === 'backup' ? 'active' : ''}
          onClick={() => setActiveTab('backup')}
        >
          Резервное копирование
        </button>
        <button
          className={activeTab === 'export' ? 'active' : ''}
          onClick={() => setActiveTab('export')}
        >
          Экспорт
        </button>
        <button
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Сохраненные запросы
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tables' && (
          <>
            <TableCreator />
            <TableViewer />
          </>
        )}
        {activeTab === 'query' && <QueryExecutor />}
        {activeTab === 'backup' && <BackupManager />}
        {activeTab === 'export' && <ExportManager />}
        {activeTab === 'saved' && <SavedQueries />}
      </div>
    </div>
  );
};

export default DatabasePage;

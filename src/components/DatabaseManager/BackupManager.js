import React, { useState } from 'react';
import axios from 'axios';

const BackupManager = () => {
  const [message, setMessage] = useState('');

  const handleBackup = async () => {
    setMessage('Создание резервной копии...');
    try {
      const response = await axios.post('http://localhost:8080/api/backup');
      setMessage(response.data?.message || 'Резервная копия создана успешно!');
    } catch (error) {
      console.error("Ошибка создания резервной копии:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Неизвестная ошибка при создании резервной копии.';
      setMessage('Ошибка создания резервной копии: ' + errorMessage);
    }
  };

  return (
    <div className="backup-manager card p-4 my-3 shadow-sm">
      <h3 className="card-title">Резервное копирование базы данных</h3>
      <p className="card-text text-muted">Создайте резервную копию всей базы данных.</p>
      <button onClick={handleBackup} className="btn btn-primary">
        Создать резервную копию
      </button>
      {message && (
        <div className={`alert mt-3 ${message.startsWith('Ошибка') ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default BackupManager;

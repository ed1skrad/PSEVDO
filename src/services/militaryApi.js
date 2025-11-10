import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Лабораторная 4
const lab4Endpoints = {
  'unfit-conscripts': '/voenkomat/lab4/conscripts/unfit',
  'fit-conscripts': '/voenkomat/lab4/conscripts/fit',
  'unit4-soldiers': '/voenkomat/lab4/military/unit4',
  'all-units': '/voenkomat/lab4/military/all-units',
  'fit-medical': '/voenkomat/lab4/medical/fit',
  'sorted-units': '/voenkomat/lab4/units/sorted',
  'units-notices': '/voenkomat/lab4/units/notices',
  'notices-2023': '/voenkomat/lab4/notices/2023',
  'all-notices': '/voenkomat/lab4/notices/all',
  'completed-courses': '/voenkomat/lab4/training/completed',
  'courses-details': '/voenkomat/lab4/training/full-info'
};

// Лабораторная 5
const lab5Endpoints = {
  'examined-2023': '/voenkomat/lab5/medical/examined-2023',
  'units-above-avg': '/voenkomat/lab5/military/units-above-avg',
  'notice-no-training': '/voenkomat/lab5/conscripts/notice-no-training',
  'units-more-3': '/voenkomat/lab5/military/units-more-3',
  'last-notice': '/voenkomat/lab5/notices/last',
  'units-with-fit': '/voenkomat/lab5/units/with-fit',
  'notice-and-training': '/voenkomat/lab5/conscripts/notice-and-training',
  'positive-days': '/voenkomat/lab5/training/positive-days',
  'courses-per-unit': '/voenkomat/lab5/training/courses-per-unit',
  'total-days': '/voenkomat/lab5/training/total-days',
  'involved-conscripts': '/voenkomat/lab5/conscripts/involved'
};

export const getMilitaryData = async (endpoint) => {
  try {
    // Проверяем, к какой лабораторной относится запрос
    const lab4Path = lab4Endpoints[endpoint];
    const lab5Path = lab5Endpoints[endpoint];
    
    const path = lab4Path || lab5Path;
    if (!path) {
      throw new Error('Неизвестный запрос');
    }

    const response = await API.get(path);
    
    // Преобразуем Object[] в нормальные объекты, если нужно
    if (Array.isArray(response.data) && response.data.length > 0 && Array.isArray(response.data[0])) {
      // Для запросов, возвращающих List<Object[]>
      const columns = response.data[0].map((_, i) => `column${i}`);
      return response.data.map(row => {
        const obj = {};
        row.forEach((val, i) => {
          obj[columns[i]] = val;
        });
        return obj;
      });
    }
    
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || `Ошибка выполнения запроса: ${err.message}`);
  }
};

// Остальные методы остаются без изменений
export const getTableData = async (tableName) => {
  try {
    const response = await API.get(`/tables/${tableName}/rows`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка загрузки данных таблицы');
  }
};

export const updateRow = async (tableName, id, values) => {
  try {
    await API.patch(`/tables/${tableName}/${id}`, values);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка обновления записи');
  }
};

export const deleteRow = async (tableName, id) => {
  try {
    await API.delete(`/tables/${tableName}/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка удаления записи');
  }
};

export const insertRow = async (tableName, values) => {
  try {
    const response = await API.post(`/tables/${tableName}`, values);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка добавления записи');
  }
};

export const executeQuery = async (query) => {
  try {
    const response = await API.post('/queries/execute', { query });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка выполнения запроса');
  }
};

export const saveQuery = async (name, query) => {
  try {
    await API.post('/queries/save', { name, query });
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка сохранения запроса');
  }
};

export const createTable = async (tableData) => {
  try {
    await API.post('/tables/create', tableData);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка создания таблицы');
  }
};

export const deleteTable = async (tableName) => {
  try {
    await API.delete(`/tables/${tableName}`);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка удаления таблицы');
  }
};

export const createBackup = async () => {
  try {
    await API.post('/backup');
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка создания резервной копии');
  }
};

export const exportToExcel = async (query) => {
  try {
    const response = await API.post('/export', { query }, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'military_export.xlsx');
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Ошибка экспорта данных');
  }
};
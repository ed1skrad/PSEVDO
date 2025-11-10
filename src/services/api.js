import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getTaxData = async (endpoint) => {
    try {
        const response = await API.get(`/tax/${endpoint}`);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data || 'Error fetching tax data');
    }
};

export const getTableData = async (tableName) => {
    try {
        const response = await API.get(`/tables/${tableName}/rows`);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data || 'Error loading table data');
    }
};

export const updateRow = async (tableName, id, values) => {
    try {
        await API.patch(`/tables/${tableName}/rows/${id}`, values);
    } catch (err) {
        throw new Error(err.response?.data || 'Error updating row');
    }
};

export const deleteRow = async (tableName, id) => {
    try {
        await API.delete(`/tables/${tableName}/rows/${id}`);
    } catch (err) {
        throw new Error(err.response?.data || 'Error deleting row');
    }
};

export const insertRow = async (tableName, values) => {
    try {
        const response = await API.post(`/tables/${tableName}/rows`, values);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data || 'Error inserting row');
    }
};

import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const sendHealthData = (data) => API.post('/health-data', data);
export const getReports = () => API.get('/reports');

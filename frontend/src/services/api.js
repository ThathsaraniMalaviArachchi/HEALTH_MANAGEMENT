import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const healthLogsAPI = {
    create: async (data) => {
        try {
            const response = await api.post('/health-logs', data);
            return response.data;
        } catch (error) {
            console.error('Error creating health log:', error);
            throw error;
        }
    },
    
    getAll: async () => {
        try {
            const response = await api.get('/health-logs');
            return response.data;
        } catch (error) {
            console.error('Error fetching health logs:', error);
            throw error;
        }
    },
    
    getAdvancedReport: async () => {
        try {
            const response = await api.get('/health-logs/advanced-report');
            return response.data;
        } catch (error) {
            console.error('Error fetching advanced report:', error);
            throw error;
        }
    },
    
    update: async (id, data) => {
        try {
            const response = await api.put(`/health-logs/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating health log:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            const response = await api.delete(`/health-logs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting health log:', error);
            throw error;
        }
    }
};

// Other API services can be added here

export default api;

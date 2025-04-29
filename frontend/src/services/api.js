import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request/response interceptors for debugging
api.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error.response || error);
        throw error;
    }
);

export const healthLogsAPI = {
    create: async (data) => {
        try {
            const response = await api.post('/health-logs', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create health log:', error);
            throw new Error(error.response?.data?.error || 'Failed to save health log');
        }
    },
    
    getAll: async () => {
        try {
            const response = await api.get('/health-logs');
            // Ensure we handle both array and object responses
            return Array.isArray(response.data) ? response.data : 
                   response.data.logs || response.data || [];
        } catch (error) {
            console.error('Error fetching health logs:', error);
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
    },
    
    generateAIReport: async () => {
        try {
            const response = await api.get('/health-logs/generate-report');
            return response.data;
        } catch (error) {
            console.error('Error generating AI report:', error);
            throw error;
        }
    }
};

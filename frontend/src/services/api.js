import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add axios request interceptor to add auth token to all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Also apply auth token to our custom api instance
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const healthLogsAPI = {
    create: async (data) => {
        try {
            const response = await api.post('/health-logs', data, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create health log:', error);
            throw new Error(error.response?.data?.error || 'Failed to save health log');
        }
    },
    
    getAll: async () => {
        try {
            const response = await api.get('/health-logs', {
                headers: getAuthHeader()
            });
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
            const response = await api.put(`/health-logs/${id}`, data, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating health log:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/health-logs/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting health log:', error);
            throw error;
        }
    },
    
    getAIReport: async () => {
        try {
            const response = await api.get('/health-logs/ai-report', {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error generating AI report:', error);
            throw error;
        }
    }
};

export const doctorAPI = {
    // Get all doctors
    getAllDoctors: async () => {
        const response = await axios.get(`${API_URL}/doctors`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get doctor by ID
    getDoctor: async (id) => {
        const response = await axios.get(`${API_URL}/doctors/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Create a new doctor (admin only)
    createDoctor: async (doctorData) => {
        const response = await axios.post(`${API_URL}/doctors`, doctorData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update a doctor (admin only)
    updateDoctor: async (id, doctorData) => {
        const response = await axios.put(`${API_URL}/doctors/${id}`, doctorData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Delete a doctor (admin only)
    deleteDoctor: async (id) => {
        const response = await axios.delete(`${API_URL}/doctors/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const appointmentAPI = {
    // Create a new appointment
    createAppointment: async (appointmentData) => {
        const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get user's appointments
    getUserAppointments: async () => {
        const response = await axios.get(`${API_URL}/appointments/user`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get all appointments (admin only)
    getAllAppointments: async () => {
        const response = await axios.get(`${API_URL}/appointments/all`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update appointment status (admin only)
    updateAppointmentStatus: async (id, status) => {
        const response = await axios.put(`${API_URL}/appointments/${id}/status`, { status }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Cancel appointment
    cancelAppointment: async (id) => {
        const response = await axios.put(`${API_URL}/appointments/${id}/cancel`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export const userAPI = {
    // Get all users (admin only)
    getAllUsers: async () => {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get user by ID (admin only)
    getUser: async (id) => {
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update user (admin only)
    updateUser: async (id, userData) => {
        const response = await axios.put(`${API_URL}/users/${id}`, userData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Delete user (admin only)
    deleteUser: async (id) => {
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling and token management
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh`, null, {
                        headers: { 'Authorization': `Bearer ${refreshToken}` }
                    });
                    const { access_token } = response.data;
                    localStorage.setItem('token', access_token);
                    error.config.headers['Authorization'] = `Bearer ${access_token}`;
                    return axios(error.config);
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const jobsApi = {
    getJobs: async (params) => {
        try {
            const response = await api.get('/jobs/search', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    getJob: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job:', error);
            throw error;
        }
    },

    createJob: async (jobData) => {
        try {
            const response = await api.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    },

    updateJob: async (id, jobData) => {
        try {
            const response = await api.put(`/jobs/${id}`, jobData);
            return response.data;
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    },

    deleteJob: async (id) => {
        try {
            const response = await api.delete(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }
};

export const authApi = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
        }
    }
};

export const companiesApi = {
    getCompanies: async (params) => {
        try {
            const response = await api.get('/companies', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    },

    getCompanyJobs: async (companyId, params) => {
        try {
            const response = await api.get(`/companies/${companyId}/jobs`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching company jobs:', error);
            throw error;
        }
    },

    createCompany: async (companyData) => {
        try {
            const response = await api.post('/companies', companyData);
            return response.data;
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    },

    updateCompany: async (id, companyData) => {
        try {
            const response = await api.put(`/companies/${id}`, companyData);
            return response.data;
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }
};
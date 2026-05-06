import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Increased timeout
    withCredentials: true, // Add this for CORS
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error);
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - server not responding');
        } else if (!error.response) {
            console.error('Network error - backend might be down or CORS issue');
            console.error('Attempted URL:', error.config?.url);
        } else if (error.response) {
            console.error('Server error:', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor (optional - for adding tokens later)
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth tokens here later
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

// Response interceptor (for handling errors globally)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - server not responding');
        } else if (!error.response) {
            console.error('Network error - backend might be down');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
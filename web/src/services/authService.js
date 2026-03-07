import axiosInstance from './axiosConfig';

const authService = {
    // Register user
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'PATIENT'
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                return error.response.data;
            } else if (error.request) {
                // Request made but no response
                return { 
                    success: false, 
                    message: 'Cannot connect to server. Make sure backend is running.' 
                };
            } else {
                // Something else happened
                return { 
                    success: false, 
                    message: 'An error occurred. Please try again.' 
                };
            }
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            
            // If login successful, store user data/token
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
            }
            
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return { 
                    success: false, 
                    message: 'Cannot connect to server. Make sure backend is running on port 8080.' 
                };
            } else {
                return { 
                    success: false, 
                    message: 'An error occurred. Please try again.' 
                };
            }
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token') || !!localStorage.getItem('user');
    }
};

export default authService;
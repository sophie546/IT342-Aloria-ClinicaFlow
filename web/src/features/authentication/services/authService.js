import axiosInstance from '../../../shared/services/axiosConfig';
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

    // Resend verification email
    resendVerificationEmail: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/resend-verification', { email });
            
            // Return the response data directly if it has success property
            if (response.data) {
                return {
                    success: response.data.success || true,
                    message: response.data.message || 'Verification email sent successfully'
                };
            }
            
            return {
                success: true,
                message: 'Verification email sent successfully'
            };
        } catch (error) {
            console.error('Resend verification error:', error);
            
            if (error.response) {
                // Server responded with error
                return {
                    success: false,
                    message: error.response.data?.message || 'Failed to resend verification email'
                };
            } else if (error.request) {
                // Request made but no response
                return {
                    success: false,
                    message: 'Cannot connect to server. Please check your connection.'
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

    // Check email verification status
    checkEmailVerificationStatus: async (email) => {
        try {
            const response = await axiosInstance.get(`/auth/check-verification?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error('Check verification status error:', error);
            
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    success: false,
                    verified: false,
                    message: 'Could not check verification status'
                };
            }
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // Clear refresh token if stored
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get auth token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        // Check if token exists and is not expired (optional)
        if (token && user) {
            try {
                // Optional: Check token expiration if your tokens have expiry
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (tokenData.exp && tokenData.exp < currentTime) {
                    // Token expired
                    authService.logout();
                    return false;
                }
            } catch (e) {
                // Invalid token format
                return !!token;
            }
            return true;
        }
        
        return false;
    },

    // Refresh token (if your backend supports it)
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                return { success: false, message: 'No refresh token available' };
            }
            
            const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
            
            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
                return { success: true, token: response.data.token };
            }
            
            return { success: false, message: 'Failed to refresh token' };
        } catch (error) {
            console.error('Token refresh error:', error);
            authService.logout();
            return { success: false, message: 'Session expired. Please login again.' };
        }
    },

    // Update user profile (optional)
    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/auth/profile', userData);
            
            if (response.data.success && response.data.user) {
                // Update stored user data
                const currentUser = authService.getCurrentUser();
                const updatedUser = { ...currentUser, ...response.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    success: false,
                    message: 'Failed to update profile. Please try again.'
                };
            }
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.post('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    success: false,
                    message: 'Failed to change password. Please try again.'
                };
            }
        }
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    success: false,
                    message: 'Failed to send password reset email. Please try again.'
                };
            }
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    success: false,
                    message: 'Failed to reset password. Please try again.'
                };
            }
        }
    }
};

export default authService;
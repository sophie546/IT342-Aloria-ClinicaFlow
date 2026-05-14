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
                return error.response.data;
            } else if (error.request) {
                return { 
                    success: false, 
                    message: 'Cannot connect to server. Make sure backend is running.' 
                };
            } else {
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

  // Register patient to queue
registerToQueue: async (patientData) => {
    try {
        console.log('=== QUEUE REGISTRATION START ===');
        console.log('Endpoint:', '/patient/register-queue');
        console.log('Data being sent:', {
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            age: parseInt(patientData.age),
            gender: patientData.gender,
            contactNumber: patientData.contactNumber,
            address: patientData.address
        });
        
        const response = await axiosInstance.post('/patient/register-queue', {
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            age: parseInt(patientData.age),
            gender: patientData.gender,
            contactNumber: patientData.contactNumber,
            address: patientData.address
        });
        
        console.log('Response received:', response.data);
        console.log('=== QUEUE REGISTRATION SUCCESS ===');
        return response.data;
        
    } catch (error) {
        console.error('=== QUEUE REGISTRATION ERROR ===');
        console.error('Error details:', error);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
            return error.response.data;
        } else if (error.request) {
            console.error('Request was made but no response received');
            console.error('Request:', error.request);
            return { 
                success: false, 
                message: 'Cannot connect to server. Please make sure the backend is running on port 8080.' 
            };
        } else {
            console.error('Error message:', error.message);
            return { 
                success: false, 
                message: 'An error occurred: ' + error.message 
            };
        }
    }
},

   // Get current queue status
getQueueStatus: async () => {
    try {
        // CHANGE: Use correct endpoint
        const response = await axiosInstance.get('/patient/queue-status');
        return response.data;
    } catch (error) {
        console.error('Queue status error:', error);
        if (error.response) {
            return error.response.data;
        } else {
            return { 
                success: false, 
                message: 'Failed to fetch queue status' 
            };
        }
    }
},

    // Resend verification email
    resendVerificationEmail: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/resend-verification', { email });
            
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
                return {
                    success: false,
                    message: error.response.data?.message || 'Failed to resend verification email'
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Cannot connect to server. Please check your connection.'
                };
            } else {
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
        localStorage.removeItem('refreshToken');
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
        
        if (token && user) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (tokenData.exp && tokenData.exp < currentTime) {
                    authService.logout();
                    return false;
                }
            } catch (e) {
                return !!token;
            }
            return true;
        }
        
        return false;
    },

    // Refresh token
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

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/auth/profile', userData);
            
            if (response.data.success && response.data.user) {
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
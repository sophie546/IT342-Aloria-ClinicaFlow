import API from './api';

export const consultationService = {
    // Get all consultations
    getAllConsultations: async () => {
        try {
            const response = await API.get('/api/consultations/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching consultations:', error);
            return [];
        }
    },

    // Get consultation by ID
    getConsultationById: async (id) => {
        try {
            const response = await API.get(`/api/consultations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching consultation:', error);
            return null;
        }
    },

    // Get consultations by date
    getByDate: async (date) => {
        try {
            const response = await API.get(`/api/consultations/date/${date}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching consultations by date:', error);
            return [];
        }
    },

    // Get consultations by doctor
    getByDoctor: async (doctorName) => {
        try {
            const response = await API.get(`/api/consultations/doctor/${encodeURIComponent(doctorName)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching consultations by doctor:', error);
            return [];
        }
    },

    // Get today's count
    getTodayCount: async () => {
        try {
            const response = await API.get('/api/consultations/today/count');
            return response.data;
        } catch (error) {
            console.error('Error fetching today count:', error);
            return 0;
        }
    },

    // Add new consultation
    addConsultation: async (consultationData) => {
        try {
            const response = await API.post('/api/consultations/add', consultationData);
            return response.data;
        } catch (error) {
            console.error('Error adding consultation:', error);
            throw error;
        }
    },

    // Update consultation
    updateConsultation: async (id, consultationData) => {
        try {
            const response = await API.put(`/api/consultations/update/${id}`, consultationData);
            return response.data;
        } catch (error) {
            console.error('Error updating consultation:', error);
            throw error;
        }
    },

    // Delete consultation
    deleteConsultation: async (id) => {
        try {
            const response = await API.delete(`/api/consultations/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting consultation:', error);
            throw error;
        }
    }
};

export default consultationService;
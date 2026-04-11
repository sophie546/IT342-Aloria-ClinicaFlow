import API from './api';

export const staffService = {
  // Get all users from user_account table
  getAllUsers: async () => {
    try {
      const response = await API.get('/api/medicalstaff/users');
      console.log('✅ Fetched users from user_account:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return [];
    }
  },

  // Get current logged-in user by email
  getCurrentUserByEmail: async (email) => {
    try {
      const response = await API.get(`/api/medicalstaff/user/by-email/${email}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  },
  
  // Get all medical staff (from medical_staff table - for backward compatibility)
  getAllStaff: async () => {
    try {
      const response = await API.get('/api/medicalstaff/all');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
      return [];
    }
  },

  // Get staff by ID
  getStaffById: async (id) => {
    try {
      const response = await API.get(`/api/medicalstaff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching staff ${id}:`, error);
      return null;
    }
  },

  // Update staff
  updateStaff: async (id, staffData) => {
    try {
      const response = await API.put(`/api/medicalstaff/update/${id}`, staffData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating staff ${id}:`, error);
      throw error;
    }
  },

  // Delete staff
  deleteStaff: async (id) => {
    try {
      const response = await API.delete(`/api/medicalstaff/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting staff ${id}:`, error);
      throw error;
    }
  },

  // Add new staff
  addStaff: async (staffData) => {
    try {
      const response = await API.post('/api/medicalstaff/add', staffData);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding staff:', error);
      throw error;
    }
  }
};

export default staffService;
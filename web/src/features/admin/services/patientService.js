import API from '../../../shared/services/api';

export const patientService = {
  // Get ALL patients for records (including completed)
  getAllPatients: async () => {
    try {
      const response = await API.get('/api/patient/all');
      console.log('✅ Fetched all patients for records:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
      return [];
    }
  },

  // Get patient by ID
  getPatientById: async (id) => {
    try {
      const response = await API.get(`/api/patient/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching patient ${id}:`, error);
      return null;
    }
  },

  // Create new patient
  createPatient: async (patientData) => {
    try {
      const formattedData = {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        contactNumber: patientData.contactNumber,
        address: patientData.address
      };
      
      const response = await API.post('/api/patient/register-queue', formattedData);
      console.log('✅ Created patient:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    try {
      const formattedData = {
        fname: patientData.firstName,
        lname: patientData.lastName,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        address: patientData.address,
        contactNo: patientData.contactNumber
      };
      
      const response = await API.put(`/api/patient/${id}`, formattedData);
      console.log('✅ Updated patient:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating patient ${id}:`, error);
      throw error;
    }
  },

  // Permanently delete patient (use with caution)
  deletePatient: async (id) => {
    try {
      const response = await API.delete(`/api/patient/${id}/permanent`);
      console.log('✅ Permanently deleted patient:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting patient ${id}:`, error);
      throw error;
    }
  }
};

export default patientService;
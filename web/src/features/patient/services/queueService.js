import API from '../../../shared/services/api';

export const queueService = {
  // Get all patients in queue (only waiting and consulting)
  getQueue: async () => {
    try {
      const response = await API.get('/api/patient/queue');
      console.log('✅ Fetched queue:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching queue:', error);
      throw error;
    }
  },

  // Get queue status (stats)
  getQueueStatus: async () => {
    try {
      const response = await API.get('/api/patient/queue-status');
      console.log('✅ Fetched queue status:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching queue status:', error);
      throw error;
    }
  },

  // Update patient in queue
  updatePatient: async (patientId, patientData) => {
    try {
      const response = await API.put(`/api/patient/${patientId}`, patientData);
      console.log('✅ Updated patient:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating patient:', error);
      throw error;
    }
  },

  // DELETE FROM QUEUE ONLY - Change status to 'completed' instead of actual delete
  deletePatient: async (patientId) => {
    try {
      // Instead of deleting, update status to 'completed'
      // This removes them from the active queue but keeps in records
      const response = await API.patch(`/api/patient/${patientId}/status`, {
        status: 'completed'
      });
      console.log('✅ Patient removed from queue (status: completed):', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing patient from queue:', error);
      throw error;
    }
  },

  // ✅ ADD THIS NEW FUNCTION - PERMANENTLY DELETE PATIENT
  permanentlyDeletePatient: async (patientId) => {
    try {
      // This actually deletes the patient from the database
      const response = await API.delete(`/api/patient/${patientId}/permanent`);
      console.log('✅ Patient permanently deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error permanently deleting patient:', error);
      throw error;
    }
  },

  // Add patient to queue
  addPatient: async (patientData) => {
    try {
      const response = await API.post('/api/patient/add', patientData);
      console.log('✅ Added patient:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding patient:', error);
      throw error;
    }
  },

  // Update patient status
  updatePatientStatus: async (patientId, status, assignedDoctor = null) => {
    try {
      const response = await API.patch(`/api/patient/${patientId}/status`, {
        status,
        assignedDoctor
      });
      console.log('✅ Updated patient status:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating patient status:', error);
      throw error;
    }
  }
};

export default queueService;
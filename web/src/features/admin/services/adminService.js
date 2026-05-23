import API from '../../../shared/services/api';

export const adminService = {
  getDashboardStats: async () => {
    const [staff, patients, consultations] = await Promise.all([
      API.get('/api/medicalstaff/all'),
      API.get('/api/patients/all'),
      API.get('/api/consultations/all'),
    ]);
    
    return {
      totalStaff: staff.data?.length || 0,
      totalPatients: patients.data?.length || 0,
      totalConsultations: consultations.data?.length || 0,
    };
  },
};
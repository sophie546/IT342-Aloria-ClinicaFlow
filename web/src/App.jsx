import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/authentication/pages/Login';
import Register from './features/authentication/pages/Register';
import LandingPage from './features/authentication/pages/LandingPage';
import OAuth2Redirect from './features/authentication/pages/OAuth2Redirect';
import PatientQueue from './features/staff/pages/PatientQueue'; 
import Patients from './features/staff/pages/Patients';
import MedicalStaff from './features/staff/pages/MedicalStaff';
import Appointment from './features/patient/pages/Appointment';
import MedicalHistory from './features/patient/pages/MedicalHistory';
import PatientWaitingForm from './features/patient/pages/PatientWaitingForm';
import ProtectedRoute from './features/authentication/components/ProtectedRoute';
import AccountSettings from './features/account/pages/AccountSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient-waiting" element={<PatientWaitingForm />} /> 
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        
        {/* Protected Routes */}
        <Route path="/patient-queue" element={
          <ProtectedRoute>
            <PatientQueue />
          </ProtectedRoute>
        } />
        
        <Route path="/patients" element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        } />
        
        <Route path="/medical-staff" element={
          <ProtectedRoute>
            <MedicalStaff />
          </ProtectedRoute>
        } />
        
        <Route path="/appointment" element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />
        
        <Route path="/medical-history" element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
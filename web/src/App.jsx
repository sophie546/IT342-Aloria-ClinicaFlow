import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import OAuth2Redirect from './pages/OAuth2Redirect';
import Dashboard from './pages/Dashboard';
import PatientQueue from './pages/PatientQueue'; 
import Patients from './pages/Patients';
import MedicalStaff from './pages/MedicalStaff';
import Appointment from './pages/Appointment';
import MedicalHistory from './pages/MedicalHistory';
import PatientWaitingForm from './pages/PatientWaitingForm'; // ← updated
import ProtectedRoute from './components/ProtectedRoute';
import AccountSettings from './pages/AccountSettings';

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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
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
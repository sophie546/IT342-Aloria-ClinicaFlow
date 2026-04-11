import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';  // ADD THIS IMPORT
import OAuth2Redirect from './pages/OAuth2Redirect';
import Dashboard from './pages/Dashboard';
import PatientQueue from './pages/PatientQueue'; 
import Patients from './pages/Patients';
import MedicalStaff from './pages/MedicalStaff';
import Appointment from './pages/Appointment';
import MedicalHistory from './pages/MedicalHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />  {/* Landing page first */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Patient Queue Route */}
        <Route path="/patient-queue" element={
          <ProtectedRoute>
            <PatientQueue />
          </ProtectedRoute>
        } />
        
        {/* Patients Route */}
        <Route path="/patients" element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        } />
        
        {/* Medical Staff Route */}
        <Route path="/medical-staff" element={
          <ProtectedRoute>
            <MedicalStaff />
          </ProtectedRoute>
        } />
        
        {/* Appointment Route */}
        <Route path="/appointment" element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />
        
        {/* Medical History Route */}
        <Route path="/medical-history" element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
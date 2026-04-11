import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        
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
        
        {/* CHANGE THIS - redirect to patient-queue instead of login */}
        <Route path="/" element={<Navigate to="/patient-queue" replace />} />
        <Route path="*" element={<Navigate to="/patient-queue" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
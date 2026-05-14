import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute check - Token:', !!token, 'User:', !!user);
  
  if (!token || !user) {
    console.log('Redirecting to login...');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute;
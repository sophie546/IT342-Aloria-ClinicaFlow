import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Double-check authentication
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Invalid user data');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #1e0a4e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#1e0a4e' }}>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Welcome, {user.firstName} {user.lastName}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Provider:</strong> {user.provider}</p>
        {user.picture && (
          <img 
            src={user.picture} 
            alt="Profile" 
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginTop: '10px'
            }}
          />
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '20px',
          borderRadius: '8px',
          cursor: 'pointer'
        }} onClick={() => navigate('/patients')}>
          <h3>Patients</h3>
          <p>Manage patient records</p>
        </div>
        
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '20px',
          borderRadius: '8px',
          cursor: 'pointer'
        }} onClick={() => navigate('/appointments')}>
          <h3>Appointments</h3>
          <p>Schedule and view appointments</p>
        </div>
        
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '20px',
          borderRadius: '8px',
          cursor: 'pointer'
        }} onClick={() => navigate('/profile')}>
          <h3>Profile</h3>
          <p>View and edit your profile</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
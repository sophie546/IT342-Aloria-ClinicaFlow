import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Call your backend to get user data and token
        const response = await axios.get('http://localhost:8080/api/auth/oauth2/success', {
          withCredentials: true
        });
        
        if (response.data.success) {
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // CHANGE THIS - redirect to patient-queue instead of dashboard
          navigate('/patient-queue');
        } else {
          navigate('/login?error=true');
        }
      } catch (error) {
        console.error('OAuth2 login failed:', error);
        navigate('/login?error=true');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{ 
          color: '#1e0a4e', 
          marginBottom: '20px',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          Completing Login
        </h2>
        
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '0.95rem'
        }}>
          Please wait while we redirect you to the patient queue...
        </p>
        
        <div style={{
          width: '50px',
          height: '50px',
          margin: '0 auto',
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
    </div>
  );
};

export default OAuth2Redirect;
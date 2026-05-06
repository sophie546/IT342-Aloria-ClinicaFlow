// src/features/authentication/pages/OAuth2Redirect.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuth2Redirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        console.log('OAuth2Redirect: Processing...');
        
        // Check for token in URL
        const params = new URLSearchParams(location.search);
        const urlToken = params.get('token');
        if (urlToken) {
          localStorage.setItem('token', urlToken);
        }

        // Call your existing /oauth2/success endpoint
        const response = await fetch('http://localhost:8080/api/auth/oauth2/success', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('OAuth success response:', data);
          
          if (data.success) {
            // Store token
            const tokenToStore = data.token || urlToken;
            if (tokenToStore) {
              localStorage.setItem('token', tokenToStore);
              console.log('✅ Token stored in localStorage');
            } else {
              console.warn('⚠️ No token found in response');
            }
            
            // Store user data - make sure it has the expected fields for your Sidebar
            if (data.user) {
              // Your Sidebar expects fields like firstName, lastName, role
              const userData = {
                accountID: data.user.accountID,
                firstName: data.user.firstName || data.user.first_name || '',
                lastName: data.user.lastName || data.user.last_name || '',
                email: data.user.email,
                role: data.user.role || 'STAFF',
                picture: data.user.picture || '',
                emailVerified: data.user.emailVerified || false
              };
              localStorage.setItem('user', JSON.stringify(userData));
              console.log('✅ User data stored in localStorage:', userData);
            } else if (data.data) {
              // Alternative response format
              localStorage.setItem('user', JSON.stringify(data.data));
              console.log('✅ User data stored from data field:', data.data);
            }
            
            // Verify storage worked
            const verifyToken = localStorage.getItem('token');
            const verifyUser = localStorage.getItem('user');
            console.log('Verification - Token exists:', !!verifyToken);
            console.log('Verification - User exists:', !!verifyUser);
            
            // Redirect to dashboard
            console.log('Redirecting to /patient-queue...');
            navigate('/patient-queue');
          } else {
            setError(data.message || 'Login failed');
            setTimeout(() => navigate('/login?error=' + encodeURIComponent(data.message)), 2000);
          }
        } else {
          console.error('Failed to get user data, status:', response.status);
          setError('Could not retrieve user information.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('OAuth Redirect Error:', err);
        setError('Connection error.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleOAuthRedirect();
  }, [navigate, location]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{
        width: 50,
        height: 50,
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #190051',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px auto'
      }} />
      <h2>Completing Login...</h2>
      <p>Please wait while we redirect you to your dashboard.</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OAuth2Redirect;
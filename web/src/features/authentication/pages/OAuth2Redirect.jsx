// src/features/authentication/pages/OAuth2Redirect.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// List of staff/doctor emails (add all staff emails here)
const STAFF_EMAILS = [
  'sophie.aloria@gmail.com',
  'doctor@example.com',
  'nurse@example.com'
  // Add more staff emails as needed
];

function OAuth2Redirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  // Function to sync staff member
  const syncStaffMember = async (token, email, firstName, lastName) => {
    try {
      console.log('🔄 Syncing staff member...');
      const response = await fetch('http://localhost:8080/api/medicalstaff/sync-from-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sync result:', data);
        return true;
      } else {
        console.warn('⚠️ Sync failed with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      return false;
    }
  };

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        console.log('OAuth2Redirect: Processing...');
        
        // Parse URL parameters from the redirect
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const name = params.get('name');
        const picture = params.get('picture');
        
        console.log('Token from URL:', token ? `Present (${token.length} chars)` : 'Missing');
        console.log('Email from URL:', email);
        console.log('Name from URL:', name);
        
        // Check if we have a token directly in URL
        if (token && token !== 'null' && token.length > 10) {
          // Store token directly
          localStorage.setItem('token', token);
          console.log('✅ Token stored in localStorage from URL');
          
          // Determine role based on email
          const isStaff = STAFF_EMAILS.includes(email);
          const role = isStaff ? 'DOCTOR' : 'PATIENT';
          console.log('Assigned role:', role);
          
          // Create user data from URL parameters
          const userData = {
            accountID: 1,
            firstName: name ? name.split(' ')[0] : email?.split('@')[0] || 'User',
            lastName: name ? name.split(' ').slice(1).join(' ') : '',
            email: email || '',
            role: role,
            picture: picture || '',
            emailVerified: true
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('✅ User data stored in localStorage:', userData);
          
          // If staff/doctor, sync to medical_staff
          if (isStaff) {
            console.log('👨‍⚕️ Staff/Doctor detected, syncing staff record...');
            await syncStaffMember(token, email, userData.firstName, userData.lastName);
          }
          
          // Verify storage worked
          const verifyToken = localStorage.getItem('token');
          const verifyUser = localStorage.getItem('user');
          console.log('Verification - Token exists:', !!verifyToken);
          console.log('Verification - User exists:', !!verifyUser);
          
          // Redirect based on role
          console.log(`Redirecting to ${role === 'DOCTOR' ? '/patient-queue' : '/patient-waiting'}...`);
          setTimeout(() => {
            if (role === 'DOCTOR') {
              navigate('/patient-queue');
            } else {
              navigate('/patient-waiting');
            }
          }, 1000);
        } else {
          // No token in URL, try to fetch from backend
          console.log('No token in URL, trying backend endpoint...');
          
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
              const tokenToStore = data.token;
              if (tokenToStore) {
                localStorage.setItem('token', tokenToStore);
                console.log('✅ Token stored in localStorage');
              }
              
              let userRole = 'PATIENT';
              let userEmail = '';
              
              if (data.user) {
                userEmail = data.user.email;
                userRole = STAFF_EMAILS.includes(userEmail) ? 'DOCTOR' : 'PATIENT';
                
                const userData = {
                  accountID: data.user.accountID,
                  firstName: data.user.firstName || data.user.first_name || '',
                  lastName: data.user.lastName || data.user.last_name || '',
                  email: userEmail,
                  role: userRole,
                  picture: data.user.picture || '',
                  emailVerified: data.user.emailVerified || false
                };
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ User data stored:', userData);
              }
              
              // Sync staff if DOCTOR
              if (userRole === 'DOCTOR' && tokenToStore) {
                console.log('👨‍⚕️ Staff/Doctor detected, syncing staff record...');
                await syncStaffMember(tokenToStore, userEmail, data.user?.firstName, data.user?.lastName);
              }
              
              setTimeout(() => {
                if (userRole === 'DOCTOR') {
                  navigate('/patient-queue');
                } else {
                  navigate('/patient-waiting');
                }
              }, 1000);
            } else {
              setError(data.message || 'Login failed');
              setTimeout(() => navigate('/login?error=' + encodeURIComponent(data.message)), 2000);
            }
          } else {
            console.error('Failed to get user data, status:', response.status);
            setError('Could not retrieve user information.');
            setTimeout(() => navigate('/login'), 2000);
          }
        }
      } catch (err) {
        console.error('OAuth Redirect Error:', err);
        setError('Connection error: ' + err.message);
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
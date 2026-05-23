import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../../shared/assets/logo.png";
import API from "../../../shared/services/api";

const adminMenuItems = [
  {
    text: 'Staff Management',
    path: '/admin/staff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  {
    text: 'Patient Management',
    path: '/admin/patients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    text: 'Medical History',
    path: '/admin/history',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRotating, setIsRotating] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          const userData = JSON.parse(storedUser);
          setAdmin(userData);
          
          if (userData.email) {
            const token = localStorage.getItem('token');
            if (token) {
              try {
                const response = await API.get(`/api/medicalstaff/user/by-email/${userData.email}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data && response.data.photo) {
                  setPhotoUrl(response.data.photo);
                } else if (userData.photo) {
                  setPhotoUrl(userData.photo);
                }
              } catch (error) {
                if (userData.photo) setPhotoUrl(userData.photo);
              }
            } else if (userData.photo) {
              setPhotoUrl(userData.photo);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching admin:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = () => {
    if (!admin) return 'AD';
    const firstName = admin.firstName || admin.first_name || '';
    const lastName = admin.lastName || admin.last_name || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return 'AD';
  };

  const getDisplayName = () => {
    if (!admin) return 'Admin User';
    const firstName = admin.firstName || admin.first_name || '';
    const lastName = admin.lastName || admin.last_name || '';
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return admin.email?.split('@')[0] || 'Admin';
  };

  if (loading) {
    return (
      <div style={{
        width: 281,
        minWidth: 281,
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0220 0%, #190051 50%, #0a0220 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#fff' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 281,
        minWidth: 281,
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0220 0%, #190051 50%, #0a0220 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif",
        position: 'sticky',
        top: 0,
        boxShadow: '4px 0 12px rgba(0,0,0,0.25)',
        flexShrink: 0,
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          height: 107,
          padding: '0 27px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <img src={logo} alt="ClinicaFlow Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: '24px' }}>
              ClinicaFlow
            </div>
            <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Admin Nav Items - Only 3 items now */}
      <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {adminMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.text}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                height: 51,
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 15px',
                background: isActive 
                  ? 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)'
                  : 'transparent',
                color: isActive ? '#190051' : 'rgba(255,255,255,0.85)',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.text}</span>
              {isActive && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Profile & Logout */}
      <div style={{ padding: '0 16px 24px' }}>
        <div
          style={{
            width: '100%',
            height: 77,
            background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            padding: '0 23px',
            gap: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              backgroundColor: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials()
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#190051' }}>{getDisplayName()}</div>
            <div style={{ fontSize: 10, fontWeight: 400, color: 'rgba(25,0,81,0.65)', marginTop: 2 }}>Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: '#190051',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(25,0,81,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
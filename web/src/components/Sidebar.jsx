import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path based on where your logo.png is located
import { staffService } from '../services/staffService';

const menuItems = [
  {
    text: 'Patient Queue',
    path: '/patient-queue',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
      </svg>
    ),
  },
  {
    text: 'Patients',
    path: '/patients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  {
    text: 'Medical Staff',
    path: '/medical-staff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  {
    text: 'Appointments',
    path: '/appointment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
      </svg>
    ),
  },
  {
    text: 'Medical History',
    path: '/medical-history',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRotating, setIsRotating] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage or backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try to fetch from backend
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const users = await staffService.getAllUsers();
          const currentUser = users.find(u => u.email === session.user.email);
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const handleSettingsClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    // Add your settings logic here
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return 'GU';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Guest User';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return user.email?.split('@')[0] || 'User';
  };

  // Get role display
  const getRoleDisplay = () => {
    if (!user) return 'User';
    const role = user.role || '';
    if (role === 'DOCTOR') return 'Doctor';
    if (role === 'Doctor') return 'Doctor';
    if (role === 'doctor') return 'Doctor';
    if (role === 'NURSE') return 'Nurse';
    if (role === 'Nurse') return 'Nurse';
    if (role === 'nurse') return 'Nurse';
    return role || 'Staff Member';
  };

  // Get role color
  const getRoleColor = () => {
    const role = user?.role?.toLowerCase() || '';
    if (role === 'doctor') return '#667eea';
    if (role === 'nurse') return '#10b981';
    return '#190051';
  };

  if (loading) {
    return (
      <div
        style={{
          width: 281,
          minWidth: 281,
          height: '100vh',
          background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 50%, #190051 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
        background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 50%, #190051 100%)',
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
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img 
              src={logo} 
              alt="ClinicaFlow Logo" 
              style={{
                width: '80%',
                height: '80%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
            />
          </div>
          <div>
            <div style={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: 20, 
              fontWeight: 700, 
              color: '#fff', 
              lineHeight: '24px',
              transition: 'transform 0.3s ease',
            }}>
              ClinicaFlow
            </div>
            <div style={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: 11, 
              fontWeight: 400, 
              color: 'rgba(255,255,255,0.7)', 
              lineHeight: '16px', 
              marginTop: 2,
            }}>
              Medical Management
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems.map((item) => {
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
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'translateX(0)' : 'translateX(0)',
                position: 'relative',
                overflow: 'hidden',
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
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexShrink: 0,
                transition: 'transform 0.2s ease',
              }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.text}</span>
              {isActive && (
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  style={{
                    animation: 'slideIn 0.3s ease',
                  }}
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Card - Dynamically shows logged-in user */}
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
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              backgroundColor: getRoleColor(),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Poppins', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {getInitials()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: '#190051', lineHeight: '16px' }}>
              {getDisplayName()}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '14px', marginTop: 2 }}>
              {getRoleDisplay()}
            </div>
          </div>
          <button
            onClick={handleSettingsClick}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 8, 
              color: '#190051', 
              display: 'flex', 
              alignItems: 'center',
              borderRadius: 8,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(25,0,81,0.1)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <svg 
              width="17" 
              height="17" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{
                transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transform: isRotating ? 'rotate(360deg)' : 'rotate(0deg)',
              }}
            >
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/background.png';
import doctorImg from '../assets/doctor.png';
import authService from '../services/authService'; // Import the auth service

function Login() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Google Login Loading State
  const [googleLoading, setGoogleLoading] = useState(false);

  // Fade transition
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const goTo = (path) => {
    setVisible(false);
    setTimeout(() => navigate(path), 350);
  };

  // Email validation
  const validateEmail = (email) => {
    if (!email || email.trim() === '') return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password || password.trim() === '') return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateField = (field, value) => {
    switch(field) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setLoginError('');
    setLoginSuccess(false);
    
    const value = field === 'email' ? email : password;
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    
    setLoginError('');
    setLoginSuccess(false);
    
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setLoginError('');
    setLoginSuccess(false);
    
    setTouched({ email: true, password: true });
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await authService.login({
          email: email,
          password: password
        });
        
        if (response.success) {
          setLoginSuccess(true);
          setSuccessMessage('Login successful! Redirecting to dashboard...');
          setShowSuccessModal(true);
          
          setTimeout(() => {
            setShowSuccessModal(false);
            goTo('/patient-queue');
          }, 2000);
        } else {
          setLoginError(response.message || 'Invalid email or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.message === 'Network Error') {
          setLoginError('Cannot connect to server. Please make sure the backend is running.');
        } else if (error.response) {
          setLoginError(error.response.data?.message || 'Server error occurred');
        } else {
          setLoginError('An error occurred during login. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // Forgot Password Handlers
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setResetEmail('');
    setResetError('');
    setResetSuccess('');
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess('');
  };

  const validateResetEmail = () => {
    if (!resetEmail || resetEmail.trim() === '') {
      setResetError('Email is required');
      return false;
    }
    
    const emailError = validateEmail(resetEmail);
    if (emailError) {
      setResetError(emailError);
      return false;
    }
    
    return true;
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    setResetError('');
    setResetSuccess('');
    
    if (!validateResetEmail()) {
      return;
    }
    
    setResetLoading(true);
    
    try {
      // Simulate API call - replace with actual authService.forgotPassword when available
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResetSuccess('Password reset link has been sent to your email!');
      
      setTimeout(() => {
        handleCloseForgotPassword();
      }, 3000);
    } catch (error) {
      setResetError('An error occurred. Please try again later.');
    } finally {
      setResetLoading(false);
    }
  };

  const getFieldBorderColor = (field) => {
    const value = field === 'email' ? email : password;
    if ((touched[field] || formSubmitted) && errors[field]) return '#ff4444';
    if ((touched[field] || formSubmitted) && !errors[field] && value) return '#00C851';
    return '#ddd';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
      backgroundColor: '#f5f5f5',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease'
    }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '42%',
        minHeight: '100vh',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: '120%',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 2.5rem 2.5rem',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.65rem',
          color: 'white',
          fontWeight: '700',
          fontSize: '1.75rem',
          marginBottom: '2.5rem',
          zIndex: 2
        }}>
          <svg width="38" height="27" viewBox="0 0 28 20" fill="none">
            <polyline points="0,10 5,10 7,2 10,18 13,6 16,14 18,10 28,10"
              stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          </svg>
          ClinicaFlow
        </div>

        {/* Doctor card */}
        <div style={{
          width: '400px', height: '469px',
          background: 'linear-gradient(to bottom, #190051, #FFFFFF)',
          borderRadius: '50px',
          position: 'relative', overflow: 'visible', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          marginTop: '55px', paddingBottom: '1.25rem'
        }}>
          {/* Callout left */}
          <div style={{
            position: 'absolute', top: '55px', left: '-70px',
            backgroundColor: '#E1DCED', borderRadius: '10px',
            width: '173px', height: '66px',
            display: 'flex', alignItems: 'center',
            fontSize: '0.58rem', color: '#444', lineHeight: '1.5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.13)', zIndex: 5, padding: '0 0.75rem'
          }}>
            Our system simplifies patient registration, queue management, and consultation tracking.
          </div>

          {/* Callout right */}
          <div style={{
            position: 'absolute', top: '150px', right: '-95px',
            backgroundColor: '#E1DCED', borderRadius: '10px',
            width: '173px', height: '66px',
            display: 'flex', alignItems: 'center',
            fontSize: '0.58rem', color: '#444', lineHeight: '1.5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.13)', zIndex: 5, padding: '0 0.75rem'
          }}>
            Our system simplifies patient registration, queue management, and consultation tracking.
          </div>

          {/* Doctor image */}
          <img src={doctorImg} alt="Doctor" style={{
            width: '80%', objectFit: 'contain', objectPosition: 'center top',
            display: 'block', position: 'absolute', left: '50%',
            transform: 'translateX(-50%)', top: '-55px', bottom: '2.5rem',
            height: 'calc(100% + 10px)', zIndex: 3
          }} />

          {/* Bottom info */}
          <p style={{
            fontSize: '0.62rem', color: '#2e2c2c', textAlign: 'center',
            margin: '0 1.2rem', lineHeight: 1.4, position: 'relative', zIndex: 4
          }}>
            We are dedicated to helping clinics operate more efficiently
          </p>
        </div>

        {/* Bottom tagline */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', color: 'white', zIndex: 2 }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', marginBottom: '0.6rem', lineHeight: 1.25 }}>
            Digital Health Management<br />Made Simple
          </h2>
          <p style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.6 }}>
            Easily manage patient records, queues, and<br />
            consultations — all in one place.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '58%', backgroundColor: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '3rem 4rem', position: 'relative'
      }}>

        {/* Sign up top right */}
        <div style={{
          position: 'absolute', top: '2rem', right: '2.5rem',
          fontSize: '0.88rem', color: '#777',
          display: 'flex', alignItems: 'center', gap: '0.3rem'
        }}>
          sign up
          <button onClick={() => goTo('/register')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#1e0a4e', fontWeight: '700', fontSize: '1rem',
            fontFamily: "'Zen Kaku Gothic Antique', sans-serif", padding: 0
          }}>→</button>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>

          <h1 style={{
            fontSize: '1.9rem', fontWeight: '900', color: '#1e0a4e',
            lineHeight: 1.3, marginBottom: '2.25rem',
            textAlign: 'center', letterSpacing: '-0.01em'
          }}>
            Welcome Back to Your<br />ClinicaFlow Dashboard
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

            <Field label="Email" error={touched.email || formSubmitted ? errors.email : ''}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="doctor@clinic.com" 
                style={{
                  ...inputStyle,
                  borderBottomColor: getFieldBorderColor('email')
                }}
                onFocus={focusIn} 
                onBlur={focusOut}
                disabled={isLoading}
                required 
              />
            </Field>

            <Field label="Password" error={touched.password || formSubmitted ? errors.password : ''}>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)} 
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••••"
                  style={{
                    ...inputStyle, 
                    paddingRight: '2rem', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    borderBottomColor: getFieldBorderColor('password')
                  }}
                  onFocus={focusIn} 
                  onBlur={focusOut}
                  disabled={isLoading}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  disabled={isLoading}
                  style={{
                    position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', 
                    padding: 0,
                    color: '#bbb', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button 
                type="button"
                onClick={handleForgotPasswordClick}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e0a4e',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
                  padding: '0.25rem 0',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Error Message */}
            {loginError && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                marginTop: '1rem',
                marginBottom: '0.5rem',
                border: '1px solid #ffcdd2',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                </svg>
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Success Message */}
            {loginSuccess && (
              <div style={{
                backgroundColor: '#e8f5e8',
                color: '#2e7d32',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                marginTop: '1rem',
                marginBottom: '0.5rem',
                border: '1px solid #a5d6a7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Validation Errors Summary */}
            {Object.keys(errors).length > 0 && formSubmitted && !loginError && !loginSuccess && (
              <div style={{
                backgroundColor: '#fff3e0',
                color: '#e65100',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                marginTop: '1rem',
                marginBottom: '0.5rem',
                border: '1px solid #ffe0b2'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Please fix the following
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {Object.values(errors).map((error, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.83rem', color: '#555', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    accentColor: '#1e0a4e', 
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }} 
                />
                Remember me
              </label>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  padding: '0.68rem 2.4rem', 
                  backgroundColor: isLoading ? '#999' : '#1e0a4e',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '0.92rem', 
                  fontWeight: '700', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
                  letterSpacing: '0.02em', 
                  transition: 'background 0.2s, transform 0.1s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#2d1258')}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1e0a4e')}
                onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isLoading ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </div>
          </form>

          {/* ===== GOOGLE LOGIN SECTION - ADD THIS ===== */}
          <div style={{
            marginTop: '1.5rem',
            position: 'relative',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
              <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: '500' }}>
                OR CONTINUE WITH
              </span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#333',
                cursor: (googleLoading || isLoading) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'background-color 0.2s, border-color 0.2s',
                opacity: (googleLoading || isLoading) ? 0.6 : 1,
                fontFamily: "'Zen Kaku Gothic Antique', sans-serif"
              }}
              onMouseEnter={(e) => !googleLoading && !isLoading && (e.currentTarget.style.backgroundColor = '#f8f8f8')}
              onMouseLeave={(e) => !googleLoading && !isLoading && (e.currentTarget.style.backgroundColor = 'white')}
            >
              {googleLoading ? (
                <>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #1e0a4e',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google logo"
                    style={{ width: '20px', height: '20px' }}
                  />
                  Sign in with Google
                </>
              )}
            </button>
          </div>
          {/* ===== END GOOGLE LOGIN SECTION ===== */}

          <p style={{ marginTop: '1.6rem', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            No Account yet?{' '}
            <button 
              onClick={() => goTo('/register')} 
              disabled={isLoading}
              style={{
                background: 'none', 
                border: 'none', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: '#1e0a4e', 
                fontWeight: '900', 
                fontSize: '0.85rem',
                fontFamily: "'Zen Kaku Gothic Antique', sans-serif", 
                padding: 0,
                opacity: isLoading ? 0.5 : 1
              }}
            >
              SIGN UP
            </button>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            textAlign: 'center',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#1e0a4e',
              marginBottom: '1rem'
            }}>
              Login Successful!
            </h2>
            
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '2rem',
              lineHeight: 1.5
            }}>
              Welcome back to ClinicaFlow! Redirecting to dashboard...
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
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          fontFamily: "'Zen Kaku Gothic Antique', sans-serif"
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseForgotPassword}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#1e0a4e',
              marginBottom: '0.5rem'
            }}>
              Reset Password
            </h2>
            
            <p style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '1.5rem'
            }}>
              Enter your email to receive a reset link
            </p>

            <input
              type="email"
              placeholder="doctor@clinic.com"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                setResetError('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: `1px solid ${resetError ? '#ff4444' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />

            {resetError && (
              <p style={{ 
                color: '#ff4444', 
                fontSize: '0.8rem', 
                marginBottom: '1rem' 
              }}>
                {resetError}
              </p>
            )}

            {resetSuccess && (
              <p style={{ 
                color: '#00C851', 
                fontSize: '0.8rem', 
                marginBottom: '1rem' 
              }}>
                {resetSuccess}
              </p>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={handleCloseForgotPassword}
                style={{
                  padding: '0.68rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetSubmit}
                disabled={resetLoading}
                style={{
                  padding: '0.68rem 1.5rem',
                  backgroundColor: '#1e0a4e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: resetLoading ? 'not-allowed' : 'pointer',
                  opacity: resetLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {resetLoading ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '0.55rem 0',
  border: 'none', 
  borderBottom: '1.5px solid #ddd',
  borderRadius: '0', 
  fontSize: '0.9rem', 
  outline: 'none',
  boxSizing: 'border-box', 
  backgroundColor: 'transparent',
  transition: 'border-bottom-color 0.2s', 
  color: '#222',
  fontFamily: "'Zen Kaku Gothic Antique', sans-serif"
};

const focusIn = (e) => {
  e.target.style.borderBottomColor = '#1e0a4e';
};

const focusOut = (e) => {
  if (!e.target.value) {
    e.target.style.borderBottomColor = '#ddd';
  }
};

function Field({ label, children, error }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.15rem', 
      paddingBottom: '0.85rem' 
    }}>
      <label style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        color: '#999', 
        letterSpacing: '0.02em' 
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ 
          fontSize: '0.7rem', 
          color: '#ff4444', 
          marginTop: '0.15rem' 
        }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default Login;
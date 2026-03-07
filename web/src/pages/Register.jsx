import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/background.png';
import doctorImg from '../assets/doctor.png';
import authService from '../services/authService'; // Import auth service

function Register() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    confirmPassword: '', 
    role: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal
  const [successMessage, setSuccessMessage] = useState('');

  // ── Fade transition ──
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

  // Enhanced email validation (same as login)
  const validateEmail = (email) => {
    if (!email || email.trim() === '') return 'Email is required';
    
    // Basic email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., name@domain.com)';
    
    // Check for valid domain extensions (common TLDs)
    const validDomains = ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.int', '.eu', '.in', '.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.br', '.mx', '.io', '.co', '.ai', '.app', '.dev', '.tech', '.info', '.biz'];
    
    // Extract domain part
    const domain = email.substring(email.lastIndexOf('.'));
    
    // Check if it's a Gmail account and validate properly
    if (email.toLowerCase().includes('gmail')) {
      // For Gmail, ensure it ends with @gmail.com
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(email.toLowerCase())) {
        return 'Gmail addresses must end with @gmail.com';
      }
    } else {
      // For other email providers, check if they have a valid domain extension
      const isValidDomain = validDomains.some(validDomain => 
        domain.toLowerCase() === validDomain || 
        email.toLowerCase().endsWith(validDomain)
      );
      
      if (!isValidDomain) {
        return 'Please enter a valid email address with a proper domain (e.g., .com, .org, .net)';
      }
    }
    
    return '';
  };

  const validateFirstName = (name) => {
    if (!name || name.trim() === '') return 'First name is required';
    if (name.length < 2) return 'First name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'First name can only contain letters';
    return '';
  };

  const validateLastName = (name) => {
    if (!name || name.trim() === '') return 'Last name is required';
    if (name.length < 2) return 'Last name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Last name can only contain letters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === '') return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword || confirmPassword.trim() === '') return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const validateRole = (role) => {
    if (!role || role === '') return 'Please select your role';
    return '';
  };

  const validateTerms = (agree) => {
    if (!agree) return 'You must accept the terms and conditions to register';
    return '';
  };

  const validateField = (field, value) => {
    switch(field) {
      case 'firstName':
        return validateFirstName(value);
      case 'lastName':
        return validateLastName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, formData.password);
      case 'role':
        return validateRole(value);
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const firstNameError = validateFirstName(formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateLastName(formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmError) newErrors.confirmPassword = confirmError;
    
    const roleError = validateRole(formData.role);
    if (roleError) newErrors.role = roleError;
    
    const termsError = validateTerms(agreeTerms);
    if (termsError) newErrors.terms = termsError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setRegistrationError(''); // Clear registration error when user starts typing
    
    // Validate on blur
    const value = field === 'terms' ? agreeTerms : formData[field];
    const error = field === 'terms' ? validateTerms(value) : validateField(field, value);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setRegistrationError(''); // Clear registration error when user starts typing
    
    // Clear error for this field when user starts typing
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // If changing password, also check confirm password if it's already touched
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateConfirmPassword(formData.confirmPassword, value);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleTermsChange = (e) => {
    const checked = e.target.checked;
    setAgreeTerms(checked);
    setRegistrationError(''); // Clear registration error when user interacts
    
    if (touched.terms) {
      setErrors(prev => ({ ...prev, terms: validateTerms(checked) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setRegistrationError('');
    
    // Mark all fields as touched
    setTouched({
      firstName: true, lastName: true, email: true,
      password: true, confirmPassword: true, role: true, terms: true
    });
    
    if (validateForm()) {
      setIsLoading(true); // Start loading
      
      try {
        // Call the actual backend using authService
        const response = await authService.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role.toUpperCase() // Ensure role is uppercase to match backend
        });
        
        console.log('Registration response:', response);
        
        if (response.success) {
          // Registration successful - show success modal
          setSuccessMessage('Your account has been created successfully!');
          setShowSuccessModal(true);
          
          // Clear form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
          });
          setAgreeTerms(false);
          
          // Auto redirect to login after 3 seconds
          setTimeout(() => {
            setShowSuccessModal(false);
            goTo('/login');
          }, 3000);
        } else {
          // Registration failed
          setRegistrationError(response.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        
        // Handle different error scenarios
        if (error.message === 'Network Error') {
          setRegistrationError('Cannot connect to server. Please make sure the backend is running.');
        } else if (error.response) {
          // Server responded with error
          setRegistrationError(error.response.data?.message || 'Server error occurred');
        } else {
          setRegistrationError('An error occurred during registration. Please try again.');
        }
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  const getFieldBorderColor = (field) => {
    const value = field === 'terms' ? agreeTerms : formData[field];
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

      {/* ── LEFT PANEL ── (unchanged) */}
      <div style={{
        width: '42%', minHeight: '100vh',
        backgroundImage: `url(${bgImg})`, backgroundSize: '120%', backgroundPosition: 'center',
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '2rem 2.5rem 2.5rem', overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: '0.65rem', color: 'white', fontWeight: '700', fontSize: '1.75rem',
          marginBottom: '2.5rem', zIndex: 2
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
          borderRadius: '50px', position: 'relative', overflow: 'visible', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          marginTop: '55px', paddingBottom: '1.25rem'
        }}>
          {/* Callout — left */}
          <div style={{
            position: 'absolute', top: '55px', left: '-70px',
            backgroundColor: '#E1DCED', borderRadius: '10px',
            width: '173px', height: '56px', display: 'flex', alignItems: 'center',
            fontSize: '0.58rem', color: '#444', lineHeight: '1.5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.13)', zIndex: 5, padding: '0 0.75rem'
          }}>
            Our system simplifies patient registration, queue management, and consultation tracking.
          </div>

          {/* Callout — right */}
          <div style={{
            position: 'absolute', top: '150px', right: '-90px',
            backgroundColor: '#E1DCED', borderRadius: '10px',
            width: '173px', height: '56px', display: 'flex', alignItems: 'center',
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

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: '58%', backgroundColor: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '3rem 4rem', position: 'relative'
      }}>

        {/* Sign in top right */}
        <div style={{
          position: 'absolute', top: '2rem', right: '2.5rem',
          fontSize: '0.88rem', color: '#777',
          display: 'flex', alignItems: 'center', gap: '0.3rem'
        }}>
          sign in
          <button onClick={() => goTo('/login')} disabled={isLoading} style={{
            background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#1e0a4e', fontWeight: '700', fontSize: '1rem',
            fontFamily: "'Zen Kaku Gothic Antique', sans-serif", padding: 0,
            opacity: isLoading ? 0.5 : 1
          }}>→</button>
        </div>

        <div style={{ width: '100%', maxWidth: '460px' }}>

          <h1 style={{
            fontSize: '1.9rem', fontWeight: '900', color: '#1e0a4e',
            lineHeight: 1.3, marginBottom: '2rem', textAlign: 'center', letterSpacing: '-0.01em'
          }}>
            Start Managing Patients the<br />Fast, Simple, and Digital Way
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Field label="First Name" error={touched.firstName || formSubmitted ? errors.firstName : ''}>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange} 
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Enter your first name"
                  disabled={isLoading}
                  style={{
                    ...inputStyle,
                    borderBottomColor: getFieldBorderColor('firstName'),
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onFocus={focusIn} 
                />
              </Field>
              <Field label="Last Name" error={touched.lastName || formSubmitted ? errors.lastName : ''}>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange} 
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Enter your last name"
                  disabled={isLoading}
                  style={{
                    ...inputStyle,
                    borderBottomColor: getFieldBorderColor('lastName'),
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onFocus={focusIn} 
                />
              </Field>
            </div>

            <Field label="Email" error={touched.email || formSubmitted ? errors.email : ''}>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                onBlur={() => handleBlur('email')}
                placeholder="doctor@clinic.com"
                disabled={isLoading}
                style={{
                  ...inputStyle,
                  borderBottomColor: getFieldBorderColor('email'),
                  opacity: isLoading ? 0.7 : 1
                }}
                onFocus={focusIn} 
              />
            </Field>

            <Field label="Role" error={touched.role || formSubmitted ? errors.role : ''}>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                onBlur={() => handleBlur('role')}
                disabled={isLoading}
                style={{ 
                  ...inputStyle, 
                  color: formData.role ? '#222' : '#aaa', 
                  backgroundColor: 'transparent', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  borderBottomColor: getFieldBorderColor('role'),
                  opacity: isLoading ? 0.7 : 1
                }}
                onFocus={focusIn}
              >
                <option value="" disabled>Select your role</option>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="ADMIN">Administrator</option>
                <option value="STAFF">Staff</option>
              </select>
            </Field>

            <Field label="Password" error={touched.password || formSubmitted ? errors.password : ''}>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  onBlur={() => handleBlur('password')}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  style={{ 
                    ...inputStyle, 
                    paddingRight: '2rem', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    borderBottomColor: getFieldBorderColor('password'),
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onFocus={focusIn} 
                />
                <EyeToggle show={showPassword} onToggle={() => !isLoading && setShowPassword(p => !p)} disabled={isLoading} />
              </div>
              {touched.password && !errors.password && formData.password && (
                <span style={{ fontSize: '0.7rem', color: '#00C851', marginTop: '0.15rem' }}>
                  ✓ Password meets requirements
                </span>
              )}
            </Field>

            <Field label="Confirm Password" error={touched.confirmPassword || formSubmitted ? errors.confirmPassword : ''}>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  style={{ 
                    ...inputStyle, 
                    paddingRight: '2rem', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    borderBottomColor: getFieldBorderColor('confirmPassword'),
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onFocus={focusIn} 
                />
                <EyeToggle show={showConfirm} onToggle={() => !isLoading && setShowConfirm(p => !p)} disabled={isLoading} />
              </div>
            </Field>

            {/* Registration Error Message */}
            {registrationError && (
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
                <span>{registrationError}</span>
              </div>
            )}

            {/* Validation Errors Summary */}
            {(Object.keys(errors).length > 0 && formSubmitted && !registrationError) && (
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
                <strong>Please fix the following</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.83rem', color: '#555', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={handleTermsChange}
                    onBlur={() => handleBlur('terms')}
                    disabled={isLoading}
                    style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      accentColor: '#1e0a4e', 
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1
                    }} 
                  />
                  I accept the{' '}
                  <a href="#" style={{ color: '#1e0a4e', fontWeight: '700', textDecoration: 'none' }}>
                    terms &amp; Conditions
                  </a>
                </label>
                {(touched.terms || formSubmitted) && errors.terms && (
                  <span style={{ fontSize: '0.7rem', color: '#ff4444', marginTop: '0.15rem', marginLeft: '1.55rem' }}>
                    {errors.terms}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  padding: '0.68rem 2.2rem', 
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
                    Registering...
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            Own an Account?{' '}
            <button onClick={() => goTo('/login')} disabled={isLoading} style={{
              background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
              color: '#1e0a4e', fontWeight: '700', fontSize: '0.85rem',
              fontFamily: "'Zen Kaku Gothic Antique', sans-serif", padding: 0,
              opacity: isLoading ? 0.5 : 1
            }}>
              Jump right in!
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
              Registration Successful!
            </h2>
            
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '2rem',
              lineHeight: 1.5
            }}>
              {successMessage}
            </p>
            
            <p style={{
              fontSize: '0.9rem',
              color: '#999',
              marginBottom: '0'
            }}>
              Redirecting to login...
            </p>
            
            <div style={{
              width: '50px',
              height: '50px',
              margin: '1rem auto 0',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #1e0a4e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </div>
      )}

      {/* Add animations */}
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
  width: '100%', padding: '0.55rem 0',
  border: 'none', borderBottom: '1.5px solid #ddd',
  borderRadius: '0', fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box', backgroundColor: 'transparent',
  transition: 'border-bottom-color 0.2s', color: '#222',
  fontFamily: "'Zen Kaku Gothic Antique', sans-serif"
};

const focusIn  = (e) => (e.target.style.borderBottomColor = '#1e0a4e');
const focusOut = (e) => (e.target.style.borderBottomColor = '#ddd');

function Field({ label, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingBottom: '0.85rem' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', letterSpacing: '0.02em' }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: '0.7rem', color: '#ff4444', marginTop: '0.15rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}

function EyeToggle({ show, onToggle, disabled }) {
  return (
    <button 
      type="button" 
      onClick={onToggle} 
      disabled={disabled}
      style={{
        position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', 
        padding: 0,
        color: '#bbb', display: 'flex', alignItems: 'center',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {show ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export default Register;
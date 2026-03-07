import { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImg from '../assets/background.png';

function Register() {
  const [formData, setFormData] = useState({
    firstName: 'john',
    lastName: 'dave',
    email: 'johndoe@email.com',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: 'Arial, sans-serif'
  };

  // Left Side - with background.png (NO OVERLAY)
  const leftSideStyle = {
    width: '40%',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem',
    color: 'white' // Text color white to stand out against background
  };

  const leftContentStyle = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: very subtle darkening for text readability
    padding: '2rem',
    borderRadius: '8px'
  };

  const logoStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  };

  const leftTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  };

  const leftSubtitleStyle = {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    lineHeight: '1.4'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    fontSize: '1rem'
  };

  const featureIconStyle = {
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem'
  };

  // Right Side - Registration Form
  const rightSideStyle = {
    width: '60%',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'relative'
  };

  const signInTopStyle = {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    fontSize: '1rem',
    color: '#333'
  };

  const signInLinkStyle = {
    color: '#0066cc',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: '0.5rem'
  };

  const formContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%'
  };

  const mainTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: '1rem',
    lineHeight: '1.2'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white',
    cursor: 'pointer',
    color: formData.role ? '#333' : '#999'
  };

  const termsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.5rem'
  };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    cursor: 'pointer'
  };

  const termsTextStyle = {
    fontSize: '0.9rem',
    color: '#333'
  };

  const termsLinkStyle = {
    color: '#0066cc',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginTop: '1rem'
  };

  const signUpButtonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const footerStyle = {
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: '#666'
  };

  const jumpInStyle = {
    color: '#0066cc',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - with background.png (original colors preserved) */}
      <div style={leftSideStyle}>
        <div style={leftContentStyle}>
          <div style={logoStyle}>ClinicaFlow</div>
          
          <h1 style={leftTitleStyle}>
            Start Managing Patients<br />
            the Fast, Simple, and<br />
            Digital Way
          </h1>
          
          <p style={leftSubtitleStyle}>
            Digital Health Management<br />
            Made Simple
          </p>
          
          <div>
            <div style={featureItemStyle}>
              <span style={featureIconStyle}>✓</span>
              <span>Patient Records Management</span>
            </div>
            <div style={featureItemStyle}>
              <span style={featureIconStyle}>✓</span>
              <span>Appointment Scheduling</span>
            </div>
            <div style={featureItemStyle}>
              <span style={featureIconStyle}>✓</span>
              <span>Secure & HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div style={rightSideStyle}>
        <div style={signInTopStyle}>
          sign in
          <Link to="/login" style={signInLinkStyle}>→</Link>
        </div>

        <div style={formContainerStyle}>
          <h2 style={mainTitleStyle}>
            Start Managing Patients<br />
            the Fast, Simple, and<br />
            Digital Way
          </h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            {/* First Name & Last Name Row */}
            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="john"
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="dave"
                  onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="johndoe@email.com"
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Role Dropdown */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              >
                <option value="" disabled>Select your role (basta dropdown ni)</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Administrator</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            {/* Password */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="**********"
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Confirm Password */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
                placeholder="**********"
                onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Terms and Sign Up */}
            <div style={buttonContainerStyle}>
              <div style={termsContainerStyle}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={checkboxStyle}
                />
                <label htmlFor="terms" style={termsTextStyle}>
                  Accept the{' '}
                  <a href="#" style={termsLinkStyle}>terms & Condition</a>
                </label>
              </div>

              <button
                type="submit"
                style={signUpButtonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0052a3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0066cc'}
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Footer */}
          <div style={footerStyle}>
            Own an Account?{' '}
            <Link to="/login" style={jumpInStyle}>
              Jump right in!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
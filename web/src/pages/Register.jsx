import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'doctor'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register:', formData);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: 'Arial, sans-serif'
  };

  // Left Side Styles (same as login)
  const leftSideStyle = {
    width: '50%',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  };

  const leftTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2'
  };

  const leftSubtitleStyle = {
    fontSize: '1.25rem',
    color: '#93c5fd',
    marginBottom: '2rem',
    lineHeight: '1.4'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    color: '#bfdbfe'
  };

  const featureIconStyle = {
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem'
  };

  const copyrightStyle = {
    fontSize: '0.875rem',
    color: '#93c5fd',
    marginTop: '2rem'
  };

  // Right Side Styles
  const rightSideStyle = {
    width: '50%',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  };

  const rightLogoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '2rem'
  };

  const rightTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem'
  };

  const rightSubtitleStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.5'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: '#4b5563'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    outline: 'none'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  const buttonStyle = {
    padding: '0.75rem',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  const linkContainerStyle = {
    marginTop: '2rem',
    textAlign: 'center'
  };

  const linkStyle = {
    color: '#1e3a8a',
    textDecoration: 'none',
    fontSize: '0.875rem'
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - Blue Section (same as login) */}
      <div style={leftSideStyle}>
        <div>
          <div style={logoStyle}>ClinicaFlow</div>
          <h1 style={leftTitleStyle}>
            Start Managing Patients the<br />
            Fast, Simple, and<br />
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
        
        <div style={copyrightStyle}>
          © 2026 ClinicaFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side - White Section */}
      <div style={rightSideStyle}>
        <div style={rightLogoStyle}>register</div>
        
        <h2 style={rightTitleStyle}>
          Create Your<br />
          ClinicaFlow Account
        </h2>
        <p style={rightSubtitleStyle}>
          Join us to start managing<br />
          patients digitally
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={rowStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="John"
                required
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="doctor@clinic.com"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Administrator</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>

        <div style={linkContainerStyle}>
          <Link to="/login" style={linkStyle}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
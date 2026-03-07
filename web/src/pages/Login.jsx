import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { email, password });
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: 'Arial, sans-serif'
  };

  // Left Side Styles
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
      {/* Left Side - Blue Section */}
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
        <div style={rightLogoStyle}>login</div>
        
        <h2 style={rightTitleStyle}>
          Welcome back to Your<br />
          ClinicaFlow Dashboard
        </h2>
        <p style={rightSubtitleStyle}>
          Clinical Health Management<br />
          Made Simple
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Enter your email address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="doctor@clinic.com"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Enter your password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>

        <div style={linkContainerStyle}>
          <Link to="/register" style={linkStyle}>
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
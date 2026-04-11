import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg from '../assets/doctor.png';

function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const timer = setTimeout(() => setVisible(true), 20);
    return () => {
      document.head.removeChild(link);
      clearTimeout(timer);
    };
  }, []);

  const goTo = (path) => {
    setVisible(false);
    setTimeout(() => navigate(path), 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
      background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 2.5rem',
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(200,195,220,0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem', color: '#1e0a4e' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="12" viewBox="0 0 28 20" fill="none">
              <polyline points="0,10 5,10 7,2 10,18 13,6 16,14 18,10 28,10"
                stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          ClinicaFlow
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {['About us', 'Key features', 'Benefits'].map((label) => (
            <span key={label} style={{
              fontSize: '0.9rem', color: '#3a3060', fontWeight: '500', cursor: 'pointer',
            }}>{label}</span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => goTo('/login')}
            style={{
              padding: '0.5rem 1.5rem',
              border: '1.5px solid #1e0a4e',
              borderRadius: '8px',
              background: 'transparent',
              color: '#1e0a4e',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e0a4e'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1e0a4e'; }}
          >Log in</button>
          <button
            onClick={() => goTo('/register')}
            style={{
              padding: '0.5rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: '#1e0a4e',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2d1258'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1e0a4e'; }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem 3rem 3rem 3.5rem',
        flex: 1,
        gap: '2rem',
      }}>

        {/* LEFT */}
        <div style={{ flex: '0 0 auto', maxWidth: '480px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.95)',
            borderRadius: '20px', padding: '0.35rem 0.9rem',
            fontSize: '0.8rem', color: '#1e0a4e', fontWeight: '600',
            marginBottom: '1.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: '20px', height: '20px',
              background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="8" viewBox="0 0 28 20" fill="none">
                <polyline points="0,10 5,10 7,2 10,18 13,6 16,14 18,10 28,10"
                  stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            Modern Healthcare Management
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: '900',
            color: '#1a0840',
            lineHeight: 1.12,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Streamline Your<br />Clinic Operations
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '0.95rem',
            color: '#4a4060',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
            maxWidth: '420px',
          }}>
            A complete web-based system for small clinics and barangay health centers.
            Manage patient registration, queues, and consultations in a fast, organized,
            and digital way.
          </p>

          {/* Sign in Button */}
          <button
            onClick={() => goTo('/login')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              background: '#1e0a4e', color: 'white', border: 'none',
              borderRadius: '50px', padding: '0.75rem 1rem 0.75rem 1.5rem',
              fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
              fontFamily: "'Zen Kaku Gothic Antique', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2d1258'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1e0a4e'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Sign in
            <span style={{
              width: '32px', height: '32px',
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: '700',
            }}>→</span>
          </button>
        </div>

        {/* RIGHT — Doctor card */}
        <div style={{ flex: '0 0 auto', position: 'relative', marginTop: '1rem', paddingBottom: '1.5rem' }}>

          {/* Main card */}
          <div style={{
            width: '370px',
            height: '460px',
            background: 'linear-gradient(170deg, #2a0a5e 0%, #4a1a8a 38%, #d8d0f0 70%, #ede9f8 100%)',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'visible',
          }}>
            {/* Doctor image — overflows top of card */}
            <img
              src={doctorImg}
              alt="Doctor"
              style={{
                position: 'absolute',
                bottom: '48px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '105%',
                width: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom',
                zIndex: 3,
              }}
            />
          </div>

          {/* Bottom pill — outside/overlapping bottom of card */}
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '12px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.72rem',
            color: '#333',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}>
            We are dedicated to helping clinics operate more efficiently
          </div>

          {/* Callout LEFT */}
          <div style={{
            position: 'absolute',
            top: '100px',
            left: '-120px',
            background: 'rgba(255,255,255,0.88)',
            borderRadius: '10px',
            padding: '0.6rem 0.8rem',
            fontSize: '0.65rem',
            color: '#444',
            lineHeight: 1.55,
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            maxWidth: '148px',
            zIndex: 10,
          }}>
            Our system simplifies patient registration, queue management, and consultation tracking.
          </div>

          {/* Callout RIGHT */}
          <div style={{
            position: 'absolute',
            top: '265px',
            right: '-125px',
            background: 'rgba(255,255,255,0.88)',
            borderRadius: '10px',
            padding: '0.6rem 0.8rem',
            fontSize: '0.65rem',
            color: '#444',
            lineHeight: 1.55,
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            maxWidth: '148px',
            zIndex: 10,
          }}>
            Our system simplifies patient registration, queue management, and consultation tracking.
          </div>

        </div>
      </div>

    </div>
  );
}

export default LandingPage;
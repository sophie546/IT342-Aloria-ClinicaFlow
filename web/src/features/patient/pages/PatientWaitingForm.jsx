import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../shared/assets/logo.png';

function PatientWaitingForm() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
  const queueNumber = localStorage.getItem('queueNumber') || '?';

  const [patients] = useState([
    {
      id: 1,
      initials: 'MS',
      name: 'Maria Santos',
      age: 45,
      gender: 'Female',
      status: 'Consulting',
      queueNum: 1,
      doctor: 'Dr. Cruz',
      arrivalTime: '08:30 AM',
    },
    {
      id: 2,
      initials: 'JDC',
      name: 'Juan Dela Cruz',
      age: 32,
      gender: 'Male',
      status: 'Waiting',
      queueNum: 2,
      doctor: 'Dr. Cruz',
      arrivalTime: '08:45 AM',
    },
  ]);

  const stats = [
    { label: 'Completed',     value: '1', sub: 'Sessions completed',    iconBg: '#22c55e', icon: 'check' },
    { label: 'Consulting',    value: '1', sub: 'Currently with doctor',  iconBg: '#6366f1', icon: 'user' },
    { label: 'Waiting',       value: '3', sub: 'Average: 15 minutes',    iconBg: '#f97316', icon: 'clock' },
    { label: 'Total Patients',value: '5', sub: 'In queue today',         iconBg: '#6366f1', icon: 'users' },
  ];

  // SVG Icon components
  const Icons = {
    check: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    user: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    clock: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    users: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    filter: () => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
      </svg>
    ),
    search: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    dots: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const timer = setTimeout(() => setVisible(true), 20);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      document.head.removeChild(link);
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  const today = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease',
    }}>

      {/* ── TOPBAR ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2.5rem',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px', height: '42px',
            background: '#190051',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={logo} alt="logo" style={{ width: '26px', height: '26px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#190051', lineHeight: 1.2 }}>Patient Queue</div>
            <div style={{ fontSize: '0.75rem', color: '#6b6080' }}>Real-time patient tracking | {today}</div>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 1.6rem',
            background: '#190051', color: '#ffffff',
            border: 'none', borderRadius: '24px',
            fontSize: '0.9rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2d0a6e'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#190051'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 260px 240px',
        gap: '1.25rem',
        padding: '1.5rem 2rem',
        maxWidth: '1300px',
        margin: '0 auto',
      }}>

        {/* ── LEFT — Queue List ── */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '24px',
          padding: '1.5rem',
          backdropFilter: 'blur(8px)',
        }}>
          {/* Queue header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#190051' }}>Patient Queue</div>
              <div style={{ fontSize: '0.8rem', color: '#6b6080', marginTop: '0.3rem' }}>Manage and monitor patient flow in real-time</div>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: '#190051', color: '#fff',
                border: 'none', borderRadius: '12px',
                fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2d0a6e'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#190051'; }}
              >
                <Icons.filter />
                Filter
              </button>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
                  <Icons.search />
                </div>
                <input
                  placeholder="Search patients..."
                  style={{
                    padding: '0.6rem 1rem 0.6rem 2.2rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    background: '#f8f9fa',
                    width: '180px',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#e8e4f0', marginBottom: '1.25rem' }} />

          {/* Patient Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {patients.map((p) => (
              <div key={p.id} style={{
                background: p.status === 'Consulting' ? '#ffffff' : '#f4f2f9',
                borderRadius: '16px',
                padding: '1.2rem 1.4rem',
                border: '1px solid',
                borderColor: p.status === 'Consulting' ? '#e0daf0' : '#ebe8f5',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,0,81,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '48px', height: '48px',
                      background: '#190051', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                      flexShrink: 0,
                    }}>{p.initials}</div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#190051' }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b6080', marginTop: '0.2rem' }}>{p.age} years • {p.gender}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{
                      padding: '0.3rem 0.9rem',
                      borderRadius: '24px', fontSize: '0.8rem', fontWeight: 600,
                      background: p.status === 'Consulting' ? '#eef2ff' : '#fff7ed',
                      color: p.status === 'Consulting' ? '#6366f1' : '#f97316',
                      border: `1px solid ${p.status === 'Consulting' ? '#c7d2fe' : '#fed7aa'}`,
                    }}>{p.status}</span>
                    <span style={{
                      width: '28px', height: '28px',
                      background: '#190051', color: '#fff',
                      borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>#{p.queueNum}</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6080', padding: '0 0.2rem', display: 'flex', alignItems: 'center' }}>
                      <Icons.dots />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px solid #ebe8f5' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#9b90b0' }}>Assigned to |</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#190051' }}>{p.doctor}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#9b90b0' }}>Arrival time |</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#190051' }}>{p.arrivalTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MIDDLE — Now Serving + Your Number ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Now Serving */}
          <div style={{
            background: '#190051',
            borderRadius: '24px',
            padding: '2.2rem 1.2rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1,
            minHeight: '180px',
          }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>1</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.6rem', fontWeight: 500 }}>Now Serving</div>
          </div>

          {/* Your Number */}
          <div style={{
            background: '#190051',
            borderRadius: '24px',
            padding: '2.2rem 1.2rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1,
            minHeight: '180px',
          }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{queueNumber}</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.6rem', fontWeight: 500 }}>Your Number</div>
          </div>
        </div>

        {/* ── RIGHT — Stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {stats.map(({ label, value, sub, icon, iconBg }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: '20px',
              padding: '1.2rem 1.3rem',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(25,0,81,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b6080', fontWeight: 500, marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#190051', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: '#9b90b0', marginTop: '0.3rem' }}>{sub}</div>
              </div>
              <div style={{
                width: '44px', height: '44px',
                background: iconBg, borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
              }}>
                {Icons[icon] && Icons[icon]()}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PatientWaitingForm;
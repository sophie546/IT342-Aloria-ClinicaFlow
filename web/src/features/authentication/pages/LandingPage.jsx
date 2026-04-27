import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg from '../../../shared/assets/doctor.png';
import logo from '../../../shared/assets/logo.png';
import hospitalImg from '../../../shared/assets/Hospital.png';
import listImg from '../../../shared/assets/list.png';
import goalImg from '../../../shared/assets/Goal.png';
import laptopImg from '../../../shared/assets/Laptop.png';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
  });

  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);

  const [whyRef, whyInView] = useInView();
  const [feat1Ref, feat1InView] = useInView();
  const [feat2Ref, feat2InView] = useInView();
  const [feat3Ref, feat3InView] = useInView();
  const [gainRef, gainInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinks = [
    { label: 'About us',     ref: aboutRef },
    { label: 'Key features', ref: featuresRef },
    { label: 'Benefits',     ref: benefitsRef },
  ];

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const fullName = `${modalData.firstName} ${modalData.lastName}`;
    const queueNumber = Math.floor(Math.random() * 100) + 1;
    const patientData = {
      fullName,
      age: modalData.age,
      address: modalData.address,
      contactNumber: modalData.contactNumber,
      gender: modalData.gender,
      queueNumber,
      arrivalTime: new Date().toLocaleTimeString(),
      status: 'waiting',
      assignedDoctor: 'Dr. Cruz',
    };
    localStorage.setItem('patientData', JSON.stringify(patientData));
    localStorage.setItem('queueNumber', queueNumber);
    closeModal();
    setTimeout(() => navigate('/patient-waiting'), 300);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateX(-50%) translateY(0px); }
        50%       { transform: translateX(-50%) translateY(-10px); }
      }
      .hero-badge   { animation: fadeIn  0.6s ease both; animation-delay: 0s; }
      .hero-heading { animation: fadeUp  0.7s ease both; animation-delay: 0.1s; }
      .hero-desc    { animation: fadeUp  0.7s ease both; animation-delay: 0.25s; }
      .hero-btn     { animation: fadeUp  0.7s ease both; animation-delay: 0.4s; }
      .hero-card    { animation: fadeUp  0.8s ease both; animation-delay: 0.2s; }
      .doctor-float {
        animation: float 4s ease-in-out infinite;
        width: 80%;
        object-fit: contain;
        object-position: center top;
        display: block;
        position: absolute;
        left: 50%;
        top: -55px;
        bottom: 2.5rem;
        height: calc(100% + 10px);
        z-index: 3;
      }
      .nav-link {
        position: relative;
        font-size: 1rem;
        color: #190051;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: color 0.2s;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 0;
        height: 2px;
        background: #190051;
        border-radius: 2px;
        transition: width 0.25s ease;
      }
      .nav-link:hover { color: #2d0a6e; }
      .nav-link:hover::after { width: 100%; }
      .feature-img { transition: transform 0.35s ease; }
      .feature-img:hover { transform: scale(1.06) rotate(-1deg); }
      .feature-img-right:hover { transform: scale(1.06) rotate(1deg); }
    `;
    document.head.appendChild(style);

    const timer = setTimeout(() => setVisible(true), 20);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  const goTo = (path) => {
    setVisible(false);
    setTimeout(() => navigate(path), 350);
  };

  const fadeUp = (inView, delay = '0s') => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  const slideLeft = (inView, delay = '0s') => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(-40px)',
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  const slideRight = (inView, delay = '0s') => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(40px)',
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    border: '1.5px solid #e0e0e0', borderRadius: '12px',
    fontSize: '0.88rem', fontFamily: "'Inter', sans-serif",
    outline: 'none', backgroundColor: '#f8f9fa',
    boxSizing: 'border-box', transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.45rem',
    fontSize: '0.82rem', fontWeight: 600,
    color: '#190051', fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 3rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', paddingLeft: 'calc(5rem + (100% - 1300px)/2 + 0px)' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={logo} alt="ClinicaFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#190051', display: 'block', lineHeight: '1.2' }}>ClinicaFlow</span>
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginRight: 'auto', marginLeft: '15rem' }}>
          {navLinks.map(({ label, ref }) => (
            <span key={label} className="nav-link" onClick={() => scrollTo(ref)}>{label}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginRight: '9rem' }}>
          <button onClick={() => goTo('/login')} style={{
            padding: '0.55rem 1.6rem', border: '1.5px solid #190051', borderRadius: '8px',
            background: 'transparent', color: '#190051', fontSize: '0.9rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#190051'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#190051'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Log in</button>
          <button onClick={() => goTo('/register')} style={{
            padding: '0.55rem 1.6rem', border: 'none', borderRadius: '8px',
            background: '#190051', color: '#ffffff', fontSize: '0.9rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2d0a6e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(25,0,81,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#190051'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4rem 5rem 3rem 5rem',
        maxWidth: '1300px', margin: '0 auto',
        width: '100%', boxSizing: 'border-box', gap: '3rem',
      }}>
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <div className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
            borderRadius: '50px', padding: '0.4rem 1.2rem 0.4rem 0.6rem',
            marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid rgba(25,0,81,0.1)',
          }}>
            <div style={{ width: '26px', height: '26px', backgroundColor: 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={logo} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#190051', fontWeight: 600, fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em' }}>Modern Healthcare Management</span>
          </div>

          <h1 className="hero-heading" style={{
            fontSize: '3.8rem', fontWeight: 800, color: '#190051',
            lineHeight: 1.15, margin: '0 0 1.2rem 0',
            letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif",
          }}>
            Streamline Your<br/>Clinic Operations
          </h1>

          <p className="hero-desc" style={{
            fontSize: '1rem', color: '#4a4060', lineHeight: 1.6,
            margin: '0 0 2rem 0', fontFamily: "'Inter', sans-serif", fontWeight: 400,
          }}>
            A complete web-based system for small clinics and barangay health centers.
            Manage patient registration, queues, and consultations in a fast, organized, and digital way.
          </p>

          <button className="hero-btn" onClick={() => goTo('/login')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.85rem',
            background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 50%, #190051 100%)',
            color: 'white', border: 'none', borderRadius: '50px',
            padding: '0.8rem 1.4rem 0.8rem 1.8rem',
            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #2d0a6e 0%, #190051 50%, #2d0a6e 100%)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(25,0,81,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #190051 0%, #2d0a6e 50%, #190051 100%)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Sign in
            <span style={{ width: '34px', height: '34px', background: '#ffffff', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ stroke: '#000000', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M5 12H19M19 12L13 6M19 12L13 18" />
              </svg>
            </span>
          </button>
        </div>

        {/* Doctor Card */}
        <div className="hero-card" style={{
          flex: 1, position: 'relative',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          minHeight: '520px',
        }}>
          <div style={{
            width: '420px', height: '490px',
            background: 'linear-gradient(to bottom, #190051, #FFFFFF)',
            borderRadius: '50px', position: 'relative', overflow: 'visible',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: '1.25rem',
            boxShadow: '0 24px 48px rgba(25,0,81,0.15)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 32px 60px rgba(25,0,81,0.22)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(25,0,81,0.15)'; }}
          >
            <div style={{ position: 'absolute', top: '55px', left: '-75px', backgroundColor: '#E1DCED', borderRadius: '10px', width: '180px', height: '66px', display: 'flex', alignItems: 'center', fontSize: '0.6rem', color: '#444', lineHeight: '1.5', boxShadow: '0 4px 20px rgba(0,0,0,0.13)', zIndex: 5, padding: '0 0.75rem', transition: 'transform 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >Our system simplifies patient registration, queue management, and consultation tracking.</div>

            <div style={{ position: 'absolute', top: '150px', right: '-95px', backgroundColor: '#E1DCED', borderRadius: '10px', width: '180px', height: '66px', display: 'flex', alignItems: 'center', fontSize: '0.6rem', color: '#444', lineHeight: '1.5', boxShadow: '0 4px 20px rgba(0,0,0,0.13)', zIndex: 5, padding: '0 0.75rem', transition: 'transform 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >Our system simplifies patient registration, queue management, and consultation tracking.</div>

            <img src={doctorImg} alt="Doctor" className="doctor-float" />

            <p style={{ fontSize: '0.65rem', color: '#2e2c2c', textAlign: 'center', margin: '0 1.2rem', lineHeight: 1.4, position: 'relative', zIndex: 4 }}>
              We are dedicated to helping clinics operate more efficiently
            </p>
          </div>
        </div>
      </div>

      {/* ── WHY CLINICAFLOW SECTION ── */}
      <div ref={aboutRef} style={{ padding: '0 3rem 4rem 3rem', maxWidth: '1300px', margin: '6rem auto 0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div ref={whyRef} style={{
          background: '#ffffff', borderRadius: '40px',
          display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
          overflow: 'hidden', minHeight: '260px', position: 'relative',
          boxShadow: '0 8px 32px rgba(25,0,81,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(25,0,81,0.14)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(25,0,81,0.08)'; }}
        >
          <div style={{ flex: 1, minWidth: '280px', maxWidth: '420px', padding: '2.5rem 2rem 2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...slideLeft(whyInView) }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#190051', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.5, fontFamily: "'Inter', sans-serif" }}>About Us</span>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#190051', margin: '0 0 0.8rem 0', lineHeight: 1.1, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>Why<br/>ClinicaFlow?</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b6080', lineHeight: 1.75, fontFamily: "'Inter', sans-serif", fontWeight: 400, margin: '0 0 1.5rem 0', maxWidth: '340px' }}>
              We are dedicated to helping clinics operate more efficiently through modern,
              streamlined digital tools. Our system simplifies patient registration, queue
              management, and consultation tracking—making daily operations smoother for
              staff and more convenient for patients.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[{ value: '500+', label: 'Clinics Served' }, { value: '98%', label: 'Satisfaction Rate' }].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#190051', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9b90b0', fontFamily: "'Inter', sans-serif", marginTop: '0.2rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1.1, background: 'linear-gradient(135deg, #edeaf5 0%, #d4cee8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', ...slideRight(whyInView, '0.15s') }}>
            <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', top: '-50px', right: '-50px' }} />
            <img src={hospitalImg} alt="Hospital" style={{ width: '100%', maxWidth: '520px', height: 'auto', objectFit: 'contain', display: 'block', position: 'relative', zIndex: 1, marginBottom: '2rem' }} />
          </div>
        </div>
      </div>

      {/* ── HIGHLIGHTS & KEY FEATURES SECTION ── */}
      <div ref={featuresRef} style={{ padding: '0 5rem 6rem 5rem', maxWidth: '1300px', margin: '4rem auto 0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#190051', textAlign: 'center', marginBottom: '5rem', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>
          Highlights & Key Features
        </h2>

        {/* Feature 1 */}
        <div ref={feat1Ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '2rem' }}>
          <div style={{ width: '40%', ...slideLeft(feat1InView) }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#190051', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Patient Management</h3>
            <p style={{ fontSize: '0.9rem', color: '#190051', lineHeight: 1.75, fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Easily add, update, and view patient records in one centralized system. Maintain
              complete and accurate information about each patient — including contact details,
              medical history, and visit logs. This feature eliminates the need for manual paper
              records and ensures every consultation is backed by accessible patient data.
            </p>
          </div>
          <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...slideRight(feat1InView, '0.15s') }}>
            <img src={listImg} alt="Patient Management" className="feature-img" style={{ width: '100%', maxWidth: '420px', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        {/* Feature 2 */}
        <div ref={feat2Ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '2rem' }}>
          <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...slideLeft(feat2InView) }}>
            <img src={goalImg} alt="Queue Tracking" className="feature-img feature-img-right" style={{ width: '350%', maxWidth: '600px', height: 'auto', objectFit: 'contain', display: 'block', marginLeft: '-8rem' }} />
          </div>
          <div style={{ width: '40%', ...slideRight(feat2InView, '0.15s') }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#190051', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif", textAlign: 'right' }}>Queue Tracking</h3>
            <p style={{ fontSize: '0.9rem', color: '#190051', lineHeight: 1.75, fontFamily: "'Inter', sans-serif", margin: 0, textAlign: 'right' }}>
              Monitor and manage active patient queues efficiently in real time. The system
              automatically updates queue status, allowing staff to see who's next and how long
              each patient has been waiting. This ensures a smoother clinic flow, reduces patient
              frustration, and optimizes staff scheduling.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div ref={feat3Ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ width: '40%', ...slideLeft(feat3InView) }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#190051', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Consultation Records</h3>
            <p style={{ fontSize: '0.9rem', color: '#190051', lineHeight: 1.75, fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Keep a digital history of patient consultations securely stored and easy to retrieve.
              Doctors can record diagnoses, treatments, and prescriptions with just a few clicks.
              This makes it simple to review past visits, support better decision-making, and
              provide personalized patient care.
            </p>
          </div>
          <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...slideRight(feat3InView, '0.15s') }}>
            <img src={laptopImg} alt="Consultation Records" className="feature-img" style={{ width: '300%', maxWidth: '550px', marginLeft: '5rem', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* ── WHAT YOU GAIN SECTION ── */}
      <div ref={benefitsRef}>
        <div ref={gainRef} style={{
          padding: '5rem 5rem', maxWidth: '1300px',
          margin: '-5rem auto 0 auto', width: '100%',
          boxSizing: 'border-box', textAlign: 'center',
          ...fadeUp(gainInView),
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#190051', marginBottom: '1rem', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>
            What You Gain
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#190051', lineHeight: 1.75, fontFamily: "'Inter', sans-serif", maxWidth: '850px', margin: '0 auto' }}>
            Our platform reduces waiting times, improves data accuracy, and helps clinics deliver
            faster, more organized patient care. With real-time queue updates, secure digital records,
            and a simplified workflow, staff can work more efficiently while patients enjoy a smoother
            and more convenient clinic experience.
          </p>
        </div>
      </div>

      {/* ── SKIP THE LINE CTA SECTION ── */}
      <div ref={ctaRef} style={{ width: '100%', padding: '0 0 4rem 0', boxSizing: 'border-box', marginTop: '10rem', marginBottom: '3rem', ...fadeUp(ctaInView) }}>
        <div style={{
          background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 100%)',
          padding: '5rem 3rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: '-80px', right: '-80px', pointerEvents: 'none' }} />

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', position: 'relative', zIndex: 1 }}>
            Skip the Line. Join Us Online
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontFamily: "'Inter', sans-serif", maxWidth: '600px', margin: '0 0 2rem 0', position: 'relative', zIndex: 1 }}>
            Register yourself in the patient queue from the comfort of your home. No need to wait at
            the clinic — we'll notify you when it's your turn.
          </p>
          <button onClick={openModal} style={{
            padding: '0.8rem 3rem', background: '#ffffff',
            color: '#190051', border: 'none', borderRadius: '8px',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", marginBottom: '1.5rem',
            width: '320px', transition: 'all 0.25s', position: 'relative', zIndex: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e8e4f5'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Join Queue Now</button>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif", margin: 0, position: 'relative', zIndex: 1 }}>
            You'll receive a queue number immediately after registration
          </p>
        </div>
      </div>

      {/* ── QUEUE MODAL ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          opacity: modalVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          backdropFilter: 'blur(4px)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: '#ffffff', borderRadius: '28px',
            width: '100%', maxWidth: '480px',
            overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(25,0,81,0.2)',
            transform: modalVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: modalVisible ? 1 : 0,
          }}>

            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 100%)', padding: '1.75rem 2rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img src={logo} alt="logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>ClinicaFlow</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.25rem 0', fontFamily: "'Inter', sans-serif" }}>Join the Queue</h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Fill in your details to get your queue number</p>
              <button onClick={closeModal} style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '50%', width: '32px', height: '32px',
                color: '#ffffff', fontSize: '1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >✕</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} style={{ padding: '2rem' }}>

              {/* First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input
                    type="text" name="firstName" value={modalData.firstName}
                    onChange={handleModalChange} required
                    placeholder="e.g., Juan"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input
                    type="text" name="lastName" value={modalData.lastName}
                    onChange={handleModalChange} required
                    placeholder="e.g., Dela Cruz"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Age *</label>
                  <input
                    type="number" name="age" value={modalData.age}
                    onChange={handleModalChange} required
                    placeholder="e.g., 32"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gender *</label>
                  <select
                    name="gender" value={modalData.gender}
                    onChange={handleModalChange} required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Number */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Contact Number *</label>
                <input
                  type="tel" name="contactNumber" value={modalData.contactNumber}
                  onChange={handleModalChange} required
                  placeholder="e.g., 09123456789"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={labelStyle}>Address *</label>
                <textarea
                  name="address" value={modalData.address}
                  onChange={handleModalChange} required rows="2"
                  placeholder="e.g., 123 Main Street, Barangay San Antonio, Cebu City"
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => { e.target.style.borderColor = '#190051'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(25,0,81,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f8f9fa'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={closeModal} style={{
                  flex: 1, padding: '0.85rem',
                  background: 'transparent', color: '#6b6080',
                  border: '1.5px solid #e0e0e0', borderRadius: '12px',
                  fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#190051'; e.currentTarget.style.color = '#190051'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#6b6080'; }}
                >Cancel</button>
                <button type="submit" style={{
                  flex: 2, padding: '0.85rem',
                  background: 'linear-gradient(135deg, #190051 0%, #2d0a6e 100%)',
                  color: '#ffffff', border: 'none', borderRadius: '12px',
                  fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(25,0,81,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Join Queue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" />
                  </svg>
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#9b90b0', margin: '1rem 0 0 0', fontFamily: "'Inter', sans-serif" }}>
                You'll receive a queue number immediately after submission
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;
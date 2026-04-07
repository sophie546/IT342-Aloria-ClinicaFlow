import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

/* ── Google Fonts ── */
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector('[href*="Poppins"]')) document.head.appendChild(fontLink);

const globalStyle = document.createElement('style');
globalStyle.textContent = `*, body { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }`;
if (!document.head.querySelector('[data-poppins-override]')) {
  globalStyle.setAttribute('data-poppins-override', '1');
  document.head.appendChild(globalStyle);
}

/* ── Constants ── */
const C = {
  primary: '#190051',
  primaryLight: '#360185',
  white: '#ffffff',
  text1: '#1e293b',
  text2: '#6b7280',
  textMuted: 'rgba(30,41,59,0.4)',
  purple: '#667eea',
  purpleBg: 'rgba(102,126,234,0.12)',
  green: '#10b981',
  greenBg: 'rgba(16,185,129,0.12)',
  orange: '#f59e0b',
  orangeBg: 'rgba(245,158,11,0.12)',
  red: '#ef4444',
  redBg: 'rgba(239,68,68,0.1)',
};

/* ── Mock Consultation Data ── */
const INITIAL_CONSULTATIONS = [
  { id: 1, patientName: 'Maria Santos', age: 45, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Hypertension - Stage 2', details: 'Blood pressure elevated. Prescribed Amlodipine 5mg daily. Follow up in 2 weeks.' },
  { id: 2, patientName: 'Juan Dela Cruz', age: 32, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Roberto Santos', diagnosis: 'Acute Asthma Exacerbation', details: 'Wheezing and shortness of breath. Prescribed Albuterol inhaler. Recommended follow up.' },
  { id: 3, patientName: 'Ana Reyes', age: 28, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Migraine with Aura', details: 'Severe headache with visual disturbances. Prescribed Sumatriptan. Rest advised.' },
  { id: 4, patientName: 'Jake Sim', age: 23, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Roberto Santos', diagnosis: 'Fever', details: 'Temperature 38.5°C. Prescribed Paracetamol. Increase fluid intake.' },
  { id: 5, patientName: 'Jungwon Yang', age: 21, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Fever', details: 'Mild fever and body aches. Rest and hydration recommended.' },
];

/* ── Icons ── */
const Icons = {
    History: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
      <circle cx="8" cy="15" r="1" />
    </svg>
  ),
  PatientIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Details: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),
  StatsIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

/* ── Diagnosis Badge ── */
function DiagnosisBadge({ diagnosis }) {
  let color, bgColor;
  if (diagnosis.includes('Hypertension')) {
    color = C.red;
    bgColor = C.redBg;
  } else if (diagnosis.includes('Asthma')) {
    color = C.purple;
    bgColor = C.purpleBg;
  } else if (diagnosis.includes('Migraine')) {
    color = C.orange;
    bgColor = C.orangeBg;
  } else {
    color = C.green;
    bgColor = C.greenBg;
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color: color,
    }}>
      {diagnosis}
    </span>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <div
      style={{
        flex: 1,
        height: 124,
        backgroundColor: C.white,
        borderRadius: 10,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        padding: '22px 17px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.7)', lineHeight: '16px' }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#000', lineHeight: '38px', marginTop: 6 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 400, color: C.text2, marginTop: 6 }}>{sub}</div>
      </div>
      <div style={{ marginTop: 6 }}><Icon /></div>
    </div>
  );
}

/* ── Doctor Filter Dropdown ── */
function DoctorFilter({ value, onChange, doctors }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['All Doctors', ...doctors];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          height: 38,
          padding: '0 16px',
          backgroundColor: C.white,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 500,
          color: C.text1,
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = C.primary}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
      >
        <Icons.Filter />
        {value}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 4,
          zIndex: 999,
          backgroundColor: C.white,
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          minWidth: 150,
          overflow: 'hidden',
        }}>
          {options.map(option => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: option === value ? 700 : 400,
                color: C.text1,
                textAlign: 'left',
                fontFamily: "'Poppins', sans-serif",
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Diagnosis Filter Dropdown ── */
function DiagnosisFilter({ value, onChange, diagnoses }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['All Diagnoses', ...diagnoses];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          height: 38,
          padding: '0 16px',
          backgroundColor: C.white,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 500,
          color: C.text1,
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = C.primary}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
      >
        <Icons.Filter />
        {value}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 4,
          zIndex: 999,
          backgroundColor: C.white,
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          minWidth: 150,
          overflow: 'hidden',
        }}>
          {options.map(option => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: option === value ? 700 : 400,
                color: C.text1,
                textAlign: 'left',
                fontFamily: "'Poppins', sans-serif",
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function MedicalHistory() {
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);
  const [search, setSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('All Doctors');
  const [diagnosisFilter, setDiagnosisFilter] = useState('All Diagnoses');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Extract unique doctors and diagnoses for filters
  const uniqueDoctors = [...new Set(consultations.map(c => c.doctor))];
  const uniqueDiagnoses = [...new Set(consultations.map(c => c.diagnosis))];
  
  // Calculate stats
  const uniquePatients = new Map(consultations.map(c => [c.patientName, c])).size;
  const thisWeekCount = consultations.filter(c => {
    const consultDate = new Date(c.dateTime.split(' ')[0]);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return consultDate >= weekAgo;
  }).length;

  const stats = [
    { title: 'Total Visits', value: consultations.length, sub: 'All Consultations', icon: Icons.History },
    { title: 'This Week', value: thisWeekCount, sub: 'Recent consultations', icon: Icons.Calendar },
    { title: 'Unique Patients', value: uniquePatients, sub: 'Individual patients', icon: Icons.PatientIcon },
  ];

  // Apply filters
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(search.toLowerCase()) ||
      consultation.doctor.toLowerCase().includes(search.toLowerCase()) ||
      consultation.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchesDoctor = doctorFilter === 'All Doctors' || consultation.doctor === doctorFilter;
    const matchesDiagnosis = diagnosisFilter === 'All Diagnoses' || consultation.diagnosis === diagnosisFilter;
    return matchesSearch && matchesDoctor && matchesDiagnosis;
  });

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleDeleteConsultation = (consultationToDelete) => {
    setConsultations(consultations.filter(c => c.id !== consultationToDelete.id));
    setSelectedConsultation(null);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <Sidebar />

        <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>

          {/* Top Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
            height: 105,
            padding: '0 34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            flexShrink: 0,
            borderRadius: '0 0 10px 10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40,
                backgroundColor: C.primary,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(25,0,81,0.3)',
              }}>
                <Icons.History />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: '28px' }}>
                  Medical History
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '16px', marginTop: 6 }}>
                  View past consultations and patient records
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{
              width: 283, height: 38,
              backgroundColor: C.primary,
              borderRadius: 8,
              border: '0.5px solid rgba(25,0,81,0.8)',
              display: 'flex', alignItems: 'center',
              padding: '0 14px',
              gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <Icons.Search />
              <input
                type="text"
                placeholder="Search consultations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 20, padding: '20px 34px 0' }}>
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Consultation History Table */}
          <div style={{
            margin: '20px 34px 34px',
            backgroundColor: C.primary,
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            {/* Table Header with Filters */}
            <div style={{
              padding: '26px 27px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: '24px' }}>
                  Consultation History
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: '18px', marginTop: 10 }}>
                  {filteredConsultations.length} consultations found
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Doctor Filter Dropdown */}
                <DoctorFilter 
                  value={doctorFilter} 
                  onChange={setDoctorFilter} 
                  doctors={uniqueDoctors} 
                />
                {/* Diagnosis Filter Dropdown */}
                <DiagnosisFilter 
                  value={diagnosisFilter} 
                  onChange={setDiagnosisFilter} 
                  diagnoses={uniqueDiagnoses} 
                />
              </div>
            </div>

            {/* Column Labels */}
            <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '60px 1.5fr 80px 2fr 1.8fr 2fr 100px',
                padding: '12px 41px',
                alignItems: 'center',
              }}>
                {['#', 'PATIENT', 'AGE', 'DATE & TIME', 'DOCTOR', 'DIAGNOSIS', 'ACTIONS'].map((h, i) => (
                  <div key={i} style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {filteredConsultations.map((consultation, idx) => (
              <div
                key={consultation.id}
                style={{
                  backgroundColor: C.white,
                  borderTop: idx === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  padding: '0 41px',
                  height: 72,
                  display: 'grid',
                  gridTemplateColumns: '60px 1.5fr 80px 2fr 1.8fr 2fr 100px',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.white}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>{idx + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{consultation.patientName}</div>
                </div>
                <div style={{ fontSize: 13, color: C.text1 }}>{consultation.age}</div>
                <div style={{ fontSize: 13, color: C.text1 }}>{consultation.dateTime}</div>
                <div style={{ fontSize: 13, color: C.text1 }}>{consultation.doctor}</div>
                <div>
                  <DiagnosisBadge diagnosis={consultation.diagnosis} />
                </div>
                <div>
                  <button
                    onClick={() => handleViewDetails(consultation)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 6,
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.purpleBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Icons.Details />
                    Details
                  </button>
                </div>
              </div>
            ))}

            {filteredConsultations.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', backgroundColor: C.white }}>
                <div style={{ fontSize: 13, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>No consultations found</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedConsultation && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            backgroundColor: C.white,
            borderRadius: 16,
            width: 550,
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text1 }}>
                Consultation Details
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete consultation for ${selectedConsultation.patientName}?`)) {
                    handleDeleteConsultation(selectedConsultation);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: C.red,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.redBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete
              </button>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Patient Name</label>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text1 }}>{selectedConsultation.patientName}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Age</label>
                  <div style={{ fontSize: 14, color: C.text1 }}>{selectedConsultation.age}</div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Date & Time</label>
                  <div style={{ fontSize: 14, color: C.text1 }}>{selectedConsultation.dateTime}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Doctor</label>
                <div style={{ fontSize: 14, color: C.text1 }}>{selectedConsultation.doctor}</div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Diagnosis</label>
                <DiagnosisBadge diagnosis={selectedConsultation.diagnosis} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Consultation Notes</label>
                <div style={{
                  fontSize: 14,
                  color: C.text1,
                  backgroundColor: '#f8fafc',
                  padding: 16,
                  borderRadius: 12,
                  lineHeight: 1.5,
                }}>
                  {selectedConsultation.details}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
            }}>
              <button
                onClick={() => setSelectedConsultation(null)}
                style={{
                  height: 40,
                  padding: '0 24px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  backgroundColor: C.white,
                  color: C.text2,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.white;
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete consultation for ${selectedConsultation.patientName}?`)) {
                    handleDeleteConsultation(selectedConsultation);
                  }
                }}
                style={{
                  height: 40,
                  padding: '0 24px',
                  border: 'none',
                  borderRadius: 8,
                  backgroundColor: C.red,
                  color: C.white,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.red;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
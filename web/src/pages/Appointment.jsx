import React, { useState } from 'react';
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

/* ── Color Constants ── */
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
  red: '#ef4444',
  border: '#e2e8f0',
};

/* ── Mock Data - All with past dates so today's count starts at 0 ── */
const MOCK_PATIENTS = [
  { id: 1, patientName: 'John Doe', age: 32, gender: 'Male', doctor: 'Dr. Maria Cruz', date: '2026-04-07', symptoms: 'Fever, cough', diagnosis: 'Common cold', prescription: 'Paracetamol 500mg', remarks: 'Rest well' },
  { id: 2, patientName: 'Jane Smith', age: 28, gender: 'Female', doctor: 'Dr. Roberto Santos', date: '2026-04-07', symptoms: 'Headache, nausea', diagnosis: 'Migraine', prescription: 'Ibuprofen 400mg', remarks: 'Avoid bright lights' },
  { id: 3, patientName: 'Mike Johnson', age: 45, gender: 'Male', doctor: 'Dr. Maria Cruz', date: '2026-04-06', symptoms: 'Chest pain', diagnosis: 'Hypertension', prescription: 'Lisinopril 10mg', remarks: 'Monitor BP daily' },
];

const MOCK_DOCTORS = ['Dr. Maria Cruz', 'Dr. Roberto Santos', 'Dr. James Smith'];
const QUICK_TEMPLATES = [
  { label: 'Fever / Common Cold', symptoms: 'Fever, cough, runny nose', diagnosis: 'Common cold', prescription: 'Paracetamol 500mg, rest, fluids' },
  { label: 'Headache', symptoms: 'Headache, sensitivity to light', diagnosis: 'Tension headache', prescription: 'Ibuprofen 400mg, rest' },
  { label: 'Hypertension', symptoms: 'High BP, dizziness', diagnosis: 'Hypertension', prescription: 'Lisinopril 10mg daily' },
];

/* ── Icons ── */
const Icons = {
  Notes: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
  ),
  Patient: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8C19 5.8 17.2 4 15 4c-1.9 0-3.5 1.3-3.9 3H9c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h1v4c0 1.7 1.3 3 3 3s3-1.3 3-3v-1.1c1.2-.4 2-1.5 2-2.9V8zm-7 9c-.6 0-1-.4-1-1v-4h2v4c0 .6-.4 1-1 1zm5-8c0 1.1-.9 2-2 2h-1V9h3v0z"/>
    </svg>
  ),
  Summary: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  ),
  Template: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={C.text2}>
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
    </svg>
  ),
  Doctor: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={C.text2}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  ),
  Success: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
};

/* ── Shared Styles ── */
const poppins = "'Poppins', sans-serif";

const inputStyle = {
  width: '100%',
  height: 40,
  border: `1px solid #e2e8f0`,
  borderRadius: 8,
  padding: '0 12px',
  fontSize: 13,
  outline: 'none',
  fontFamily: poppins,
  backgroundColor: C.white,
  color: C.text1,
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: C.text2,
  display: 'block',
  marginBottom: 6,
  fontFamily: poppins,
};

const cardStyle = {
  backgroundColor: C.white,
  borderRadius: 10,
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};

/* ── Card Header ── */
function CardHeader({ icon, title, subtitle, right }) {
  return (
    <div style={{
      backgroundColor: C.primary,
      padding: '18px 24px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: subtitle ? 4 : 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.85)' }}>{icon}</div>
          <div style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, color: C.white }}>{title}</div>
        </div>
        {subtitle && (
          <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.65)', paddingLeft: 28 }}>
            {subtitle}
          </div>
        )}
      </div>
      {right && <div style={{ color: 'rgba(255,255,255,0.55)' }}>{right}</div>}
    </div>
  );
}

/* ── Success Toast ── */
function SuccessToast({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      backgroundColor: C.green,
      color: C.white,
      padding: '12px 20px',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontFamily: poppins,
      fontSize: 13,
      fontWeight: 500,
      zIndex: 1000,
      animation: 'slideIn 0.3s ease',
    }}>
      <Icons.Success />
      {message}
    </div>
  );
}

/* ── Main Component ── */
export default function Appointment() {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    doctor: MOCK_DOCTORS[0],
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    prescription: '',
    remarks: '',
  });

  const [consultations, setConsultations] = useState(MOCK_PATIENTS);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      symptoms: template.symptoms,
      diagnosis: template.diagnosis,
      prescription: template.prescription,
    }));
  };

  const handleSaveConsultation = () => {
    if (!formData.patientName.trim()) {
      alert('Please enter patient name');
      return;
    }
    
    const newConsultation = { 
      id: Date.now(), 
      ...formData,
      age: formData.age || 'N/A',
    };
    
    setConsultations(prev => [newConsultation, ...prev]);
    
    setFormData(prev => ({
      patientName: '', 
      age: '', 
      gender: 'Male',
      doctor: prev.doctor, 
      date: prev.date,
      symptoms: '', 
      diagnosis: '', 
      prescription: '', 
      remarks: '',
    }));
    
    setShowSuccess(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCount = consultations.filter(c => c.date === today).length;
  const totalConsultations = consultations.length;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
      fontFamily: poppins,
    }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>

        {/* ── Top Bar ── */}
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
              <Icons.Notes />
            </div>
            <div>
              <div style={{ fontFamily: poppins, fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: '28px' }}>
                Consultation Notes
              </div>
              <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '16px', marginTop: 6 }}>
                Document patient consultations and prescriptions
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveConsultation}
            style={{
              height: 38,
              padding: '0 20px',
              backgroundColor: C.primary,
              border: 'none',
              borderRadius: 8,
              color: C.white,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: poppins,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = C.primaryLight;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = C.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Icons.Plus />
            Save Consultation
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, padding: '20px 34px 34px', display: 'flex', gap: 20 }}>

          {/* Left Column */}
          <div style={{ flex: '0 0 auto', width: 'calc(65% - 10px)', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Patient Information */}
            <div style={cardStyle}>
              <CardHeader
                icon={<Icons.Patient />}
                title="Patient Information"
                subtitle="Enter or select patient details"
              />
              <div style={{ padding: '20px 24px' }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Patient Name</label>
                  <input
                    type="text" name="patientName" value={formData.patientName}
                    onChange={handleInputChange} placeholder="Enter patient name"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input type="number" name="age" value={formData.age}
                      onChange={handleInputChange} placeholder="Age" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}
                      style={{ ...inputStyle, appearance: 'auto' }}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Doctor</label>
                    <select name="doctor" value={formData.doctor} onChange={handleInputChange}
                      style={{ ...inputStyle, appearance: 'auto' }}>
                      {MOCK_DOCTORS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={labelStyle}>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange}
                    style={{ ...inputStyle, width: 'calc(33.33% - 8px)' }}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div style={cardStyle}>
              <CardHeader
                icon={<Icons.Stethoscope />}
                title="Consultation Details"
                subtitle="Document symptoms, diagnosis, and treatment"
              />
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Symptoms', name: 'symptoms', placeholder: 'Describe symptoms...', rows: 3 },
                  { label: 'Diagnosis', name: 'diagnosis', placeholder: 'Enter diagnosis...', rows: 3 },
                  { label: 'Prescription', name: 'prescription', placeholder: 'Enter prescription...', rows: 3 },
                  { label: 'Remarks', name: 'remarks', placeholder: 'Additional remarks...', rows: 2 },
                ].map(field => (
                  <div key={field.name}>
                    <label style={labelStyle}>{field.label}</label>
                    <textarea
                      name={field.name} value={formData[field.name]}
                      onChange={handleInputChange} rows={field.rows}
                      placeholder={field.placeholder}
                      style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Consultation Summary */}
            <div style={cardStyle}>
              <CardHeader
                icon={<Icons.Summary />}
                title="Consultation Summary"
                right={<Icons.Patient />}
              />
              <div style={{ padding: '8px 24px 16px' }}>
                {[
                  { icon: <Icons.Patient />, label: 'Patient Name', value: formData.patientName },
                  { icon: <Icons.Calendar />, label: 'Date', value: formData.date },
                  { icon: <Icons.Doctor />, label: 'Doctor', value: formData.doctor },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0',
                    borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
                  }}>
                    <div style={{ color: C.text2, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: poppins, fontSize: 11, color: C.text2, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 600, color: C.text1 }}>
                        {item.value || <span style={{ color: C.text2, fontWeight: 400 }}>—</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div style={cardStyle}>
              <CardHeader
                icon={<Icons.Template />}
                title="Quick Templates"
                subtitle="Pre-filled consultation templates"
              />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {QUICK_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickTemplate(t)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      backgroundColor: '#f9fafb',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.text1,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: poppins,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = C.primary;
                      e.currentTarget.style.color = C.white;
                      e.currentTarget.style.borderColor = C.primary;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(25,0,81,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.color = C.text1;
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Consultations */}
            <div style={cardStyle}>
              <CardHeader
                icon={<Icons.Clock />}
                title="Today's Consultations"
                subtitle="Today's consultation records"
              />
              <div style={{
                padding: '28px 24px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: 56, fontWeight: 700, color: C.primary,
                  lineHeight: 1, marginBottom: 8, fontFamily: poppins,
                }}>
                  {todayCount}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 13, color: C.text2, marginBottom: 4 }}>
                  Consultations saved today
                </div>
                <div style={{ 
                  fontFamily: poppins, fontSize: 11, color: C.textMuted,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${C.border}`,
                  width: '100%',
                  textAlign: 'center',
                }}>
                  Total: {totalConsultations} consultation{totalConsultations !== 1 ? 's' : ''} recorded
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <SuccessToast 
          message="Consultation saved successfully!" 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
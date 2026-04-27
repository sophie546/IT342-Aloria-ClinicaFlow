import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../../shared/components/Sidebar';

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
};

/* ── Mock Patient Data ── */
const MOCK_PATIENTS = [
  { id: 1, firstName: 'Maria', lastName: 'Santos', age: 45, address: '123 Main St, Barangay Centro', contact: '09123456789', lastVisit: 'Jan 15, 2024', gender: 'Female' },
  { id: 2, firstName: 'Juan', lastName: 'Dela Cruz', age: 32, address: '456 Oak Ave, Barangay San Jose', contact: '09234567890', lastVisit: 'Feb 03, 2024', gender: 'Male' },
  { id: 3, firstName: 'Ana', lastName: 'Reyes', age: 28, address: '789 Pine Rd, Barangay Poblacion', contact: '09345678901', lastVisit: 'Dec 20, 2023', gender: 'Female' },
  { id: 4, firstName: 'Jake', lastName: 'Sim', age: 23, address: '430 Oak Ave, Barangay San Jose', contact: '09957150347', lastVisit: 'Nov 15, 2025', gender: 'Male' },
  { id: 5, firstName: 'Jungwon', lastName: 'Yang', age: 21, address: '431 Oak Ave, Barangay San Jose', contact: '09691664673', lastVisit: 'Feb 09, 2025', gender: 'Male' },
];

/* ── Icons ── */
const Icons = {
  Users: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.primary}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Male: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.purple}>
      <path d="M9 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-14c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
    </svg>
  ),
  Female: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.orange}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6-2.28 0-2.56 4-4 6-4s6 1.44 6 4c-1.57 1.46-3.97 2.28-6 2.28z"/>
    </svg>
  ),
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  ),
  Add: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  Delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  ),
  More: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={C.text2}>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>
  ),
};

/* ── Gender Filter Dropdown ── */
function GenderFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['All Genders', 'Male', 'Female'];

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

/* ── Stat Card ── */
function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <div style={{
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
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.7)', lineHeight: '16px' }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#000', lineHeight: '38px', marginTop: 6 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 400, color: C.text2, marginTop: 6 }}>{sub}</div>
      </div>
      <div style={{ marginTop: 6 }}><Icon /></div>
    </div>
  );
}

/* ── Patient Table Row with Fixed Dropdown ── */
function PatientRow({ patient, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { 
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{
      backgroundColor: C.white,
      borderTop: index === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
      padding: '0 41px',
      minHeight: 72,
      display: 'grid',
      gridTemplateColumns: '60px 1.5fr 80px 2fr 1.5fr 1.5fr 50px',
      alignItems: 'center',
      transition: 'background-color 0.2s ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.white}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>{index + 1}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{patient.firstName} {patient.lastName}</div>
      </div>
      <div style={{ fontSize: 13, color: C.text1 }}>{patient.age}</div>
      <div style={{ fontSize: 13, color: C.text1 }}>{patient.address}</div>
      <div style={{ fontSize: 13, color: C.text1 }}>{patient.contact}</div>
      <div style={{ fontSize: 13, color: C.text1 }}>{patient.lastVisit}</div>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 8, 
            borderRadius: 4, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
          }}
        >
          <Icons.More />
        </button>
        {menuOpen && (
          <div style={{
            position: 'fixed',
            right: 'auto',
            left: menuRef.current ? menuRef.current.getBoundingClientRect().right - 120 : 'auto',
            top: menuRef.current ? menuRef.current.getBoundingClientRect().bottom + 5 : 'auto',
            zIndex: 9999,
            backgroundColor: C.white,
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: 120,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}>
            <button
              onClick={() => { 
                onEdit(patient); 
                setMenuOpen(false); 
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: C.text1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
                fontFamily: "'Poppins', sans-serif",
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icons.Edit /> Edit
            </button>
            <button
              onClick={() => { 
                onDelete(patient); 
                setMenuOpen(false); 
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
                fontFamily: "'Poppins', sans-serif",
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icons.Delete /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Patients() {
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All Genders'); // Added gender filter state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Updated filter to include gender
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === 'All Genders' || patient.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const stats = [
    { title: 'Total Patients', value: patients.length, sub: 'Registered patients', icon: Icons.Users },
    { title: 'Male Patients', value: patients.filter(p => p.gender === 'Male').length, sub: 'In system', icon: Icons.Male },
    { title: 'Female Patients', value: patients.filter(p => p.gender === 'Female').length, sub: 'In system', icon: Icons.Female },
  ];

  const handleAddPatient = () => {
    setShowAddModal(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowAddModal(true);
  };

  const handleDeletePatient = (patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
      setPatients(patients.filter(p => p.id !== patient.id));
    }
  };

  const handleSavePatient = (patientData) => {
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...patientData, id: p.id } : p));
    } else {
      setPatients([...patients, { ...patientData, id: patients.length + 1 }]);
    }
    setShowAddModal(false);
    setEditingPatient(null);
  };

  return (
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: '28px' }}>
                Patient Management
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '16px', marginTop: 6 }}>
                Add, edit, and manage patient records
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
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
                placeholder="Search patients..."
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

            {/* Add Patient Button */}
            <button
              onClick={handleAddPatient}
              style={{
                height: 38,
                padding: '0 20px',
                backgroundColor: C.primary,
                border: 'none',
                borderRadius: 8,
                color: C.white,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.primaryLight;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icons.Add />
              Add Patient
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: 20, padding: '20px 34px 0' }}>
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Patients Table */}
        <div style={{
          margin: '20px 34px 34px',
          backgroundColor: C.primary,
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {/* Table Header with Gender Filter */}
          <div style={{
            padding: '26px 27px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: '24px' }}>
                Patient Records
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: '18px', marginTop: 10 }}>
                {filteredPatients.length} patients found
              </div>
            </div>
            
            {/* Gender Filter Dropdown */}
            <GenderFilter value={genderFilter} onChange={setGenderFilter} />
          </div>

          {/* Column Labels */}
          <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.5fr 80px 2fr 1.5fr 1.5fr 50px',
              padding: '12px 41px',
              alignItems: 'center',
            }}>
              {['#', 'PATIENT', 'AGE', 'ADDRESS', 'CONTACT', 'LAST VISIT', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {filteredPatients.map((patient, idx) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              index={idx}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          ))}

          {filteredPatients.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: C.white }}>
              <div style={{ fontSize: 13, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>No patients found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <PatientModal
          patient={editingPatient}
          onClose={() => {
            setShowAddModal(false);
            setEditingPatient(null);
          }}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
}

/* ── Patient Modal Component ── */
function PatientModal({ patient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    age: patient?.age || '',
    address: patient?.address || '',
    contact: patient?.contact || '',
    lastVisit: patient?.lastVisit || '',
    gender: patient?.gender || 'Male',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
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
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text1 }}>
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    width: '100%',
                    height: 42,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '0 14px',
                    fontSize: 13,
                    color: C.text1,
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = C.primary}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{
                    width: '100%',
                    height: 42,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '0 14px',
                    fontSize: 13,
                    color: C.text1,
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Age *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  style={{
                    width: '100%',
                    height: 42,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '0 14px',
                    fontSize: 13,
                    color: C.text1,
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{
                    width: '100%',
                    height: 42,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '0 14px',
                    fontSize: 13,
                    color: C.text1,
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    backgroundColor: C.white,
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{
                  width: '100%',
                  height: 42,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0 14px',
                  fontSize: 13,
                  color: C.text1,
                  outline: 'none',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Contact Number *</label>
              <input
                type="tel"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                style={{
                  width: '100%',
                  height: 42,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0 14px',
                  fontSize: 13,
                  color: C.text1,
                  outline: 'none',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Last Visit</label>
              <input
                type="text"
                value={formData.lastVisit}
                onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
                placeholder="e.g., Jan 15, 2024"
                style={{
                  width: '100%',
                  height: 42,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0 14px',
                  fontSize: 13,
                  color: C.text1,
                  outline: 'none',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
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
              type="button"
              onClick={onClose}
              style={{
                height: 40,
                padding: '0 24px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                backgroundColor: C.white,
                fontSize: 13,
                fontWeight: 600,
                color: C.text2,
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
              type="submit"
              style={{
                height: 40,
                padding: '0 24px',
                border: 'none',
                borderRadius: 8,
                backgroundColor: C.primary,
                color: C.white,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.primaryLight;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {patient ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
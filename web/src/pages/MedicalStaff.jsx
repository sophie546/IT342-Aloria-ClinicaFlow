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

/* ── Status Config ── */
const statusConfig = {
  Available: { label: 'Available', color: C.green },
  Busy: { label: 'Busy', color: C.orange },
  'Off Duty': { label: 'Off Duty', color: C.red },
};

/* ── Mock Staff Data ── */
const MOCK_STAFF = [
  { id: 1, staffId: 'STAFF-001', name: 'Dr. Maria Cruz', role: 'Doctor', specialization: 'Cardiology', email: 'maria.cruz@clinic.com', contact: '09123456789', availability: 'Available' },
  { id: 2, staffId: 'STAFF-002', name: 'Dr. Roberto Santos', role: 'Doctor', specialization: 'Neurology', email: 'roberto.santos@clinic.com', contact: '09358521578', availability: 'Busy' },
  { id: 3, staffId: 'STAFF-003', name: 'Nurse Maria Reyes', role: 'Nurse', specialization: 'Emergency Care', email: 'maria.reyes@clinic.com', contact: '09059425894', availability: 'Off Duty' },
  { id: 4, staffId: 'STAFF-004', name: 'Dr. James Smith', role: 'Doctor', specialization: 'Pediatrics', email: 'james.smith@clinic.com', contact: '09182345678', availability: 'Available' },
  { id: 5, staffId: 'STAFF-005', name: 'Nurse Anna Dimagiba', role: 'Nurse', specialization: 'Surgery', email: 'anna.dimagiba@clinic.com', contact: '09271234567', availability: 'Available' },
];

/* ── Icons ── */
const Icons = {
  Users: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.primary}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  DoctorIcon: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.purple}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>
  ),
  NurseIcon: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.green}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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

/* ── Status Badge with Dot (matching your example) ── */
function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: 12,
      fontWeight: 500,
      color: cfg?.color,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: cfg?.color,
        display: 'inline-block',
      }} />
      {cfg?.label}
    </span>
  );
}

/* ── Role Filter Dropdown ── */
function RoleFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['All Roles', 'Doctor', 'Nurse'];

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

/* ── Status Filter Dropdown ── */
function StatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['All Status', 'Available', 'Busy', 'Off Duty'];

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

/* ── Staff Table Row ── */
function StaffRow({ staff, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{
      backgroundColor: C.white,
      borderTop: index === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
      padding: '0 41px',
      height: 82,
      display: 'grid',
      gridTemplateColumns: '60px 1.5fr 100px 1.5fr 1.8fr 1.2fr 110px 50px',
      alignItems: 'center',
      transition: 'background-color 0.2s ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.white}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>{index + 1}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{staff.name}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>#{staff.staffId}</div>
      </div>
      <div>
        <span style={{
          backgroundColor: staff.role === 'Doctor' ? C.purpleBg : C.greenBg,
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          color: staff.role === 'Doctor' ? C.purple : C.green,
        }}>{staff.role}</span>
      </div>
      <div style={{ fontSize: 13, color: C.text1 }}>{staff.specialization}</div>
      <div style={{ fontSize: 12, color: C.text2 }}>{staff.email}</div>
      <div style={{ fontSize: 13, color: C.text1 }}>{staff.contact}</div>
      <div><StatusBadge status={staff.availability} /></div>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}
        >
          <Icons.More />
        </button>
        {menuOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            zIndex: 999,
            backgroundColor: C.white,
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            minWidth: 120,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => { onEdit(staff); setMenuOpen(false); }}
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
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icons.Edit /> Edit
            </button>
            <button
              onClick={() => { onDelete(staff); setMenuOpen(false); }}
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
export default function MedicalStaff() {
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(search.toLowerCase()) ||
                         member.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'All Status' || member.availability === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { title: 'Total Staff', value: staff.length, sub: 'All medical staff', icon: Icons.Users },
    { title: 'Doctors', value: staff.filter(s => s.role === 'Doctor').length, sub: 'Medical Physicians', icon: Icons.DoctorIcon },
    { title: 'Nurses', value: staff.filter(s => s.role === 'Nurse').length, sub: 'Nursing staff', icon: Icons.NurseIcon },
    { title: 'Available Now', value: staff.filter(s => s.availability === 'Available').length, sub: 'Currently active', icon: Icons.Users },
  ];

  const handleAddStaff = () => {
    setShowAddModal(true);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setShowAddModal(true);
  };

  const handleDeleteStaff = (staff) => {
    if (window.confirm(`Are you sure you want to delete ${staff.name}?`)) {
      setStaff(staff.filter(s => s.id !== staff.id));
    }
  };

  const handleSaveStaff = (staffData) => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...staffData, id: s.id, staffId: s.staffId } : s));
    } else {
      setStaff([...staff, { ...staffData, id: staff.length + 1, staffId: `STAFF-${String(staff.length + 1).padStart(3, '0')}` }]);
    }
    setShowAddModal(false);
    setEditingStaff(null);
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
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: '28px' }}>
                Staff Management
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '16px', marginTop: 6 }}>
                Manage doctors, nurses, and medical staff
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
                placeholder="Search staff..."
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

            {/* Add Staff Button */}
            <button
              onClick={handleAddStaff}
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
              Add Staff
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: 20, padding: '20px 34px 0' }}>
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Staff Directory Table */}
        <div style={{
          margin: '20px 34px 34px',
          backgroundColor: C.primary,
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {/* Table Header with Role Filter and Status Filter */}
          <div style={{
            padding: '26px 27px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: '24px' }}>
                Staff Directory
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: '18px', marginTop: 10 }}>
                {filteredStaff.length} staff members found
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Role Filter Dropdown */}
              <RoleFilter value={roleFilter} onChange={setRoleFilter} />
              {/* Status Filter Dropdown */}
              <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>
          </div>

          {/* Column Labels */}
          <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.5fr 100px 1.5fr 1.8fr 1.2fr 110px 50px',
              padding: '12px 41px',
              alignItems: 'center',
            }}>
              {['#', 'STAFF', 'ROLE', 'SPECIALIZATION', 'EMAIL', 'CONTACT', 'AVAILABILITY', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {filteredStaff.map((staff, idx) => (
            <StaffRow
              key={staff.id}
              staff={staff}
              index={idx}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
            />
          ))}

          {filteredStaff.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: C.white }}>
              <div style={{ fontSize: 13, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>No staff members found</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <StaffModal
          staff={editingStaff}
          onClose={() => {
            setShowAddModal(false);
            setEditingStaff(null);
          }}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
}

/* ── Staff Modal Component ── */
function StaffModal({ staff, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    role: staff?.role || 'Doctor',
    specialization: staff?.specialization || '',
    email: staff?.email || '',
    contact: staff?.contact || '',
    availability: staff?.availability || 'Available',
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
            {staff ? 'Edit Staff Member' : 'Add New Staff'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Specialization *</label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 6 }}>Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
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
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Off Duty">Off Duty</option>
              </select>
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
              {staff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
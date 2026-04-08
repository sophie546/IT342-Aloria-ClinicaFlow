import React, { useState, useEffect, useRef } from 'react';
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
  orange: '#ed6c02',
  orangeBg: 'rgba(237,108,2,0.1)',
  consulting: '#667eea',
  consultingBg: 'rgba(102,126,234,0.12)',
  green: '#10b981',
  greenBg: 'rgba(16,185,129,0.12)',
};

const MOCK = [
  { id: 1, queueNumber: 1, patient: { firstName: 'Jungwon', lastName: 'Yang', age: 45, patientId: 'ID: 1' }, status: 'CONSULTING', assignedDoctor: 'Dr. Maria Cruz', arrivalTime: '15 mins.' },
  { id: 2, queueNumber: 2, patient: { firstName: 'Evan', lastName: 'Lee', age: 32, patientId: 'ID: 2' }, status: 'WAITING', assignedDoctor: 'Dr. Maria Cruz', arrivalTime: '30 mins.' },
  { id: 3, queueNumber: 3, patient: { firstName: 'Jake', lastName: 'Sim', age: 28, patientId: 'ID: 3' }, status: 'WAITING', assignedDoctor: 'Dr. Roberto Santos', arrivalTime: '45 mins.' },
  { id: 4, queueNumber: 4, patient: { firstName: 'Sarah', lastName: 'Johnson', age: 45, patientId: 'ID: 4' }, status: 'COMPLETED', assignedDoctor: 'Dr. James Smith', arrivalTime: '1 hr' },
];

const statusConfig = {
  WAITING:    { color: C.orange,     bg: C.orangeBg,     label: 'Waiting' },
  CONSULTING: { color: C.consulting, bg: C.consultingBg, label: 'Consulting' },
  COMPLETED:  { color: C.green,      bg: C.greenBg,      label: 'Completed' },
};

/* ── Icons (inline SVG) ── */
const Icons = {
  People: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.primary}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Schedule: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.orange}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
    </svg>
  ),
  Medical: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.consulting}>
      <path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.12 15.87 0 13.3 0c-1.47 0-2.74.68-3.59 1.74L8.5 3.37 7.29 1.74C6.44.68 5.17 0 3.7 0 1.13 0-1 2.12-1 4.7c0 .44.11.86.18 1.3H-3v2h23v-2zM3.7 4c-.66 0-1.2-.54-1.2-1.2s.54-1.2 1.2-1.2c.38 0 .72.18.95.45l1.74 2.18c-.42.47-1.01.77-1.69.77zm9.6 0c-.68 0-1.27-.3-1.69-.77l1.74-2.18c.23-.27.57-.45.95-.45.66 0 1.2.54 1.2 1.2S13.96 4 13.3 4zM4 19h16v2H4v-2zm2-8v6h2v-6H6zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2z"/>
    </svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={C.green}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>
  ),
  More: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={C.text2}>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  Delete: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  ),
};

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

/* ── Status Badge ── */
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

/* ── Avatar ── */
function PatientAvatar({ initials }) {
  return (
    <div style={{
      width: 39,
      height: 39,
      backgroundColor: C.primaryLight,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
      boxShadow: '0 3px 6px rgba(102,126,234,0.3)',
    }}>
      {initials}
    </div>
  );
}

/* ── Row Actions Dropdown ── */
function RowMenu({ patient, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}
      >
        <Icons.More />
      </button>
      {open && (
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
            onClick={() => { onEdit(patient); setOpen(false); }}
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
            onClick={() => { onDelete(patient); setOpen(false); }}
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
  );
}

/* ── Edit Dialog ── */
function EditDialog({ open, patient, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (patient) {
      const [firstName = '', ...rest] = (patient.name || '').split(' ');
      const lastName = rest.join(' ');
      setForm({ firstName, lastName, age: patient.age, status: patient.status, assignedDoctor: patient.assignedTo });
    }
  }, [patient]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: C.white,
        borderRadius: 12,
        width: 480,
        padding: '28px 28px 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 20 }}>Edit Patient</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'First Name', key: 'firstName', type: 'text' },
            { label: 'Last Name', key: 'lastName', type: 'text' },
            { label: 'Age', key: 'age', type: 'number' },
            { label: 'Assigned Doctor', key: 'assignedDoctor', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                type={type}
                value={form[key] || ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={{
                  width: '100%', height: 38, border: '1px solid #e2e8f0', borderRadius: 6,
                  padding: '0 12px', fontSize: 13, color: C.text1, outline: 'none',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: 'block', marginBottom: 4 }}>Status</label>
            <select
              value={form.status || ''}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                width: '100%', height: 38, border: '1px solid #e2e8f0', borderRadius: 6,
                padding: '0 12px', fontSize: 13, color: C.text1, outline: 'none',
                fontFamily: "'Poppins', sans-serif", backgroundColor: C.white,
              }}
            >
              {['WAITING', 'CONSULTING', 'COMPLETED'].map(s => (
                <option key={s} value={s}>{statusConfig[s]?.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 18px', border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: C.white, fontSize: 13, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)} style={{ height: 36, padding: '0 18px', border: 'none', borderRadius: 6, backgroundColor: C.primary, color: C.white, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Dialog ── */
function DeleteDialog({ open, patient, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: C.white, borderRadius: 12, width: 400,
        padding: '28px 28px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 12 }}>Confirm Delete</div>
        <div style={{ fontSize: 13, color: C.text2 }}>
          Are you sure you want to delete <strong style={{ color: C.text1 }}>{patient?.name}</strong>?
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 18px', border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: C.white, fontSize: 13, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ height: 36, padding: '0 18px', border: 'none', borderRadius: 6, backgroundColor: '#ef4444', color: C.white, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Filter Dropdown ── */
function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['all', 'WAITING', 'CONSULTING', 'COMPLETED'];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = value === 'all' ? 'All Status' : statusConfig[value]?.label;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 32,
          padding: '0 14px',
          backgroundColor: C.white,
          border: '0.5px solid rgba(0,0,0,0.6)',
          borderRadius: 6,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.75)',
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Icons.Filter />
        {label}
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
          minWidth: 130,
          overflow: 'hidden',
        }}>
          {options.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              style={{
                width: '100%',
                padding: '9px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: s === value ? 700 : 400,
                color: C.text1,
                textAlign: 'left',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {s === 'all' ? 'All Status' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function PatientQueue() {
  const [queue, setQueue] = useState(MOCK);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const rows = queue
    .filter(item => {
      const patientName = `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase();
      const doctorName = item.assignedDoctor.toLowerCase();
      const searchTerm = search.toLowerCase();
      
      // Search by patient name OR doctor name
      return (patientName.includes(searchTerm) || doctorName.includes(searchTerm)) &&
        (filterStatus === 'all' || item.status === filterStatus);
    })
    .map(item => ({
      id: item.id,
      initials: `${item.patient.firstName[0]}${item.patient.lastName[0]}`,
      name: `${item.patient.firstName} ${item.patient.lastName}`,
      age: item.patient.age,
      assignedTo: item.assignedDoctor,
      arrivalTime: item.arrivalTime,
      status: item.status,
      queueNumber: item.queueNumber,
      patientId: item.patient.patientId,
    }));

  const stats = [
    { title: 'Total Patients', value: queue.length, sub: 'In queue today', icon: Icons.People },
    { title: 'Waiting', value: queue.filter(q => q.status === 'WAITING').length, sub: 'In queue', icon: Icons.Schedule },
    { title: 'Consulting', value: queue.filter(q => q.status === 'CONSULTING').length, sub: 'In progress', icon: Icons.Medical },
    { title: 'Completed', value: queue.filter(q => q.status === 'COMPLETED').length, sub: 'Today', icon: Icons.Check },
  ];

  const handleSave = (form) => {
    setQueue(prev => prev.map(item =>
      item.id === selectedRow?.id
        ? {
            ...item,
            patient: { ...item.patient, firstName: form.firstName, lastName: form.lastName, age: Number(form.age) },
            status: form.status,
            assignedDoctor: form.assignedDoctor,
          }
        : item
    ));
    setEditOpen(false);
  };

  const handleDelete = () => {
    setQueue(prev => prev.filter(item => item.id !== selectedRow?.id));
    setDeleteOpen(false);
  };

  const COLS = '56px 50px 1fr 80px 140px 180px 130px 44px';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #C0B4DC 50%, #DFDCE6 100%)',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <Sidebar />

      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: '28px' }}>
                Patient Queue
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(25,0,81,0.65)', lineHeight: '16px', marginTop: 6 }}>
                Real-time patient monitoring
              </div>
            </div>
          </div>

          {/* Search Bar - Updated placeholder */}
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
              placeholder="Search by patient or doctor..."
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

        {/* ── Stat Cards ── */}
        <div style={{ display: 'flex', gap: 20, padding: '20px 34px 0' }}>
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* ── Queue Table ── */}
        <div style={{
          margin: '20px 34px 34px',
          backgroundColor: C.primary,
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            padding: '26px 27px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: '24px' }}>
                Patient Queue
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: '18px', marginTop: 10 }}>
                {rows.length} patients in queue
              </div>
            </div>
            <FilterDropdown value={filterStatus} onChange={setFilterStatus} />
          </div>

          {/* Column Labels */}
          <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              padding: '10px 41px',
              alignItems: 'center',
            }}>
              {['#', '', 'PATIENT', 'AGE', 'STATUS', 'DOCTOR', 'Waiting Time', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div
              key={row.id}
              style={{
                backgroundColor: C.white,
                borderTop: idx === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                padding: '0 41px',
                height: 92,
                display: 'grid',
                gridTemplateColumns: COLS,
                alignItems: 'center',
                transition: 'background-color 0.12s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.white}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>
                {row.queueNumber}
              </div>
              <PatientAvatar initials={row.initials} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, fontFamily: "'Poppins', sans-serif", lineHeight: '18px' }}>{row.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, fontFamily: "'Poppins', sans-serif", marginTop: 3 }}>{row.patientId}</div>
              </div>
              <div style={{ fontSize: 13, color: C.text1, fontFamily: "'Poppins', sans-serif" }}>{row.age}</div>
              <StatusBadge status={row.status} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.primaryLight, fontFamily: "'Poppins', sans-serif" }}>{row.assignedTo}</div>
              <div style={{ fontSize: 13, color: C.text1, fontFamily: "'Poppins', sans-serif" }}>{row.arrivalTime}</div>
              <RowMenu
                patient={row}
                onEdit={(p) => { setSelectedRow(p); setEditOpen(true); }}
                onDelete={(p) => { setSelectedRow(p); setDeleteOpen(true); }}
              />
            </div>
          ))}

          {rows.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: C.white }}>
              <div style={{ fontSize: 13, color: C.text2, fontFamily: "'Poppins', sans-serif" }}>No patients found</div>
            </div>
          )}
        </div>
      </div>

      <EditDialog
        open={editOpen}
        patient={selectedRow}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
      <DeleteDialog
        open={deleteOpen}
        patient={selectedRow}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
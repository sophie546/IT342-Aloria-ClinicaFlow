import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Keyframes & global styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ripple {
    from { transform: scale(0.8); opacity: 1; }
    to   { transform: scale(2.2); opacity: 0; }
  }

  .page-wrap      { animation: pageIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .card-wrap      { animation: pageIn 0.5s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
  .modal-overlay  { animation: fadeIn 0.22s ease both; }
  .modal-box      { animation: slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both; }

  .tab-btn:hover        { background: rgba(25,0,81,0.06) !important; color: #190051 !important; }
  .edit-btn:hover       { background: #2d0a6e !important; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(25,0,81,0.38) !important; }
  .save-btn:hover       { background: #2d0a6e !important; transform: translateY(-1px); }
  .cancel-btn:hover     { background: rgba(25,0,81,0.07) !important; }
  .status-row:hover span { color: #190051 !important; }

  .avatar-upload-wrap:hover .avatar-overlay { opacity: 1 !important; }
  .avatar-upload-wrap:hover .avatar-img,
  .avatar-upload-wrap:hover .avatar-initials { filter: brightness(0.7); }

  .photo-option:hover { background: rgba(25,0,81,0.06) !important; }
  .remove-btn:hover   { background: rgba(220,38,38,0.08) !important; color: #dc2626 !important; }

  input:focus, select:focus {
    outline: none;
    border-color: #190051 !important;
    box-shadow: 0 0 0 3px rgba(25,0,81,0.1) !important;
  }
  input::placeholder { color: rgba(25,0,81,0.3); }

  .pw-input-wrap { position: relative; }
  .pw-input-wrap input { padding-right: 42px !important; }
  .pw-eye { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(25,0,81,0.35); display: flex; align-items: center; transition: color 0.15s ease; }
  .pw-eye:hover { color: #190051; }
  .chg-pw-btn:hover { background: #2d0a6e !important; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(25,0,81,0.38) !important; }
  .logout-btn:hover { background: #6c5ce7 !important; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(108,92,231,0.4) !important; }
  .confirm-yes:hover { background: #dc2626 !important; }
  .confirm-no:hover  { background: rgba(25,0,81,0.08) !important; }
`;

/* ─── Reusable form field ─── */
function Field({ label, value, onChange, type = 'text', options }) {
  const base = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid rgba(25,0,81,0.15)', fontFamily: "'Poppins', sans-serif",
    fontSize: 13.5, color: '#190051', background: '#faf9fc',
    transition: 'all 0.18s ease', boxSizing: 'border-box',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(25,0,81,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} style={base} />
      )}
    </div>
  );
}

export default function AccountSettings() {
  const navigate    = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab,         setActiveTab]         = useState('Profile');
  const [availabilityStatus,setAvailabilityStatus] = useState('Busy');
  const [showModal,         setShowModal]          = useState(false);
  const [user,              setUser]               = useState(null);

  /* security tab state */
  const [currentPw,   setCurrentPw]   = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwMsg,       setPwMsg]       = useState(null); // {type:'success'|'error', text}
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [photoPreview,      setPhotoPreview]       = useState(null); // base64 for display
  const [photoFile,         setPhotoFile]          = useState(null); // File object
  const [showPhotoMenu,     setShowPhotoMenu]      = useState(false);
  const [dragOver,          setDragOver]           = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', gender: 'Female',
    email: '', phone: '', specialization: '', department: '', role: '',
  });

  /* Load user from localStorage */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      if (u.photo) setPhotoPreview(u.photo);
      setForm({
        firstName:      u.firstName      || u.first_name    || '',
        lastName:       u.lastName       || u.last_name     || '',
        age:            u.age            || '',
        gender:         u.gender         || 'Female',
        email:          u.email          || '',
        phone:          u.phone          || '',
        specialization: u.specialization || '',
        department:     u.department     || '',
        role:           u.role           || '',
      });
    }
  }, []);

  /* Close photo menu on outside click */
  useEffect(() => {
    if (!showPhotoMenu) return;
    const handler = () => setShowPhotoMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showPhotoMenu]);

  /* ── helpers ── */
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const getInitials = () => {
    const fn = form.firstName || 'M';
    const ln = form.lastName  || 'C';
    return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = () => {
    const fn = form.firstName, ln = form.lastName;
    const prefix = form.role?.toLowerCase() === 'doctor' ? 'Dr. ' : '';
    if (fn && ln) return `${prefix}${fn} ${ln}`;
    if (!user)    return 'Dr. Maria Cruz';
    return user.email?.split('@')[0] || 'User';
  };

  const getRoleDisplay = () => {
    const role = form.role?.toLowerCase();
    if (role === 'doctor') return 'Senior Physician';
    if (role === 'nurse')  return 'Nurse';
    return form.role || 'Staff Member';
  };

  const getAvatarColor = () => {
    const role = form.role?.toLowerCase();
    if (role === 'nurse') return '#10b981';
    return '#190051';
  };

  /* ── Photo handling ── */
  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
      setPhotoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    processFile(e.target.files[0]);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setPhotoFile(null);
    setShowPhotoMenu(false);
  };

  /* ── Save ── */
  const handleSave = () => {
    const updated = {
      ...user,
      firstName: form.firstName, first_name: form.firstName,
      lastName:  form.lastName,  last_name:  form.lastName,
      age: form.age, gender: form.gender, email: form.email,
      phone: form.phone, specialization: form.specialization,
      department: form.department, role: form.role,
      photo: photoPreview || null,
    };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setShowModal(false);
    setShowPhotoMenu(false);
  };

  /* ── Change Password ── */
  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwMsg({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    // In a real app you'd call your auth service here
    setPwMsg({ type: 'success', text: 'Password changed successfully!' });
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwMsg(null), 4000);
  };

  const handleTabClick = (key) => {
    if (key === 'Home') { navigate('/patient-queue'); return; }
    setActiveTab(key);
  };

  const tabs = [
    { key: 'Home',     label: 'Home',     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
    { key: 'Profile',  label: 'Profile',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { key: 'Security', label: 'Secuirty', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg> },
  ];

  const statusConfig = [
    { label: 'Busy',      color: '#22c55e' },
    { label: 'Available', color: '#22c55e' },
    { label: 'Offline',   color: '#6b7280' },
  ];

  const badgeStyle = {
    Busy:      { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
    Available: { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    Offline:   { bg: '#f9fafb', color: '#374151', border: '#d1d5db' },
  }[availabilityStatus];

  /* ── Shared avatar renderer ── */
  const AvatarCircle = ({ size = 80, fontSize = 26, showEdit = false, onClick }) => (
    <div
      className={showEdit ? 'avatar-upload-wrap' : ''}
      onClick={onClick}
      style={{ position: 'relative', width: size, height: size, cursor: showEdit ? 'pointer' : 'default', flexShrink: 0 }}
    >
      {/* photo or initials */}
      {photoPreview ? (
        <img
          className="avatar-img"
          src={photoPreview}
          alt="Profile"
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 6px 20px rgba(25,0,81,0.25)', border: '3px solid rgba(255,255,255,0.9)', transition: 'filter 0.2s ease', display: 'block' }}
        />
      ) : (
        <div
          className="avatar-initials"
          style={{ width: size, height: size, borderRadius: '50%', background: getAvatarColor(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: 800, color: '#fff', boxShadow: '0 6px 20px rgba(25,0,81,0.25)', border: '3px solid rgba(255,255,255,0.9)', transition: 'filter 0.2s ease' }}
        >
          {getInitials()}
        </div>
      )}

      {/* hover overlay (modal only) */}
      {showEdit && (
        <div
          className="avatar-overlay"
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(25,0,81,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, opacity: 0, transition: 'opacity 0.22s ease', pointerEvents: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span style={{ fontSize: 9, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>CHANGE</span>
        </div>
      )}

      {/* status dot (profile page) */}
      {!showEdit && (
        <div style={{ position: 'absolute', bottom: 4, right: 2, width: 14, height: 14, borderRadius: '50%', background: availabilityStatus === 'Offline' ? '#9ca3af' : '#22c55e', border: '2.5px solid #fff' }} />
      )}

      {/* edit pencil badge (modal) */}
      {showEdit && (
        <div style={{ position: 'absolute', bottom: 2, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#190051', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff', pointerEvents: 'none' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      <div className="page-wrap" style={{ minHeight: '100vh', background: 'linear-gradient(150deg,#dbd5ee 0%,#cfc8e8 35%,#b8b0d5 70%,#c4bce0 100%)', fontFamily: "'Poppins',sans-serif" }}>

        {/* ══ HEADER ══ */}
        <div style={{ background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.65)', padding: '15px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, background: 'linear-gradient(135deg,#190051,#3b0f8c)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 16px rgba(25,0,81,0.38)', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#190051', letterSpacing: '-0.3px' }}>Account Settings</div>
              <div style={{ fontSize: 11.5, color: 'rgba(25,0,81,0.48)', marginTop: 2 }}>Manage your account and preferences security</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {tabs.map(({ key, label, icon }) => {
              const isActive = activeTab === key && key !== 'Home';
              return (
                <button key={key} className="tab-btn" onClick={() => handleTabClick(key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 17px', borderRadius: 24, border: isActive ? '1.5px solid #190051' : '1.5px solid rgba(25,0,81,0.18)', background: isActive ? 'rgba(25,0,81,0.08)' : 'transparent', color: isActive ? '#190051' : 'rgba(25,0,81,0.42)', fontSize: 13, fontWeight: isActive ? 700 : 400, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.18s ease', outline: 'none' }}>
                  {icon}{label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div style={{ padding: '36px 36px 48px' }}>
          <div style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#190051', letterSpacing: '-0.4px' }}>Personal Profile</div>
            <div style={{ fontSize: 12, color: 'rgba(25,0,81,0.48)', marginTop: 4 }}>Manage your account and preferences security</div>
          </div>

          {/* ════ PROFILE TAB ════ */}
          {activeTab === 'Profile' && (
          <div className="card-wrap" style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '28px 30px 32px', boxShadow: '0 4px 32px rgba(25,0,81,0.1)', border: '1px solid rgba(255,255,255,0.9)' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#190051', letterSpacing: '-0.2px' }}>Personal Information</div>
              <button className="edit-btn" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#190051', color: '#fff', border: 'none', borderRadius: 11, padding: '10px 22px', fontSize: 13.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 5px 16px rgba(25,0,81,0.3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                Edit Profile
              </button>
            </div>

            {/* ── INNER WHITE BLOCK ── */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px 26px 28px', boxShadow: '0 1px 10px rgba(25,0,81,0.06)' }}>

              {/* TOP row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, paddingBottom: 24, borderBottom: '1.5px solid #f0ecf9' }}>
                <AvatarCircle size={80} fontSize={26} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#190051', letterSpacing: '-0.4px', marginBottom: 3 }}>{getDisplayName()}</div>
                  <div style={{ fontSize: 13.5, color: 'rgba(25,0,81,0.5)', marginBottom: 12, fontWeight: 500 }}>{getRoleDisplay()}</div>
                  <span style={{ background: badgeStyle.bg, color: badgeStyle.color, border: `1.5px solid ${badgeStyle.border}`, borderRadius: 20, padding: '3px 13px', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' }}>
                    {availabilityStatus}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', columnGap: 32, rowGap: 16, flexShrink: 0 }}>
                  {[
                    { label: 'Age',    value: form.age   ? `${form.age} Years` : '45 Years' },
                    { label: 'Email',  value: form.email  || 'sophie.aloria@gmail.com' },
                    { label: 'Gender', value: form.gender || 'Female' },
                    { label: 'Phone',  value: form.phone  || '09750768513' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: 'rgba(25,0,81,0.36)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#190051' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#190051', marginBottom: 20, letterSpacing: '-0.2px' }}>Professional Information</div>
                  <div style={{ display: 'flex', gap: 56 }}>
                    {[
                      { label: 'Specialization', value: form.specialization || 'Dermatology' },
                      { label: 'Department',      value: form.department     || 'Physician'   },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: 11, color: 'rgba(25,0,81,0.38)', marginBottom: 7, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ fontSize: 19, fontWeight: 800, color: '#190051', letterSpacing: '-0.3px' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ width: 1, alignSelf: 'stretch', background: '#ede8f5', margin: '0 40px', flexShrink: 0 }} />

                <div style={{ minWidth: 195, flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#190051', marginBottom: 18, letterSpacing: '-0.2px' }}>Availability Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {statusConfig.map(({ label, color }) => {
                      const isSel = availabilityStatus === label;
                      return (
                        <div key={label} className="status-row" onClick={() => setAvailabilityStatus(label)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
                          <div style={{ width: 21, height: 21, borderRadius: '50%', background: isSel ? color : '#e9e4f5', border: `2px solid ${isSel ? color : '#d4cfe8'}`, transition: 'all 0.2s ease', flexShrink: 0, boxShadow: isSel ? `0 0 0 4px ${color}28` : 'none' }} />
                          <span style={{ fontSize: 14, fontWeight: isSel ? 700 : 400, color: isSel ? '#190051' : 'rgba(25,0,81,0.42)', transition: 'all 0.18s ease' }}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
          )} {/* end Profile tab */}

          {/* ════ SECURITY TAB ════ */}
          {activeTab === 'Security' && (
          <div className="card-wrap" style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '28px 30px 32px', boxShadow: '0 4px 32px rgba(25,0,81,0.1)', border: '1px solid rgba(255,255,255,0.9)' }}>

            {/* Card title */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#190051', letterSpacing: '-0.3px' }}>Password Security</div>
              <div style={{ fontSize: 12, color: 'rgba(25,0,81,0.45)', marginTop: 4 }}>Secure your account and data</div>
            </div>

            {/* Inner white block — two columns */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '32px 36px', boxShadow: '0 1px 10px rgba(25,0,81,0.06)', display: 'flex', gap: 0, alignItems: 'flex-start' }}>

              {/* LEFT — Change Password */}
              <div style={{ flex: 1, paddingRight: 48, borderRight: '1.5px solid #f0ecf9' }}>
                {/* Lock icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#f0ecf9,#e4ddf5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 12px rgba(25,0,81,0.12)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#190051" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#190051', letterSpacing: '-0.2px' }}>Change Password</div>
                  <div style={{ fontSize: 12, color: 'rgba(25,0,81,0.45)', marginTop: 4, textAlign: 'center' }}>To change your password, please fill all fields below</div>
                </div>

                {/* Alert message */}
                {pwMsg && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${pwMsg.type === 'success' ? '#86efac' : '#fca5a5'}`, color: pwMsg.type === 'success' ? '#166534' : '#dc2626', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {pwMsg.type === 'success'
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    }
                    {pwMsg.text}
                  </div>
                )}

                {/* Password fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Current */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: '#190051' }}>Current Password</label>
                    <div className="pw-input-wrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)}
                        placeholder="Enter current password"
                        style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1.5px solid rgba(25,0,81,0.15)', fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: '#190051', background: '#faf9fc', boxSizing: 'border-box', transition: 'all 0.18s ease' }}
                      />
                      <button className="pw-eye" onClick={() => setShowCurrent(p => !p)}>
                        {showCurrent
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  {/* New */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: '#190051' }}>New Password</label>
                    <div className="pw-input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        placeholder="Enter new password"
                        style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1.5px solid rgba(25,0,81,0.15)', fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: '#190051', background: '#faf9fc', boxSizing: 'border-box', transition: 'all 0.18s ease' }}
                      />
                      <button className="pw-eye" onClick={() => setShowNew(p => !p)}>
                        {showNew
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                        }
                      </button>
                    </div>
                    {/* Strength bar */}
                    {newPw && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {[1,2,3,4].map(i => {
                          const strength = newPw.length >= 12 ? 4 : newPw.length >= 8 ? 3 : newPw.length >= 5 ? 2 : 1;
                          const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
                          return <div key={i} style={{ flex: 1, height: 3, borderRadius: 4, background: i <= strength ? colors[strength - 1] : '#e9e4f5', transition: 'background 0.2s ease' }} />;
                        })}
                        <span style={{ fontSize: 10, color: 'rgba(25,0,81,0.45)', marginLeft: 4, whiteSpace: 'nowrap' }}>
                          {newPw.length >= 12 ? 'Strong' : newPw.length >= 8 ? 'Good' : newPw.length >= 5 ? 'Fair' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: '#190051' }}>Confirm Password</label>
                    <div className="pw-input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="Re-enter new password"
                        style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: `1.5px solid ${confirmPw && confirmPw !== newPw ? '#fca5a5' : 'rgba(25,0,81,0.15)'}`, fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: '#190051', background: '#faf9fc', boxSizing: 'border-box', transition: 'all 0.18s ease' }}
                      />
                      <button className="pw-eye" onClick={() => setShowConfirm(p => !p)}>
                        {showConfirm
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                        }
                      </button>
                    </div>
                    {confirmPw && confirmPw !== newPw && (
                      <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 500, marginTop: 2 }}>Passwords don't match</div>
                    )}
                  </div>

                  {/* Submit */}
                  <button className="chg-pw-btn" onClick={handleChangePassword} style={{ width: '100%', padding: '12px 0', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#6c5ce7,#190051)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 5px 16px rgba(25,0,81,0.28)', marginTop: 4 }}>
                    Change Password
                  </button>
                </div>
              </div>

              {/* RIGHT — Your Devices */}
              <div style={{ paddingLeft: 48, minWidth: 260, flexShrink: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#190051', letterSpacing: '-0.2px', marginBottom: 6 }}>Your Devices</div>
                <div style={{ fontSize: 12.5, color: 'rgba(25,0,81,0.48)', marginBottom: 22 }}>Your devices link to this account.</div>

                {/* Device list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {[
                    { icon: '💻', name: 'This device', detail: 'Windows · Chrome · Active now', current: true },
                    { icon: '📱', name: 'Mobile',      detail: 'iOS · Safari · 2 days ago',    current: false },
                  ].map(({ icon, name, detail, current }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: current ? 'rgba(25,0,81,0.04)' : '#faf9fc', border: `1.5px solid ${current ? 'rgba(25,0,81,0.12)' : 'rgba(25,0,81,0.07)'}` }}>
                      <div style={{ fontSize: 22 }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#190051', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {name}
                          {current && <span style={{ fontSize: 9, fontWeight: 700, background: '#22c55e', color: '#fff', borderRadius: 20, padding: '2px 7px', letterSpacing: '0.04em' }}>CURRENT</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(25,0,81,0.45)', marginTop: 2 }}>{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)} style={{ width: '100%', padding: '11px 0', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#7c6ee6,#4c3fa0)', color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 5px 16px rgba(108,92,231,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                  Log Out From All Devices
                </button>
              </div>

            </div>
          </div>
          )} {/* end Security tab */}

        </div>
      </div>

      {/* ══ LOGOUT CONFIRM MODAL ══ */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,30,0.48)', backdropFilter: 'blur(7px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, padding: '32px 28px', boxShadow: '0 24px 80px rgba(25,0,81,0.28)', border: '1px solid rgba(25,0,81,0.08)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#dc2626"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#190051', marginBottom: 8 }}>Log Out All Devices?</div>
            <div style={{ fontSize: 13, color: 'rgba(25,0,81,0.5)', marginBottom: 26, lineHeight: '1.6' }}>
              This will sign you out from all devices linked to your account. You'll need to log back in.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="confirm-no" onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: '1.5px solid rgba(25,0,81,0.18)', background: 'transparent', color: 'rgba(25,0,81,0.6)', fontSize: 13.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.18s ease' }}>
                Cancel
              </button>
              <button className="confirm-yes" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.18s ease', boxShadow: '0 5px 14px rgba(220,38,38,0.3)' }}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT PROFILE MODAL ══ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setShowPhotoMenu(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,30,0.48)', backdropFilter: 'blur(7px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(25,0,81,0.28)', border: '1px solid rgba(25,0,81,0.08)' }}>

            {/* Modal header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1.5px solid #f0ecf9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', borderRadius: '22px 22px 0 0', zIndex: 2 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#190051', letterSpacing: '-0.3px' }}>Edit Profile</div>
                <div style={{ fontSize: 11.5, color: 'rgba(25,0,81,0.46)', marginTop: 3 }}>Update your personal and professional details</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(25,0,81,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s ease', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(25,0,81,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(25,0,81,0.07)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#190051"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>

            {/* ── PHOTO UPLOAD SECTION ── */}
            <div style={{ padding: '26px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

              {/* Avatar with click menu */}
              <div style={{ position: 'relative' }}>
                <AvatarCircle
                  size={90} fontSize={28} showEdit
                  onClick={(e) => { e.stopPropagation(); setShowPhotoMenu(p => !p); }}
                />

                {/* Dropdown menu */}
                {showPhotoMenu && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(25,0,81,0.18)', border: '1px solid rgba(25,0,81,0.1)', minWidth: 200, zIndex: 10, overflow: 'hidden', animation: 'slideUp 0.2s cubic-bezier(0.22,1,0.36,1) both' }}>
                    <button className="photo-option" onClick={() => { fileInputRef.current.click(); setShowPhotoMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#190051', fontFamily: "'Poppins',sans-serif", transition: 'background 0.15s ease', textAlign: 'left' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#190051"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                      Upload New Photo
                    </button>
                    <div style={{ height: 1, background: '#f0ecf9', margin: '0 12px' }} />
                    {photoPreview && (
                      <button className="remove-btn" onClick={handleRemovePhoto} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'rgba(220,38,38,0.8)', fontFamily: "'Poppins',sans-serif", transition: 'all 0.15s ease', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Remove Photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Drag & drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{ width: '100%', border: `2px dashed ${dragOver ? '#190051' : 'rgba(25,0,81,0.2)'}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', background: dragOver ? 'rgba(25,0,81,0.04)' : 'rgba(25,0,81,0.01)', transition: 'all 0.2s ease' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(25,0,81,0.35)"><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(25,0,81,0.55)' }}>
                  {dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(25,0,81,0.35)' }}>PNG, JPG, GIF up to 5MB</div>
              </div>

              {/* Preview strip if photo selected */}
              {photoPreview && (
                <div style={{ width: '100%', background: '#f5f3fc', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={photoPreview} alt="Preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(25,0,81,0.15)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#190051' }}>Photo selected</div>
                    <div style={{ fontSize: 11, color: 'rgba(25,0,81,0.45)' }}>This will be saved when you click Save Changes</div>
                  </div>
                  <button onClick={handleRemovePhoto} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(25,0,81,0.4)', padding: 4, borderRadius: 6, transition: 'color 0.15s ease', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(25,0,81,0.4)'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div style={{ padding: '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(25,0,81,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: 2, borderBottom: '1px solid #f0ecf9' }}>
                Personal Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="First Name" value={form.firstName} onChange={f('firstName')} />
                <Field label="Last Name"  value={form.lastName}  onChange={f('lastName')} />
                <Field label="Age"        value={form.age}       onChange={f('age')} type="number" />
                <Field label="Gender"     value={form.gender}    onChange={f('gender')} options={['Female', 'Male', 'Other', 'Prefer not to say']} />
                <Field label="Email"      value={form.email}     onChange={f('email')} type="email" />
                <Field label="Phone"      value={form.phone}     onChange={f('phone')} type="tel" />
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(25,0,81,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: 2, borderBottom: '1px solid #f0ecf9', marginTop: 4 }}>
                Professional Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Role"           value={form.role}           onChange={f('role')} options={['Doctor', 'Nurse', 'Staff Member']} />
                <Field label="Specialization" value={form.specialization} onChange={f('specialization')} />
                <Field label="Department"     value={form.department}     onChange={f('department')} />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: '1.5px solid rgba(25,0,81,0.18)', background: 'transparent', color: 'rgba(25,0,81,0.6)', fontSize: 13.5, fontWeight: 600, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.18s ease' }}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave} style={{ flex: 2, padding: '11px 0', borderRadius: 11, border: 'none', background: '#190051', color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.18s ease', boxShadow: '0 5px 16px rgba(25,0,81,0.28)' }}>
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
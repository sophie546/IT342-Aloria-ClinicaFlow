import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  MoreVert,
  FilterList,
  Search,
  Edit,
  Delete,
  People,
  Schedule,
  MedicalServices,
  CheckCircle,
  LocalHospital,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';

const C = {
  primary: '#190051',
  primaryLight: '#360185',
  bg: '#f5f6fa',
  white: '#ffffff',
  text1: '#1e293b',
  text2: '#6b7280',
  textMuted: 'rgba(30,41,59,0.4)',
  orange: '#ed6c02',
  orangeBg: 'rgba(237,108,2,0.1)',
  consulting: '#667eea',
  consultingBg: 'rgba(102,126,234,0.1)',
  green: '#10b981',
  greenBg: '#d1fae5',
};

const MOCK = [
  { id: 1, queueNumber: 1, patient: { firstName: 'Jungwon', lastName: 'Yang', age: 45, patientId: 'ID: 1' }, status: 'CONSULTING', assignedDoctor: 'Dr. Cruz', arrivalTime: '15 mins.' },
  { id: 2, queueNumber: 2, patient: { firstName: 'Evan', lastName: 'Lee', age: 32, patientId: 'ID: 2' }, status: 'WAITING', assignedDoctor: 'Dr. Cruz', arrivalTime: '30 mins.' },
  { id: 3, queueNumber: 3, patient: { firstName: 'Jake', lastName: 'Sim', age: 28, patientId: 'ID: 3' }, status: 'WAITING', assignedDoctor: 'Dr. Santos', arrivalTime: '45 mins.' },
  { id: 4, queueNumber: 4, patient: { firstName: 'Sarah', lastName: 'Johnson', age: 45, patientId: 'ID: 4' }, status: 'COMPLETED', assignedDoctor: 'Dr. Smith', arrivalTime: '1 hr' },
];

const statusConfig = {
  WAITING:    { color: C.orange,     bg: C.orangeBg,     border: C.orange,     label: 'Waiting' },
  CONSULTING: { color: C.consulting, bg: C.consultingBg, border: C.consulting, label: 'Consulting' },
  COMPLETED:  { color: C.green,      bg: C.greenBg,      border: C.green,      label: 'Completed' },
};

export default function PatientQueue() {
  const [queue, setQueue] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPatient, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { setQueue(MOCK); }, []);

  const filteredRows = queue
    .filter(item => {
      const name = `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase();
      return name.includes(search.toLowerCase()) &&
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
    { title: 'Total Patients', value: queue.length,                                        sub: '+2 today',   Icon: People,         iconColor: C.primary    },
    { title: 'Waiting',        value: queue.filter(q => q.status === 'WAITING').length,    sub: 'In queue',   Icon: Schedule,       iconColor: C.orange     },
    { title: 'Consulting',     value: queue.filter(q => q.status === 'CONSULTING').length, sub: 'In progress',Icon: MedicalServices, iconColor: C.consulting },
    { title: 'Completed',      value: queue.filter(q => q.status === 'COMPLETED').length,  sub: 'Today',      Icon: CheckCircle,    iconColor: C.green      },
  ];

  const openMenu  = (e, p) => { setMenuAnchor(e.currentTarget); setSelected(p); };
  const closeMenu = ()      => setMenuAnchor(null);

  const openEdit = () => {
    const [firstName = '', lastName = ''] = (selectedPatient?.name || '').split(' ');
    setEditData({ firstName, lastName, age: selectedPatient?.age, status: selectedPatient?.status, assignedDoctor: selectedPatient?.assignedTo });
    setEditOpen(true);
    closeMenu();
  };
  const openDelete = () => { setDeleteOpen(true); closeMenu(); };

  const COLS = '56px 54px 1fr 80px 130px 170px 130px 44px';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: C.bg }}>
      <Sidebar user={{ firstName: 'Dr.', lastName: 'Smith', role: 'Senior Physician' }} onLogout={() => {}} />

      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>

        {/* ── Top Bar ── */}
        <Box sx={{
          bgcolor: C.white,
          height: 105,
          px: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 2px 0 rgba(0,0,0,0.06)',
        }}>
          <Box display="flex" alignItems="center" gap="14px">
            <Box sx={{
              width: 40, height: 40,
              bgcolor: C.primary,
              borderRadius: '10px',
              border: '0.2px solid #fff',
              boxShadow: '0 2px 5px 0 rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LocalHospital sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, color: C.primary, lineHeight: '25px' }}>
                Patient Queue
              </Typography>
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, fontWeight: 700, color: 'rgba(25,0,81,0.6)', lineHeight: '15px', mt: '10px' }}>
                Real-time patient monitoring
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            width: 283, height: 38,
            bgcolor: C.primary,
            borderRadius: '8px',
            border: '0.5px solid rgba(25,0,81,0.8)',
            display: 'flex', alignItems: 'center',
            px: '14.5px', gap: '8px',
          }}>
            <Search sx={{ color: '#fff', fontSize: 18, opacity: 0.7, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search patients, doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: 15,
                fontFamily: "'Arimo',sans-serif",
              }}
            />
          </Box>
        </Box>

        {/* ── Stat Cards ── */}
        <Box sx={{ display: 'flex', gap: '20px', px: '34px', mt: '20px' }}>
          {stats.map((stat) => (
            <Box key={stat.title} sx={{
              flex: 1, height: 124,
              bgcolor: C.white,
              borderRadius: '8px',
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
              px: '17px', py: '22px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <Box>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.8)', lineHeight: '14.95px' }}>
                  {stat.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 32, fontWeight: 700, color: '#000', lineHeight: '34px', mt: '7px' }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 10, fontWeight: 400, color: C.text2, lineHeight: '11.5px', mt: '8px' }}>
                  {stat.sub}
                </Typography>
              </Box>
              <stat.Icon sx={{ fontSize: 34, color: stat.iconColor, mt: '7px' }} />
            </Box>
          ))}
        </Box>

        {/* ── Queue Table ── */}
        <Box sx={{
          mx: '34px', mt: '20px', mb: '34px',
          bgcolor: C.primary,
          borderRadius: '8px',
          boxShadow: '0 4px 4px 0 rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <Box sx={{ px: '27px', pt: '28px', pb: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: '23px' }}>
                Patient Queue
              </Typography>
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, fontWeight: 400, color: '#fff', lineHeight: '16px', mt: '14px' }}>
                {filteredRows.length} patients in queue
              </Typography>
            </Box>
            <Button
              startIcon={<FilterList sx={{ fontSize: 18 }} />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              sx={{
                height: 32,
                bgcolor: C.white,
                borderRadius: '6px',
                border: '0.5px solid rgba(0,0,0,0.8)',
                boxShadow: '0 4px 4px 0 rgba(0,0,0,0.15)',
                textTransform: 'none',
                fontFamily: "'Arimo',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(0,0,0,0.8)',
                px: 2,
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              {filterStatus !== 'all' ? statusConfig[filterStatus]?.label : 'All Status'}
            </Button>
          </Box>

          {/* Column labels */}
          <Box sx={{ bgcolor: '#f9fafb', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.1)' }}>
            <Box sx={{ height: 1, bgcolor: C.white }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: COLS, px: '41px', py: '10px', alignItems: 'center' }}>
              {['#', '', 'PATIENT', 'AGE', 'STATUS', 'DOCTOR', 'Waiting Time', ''].map((h, i) => (
                <Typography key={i} sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, fontWeight: 700, color: C.text2, lineHeight: '16px' }}>
                  {h}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Rows */}
          {filteredRows.map((row, idx) => (
            <Box key={row.id} sx={{
              bgcolor: C.white,
              borderTop: idx === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
              px: '41px',
              height: 92,
              display: 'grid',
              gridTemplateColumns: COLS,
              alignItems: 'center',
              '&:hover': { bgcolor: '#fafbfc' },
            }}>
              {/* # */}
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 15, fontWeight: 700, color: C.text2 }}>
                {row.queueNumber}
              </Typography>

              {/* Avatar */}
              <Avatar sx={{
                width: 39, height: 39,
                bgcolor: C.primaryLight,
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                boxShadow: '0 4px 4px 0 rgba(102,126,234,0.2)',
              }}>
                {row.initials}
              </Avatar>

              {/* Name + ID */}
              <Box>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, fontWeight: 700, color: C.text1, lineHeight: '16px' }}>
                  {row.name}
                </Typography>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 11, fontWeight: 700, color: C.textMuted, lineHeight: '12.65px', mt: '4px' }}>
                  {row.patientId}
                </Typography>
              </Box>

              {/* Age */}
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, color: C.text1 }}>
                {row.age}
              </Typography>

              {/* Status pill */}
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: 20, px: '10px',
                bgcolor: statusConfig[row.status]?.bg,
                border: `0.2px solid ${statusConfig[row.status]?.border}`,
                borderRadius: '20px',
                width: 'fit-content',
              }}>
                <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 10, fontWeight: 700, color: statusConfig[row.status]?.color, lineHeight: '10px' }}>
                  {statusConfig[row.status]?.label}
                </Typography>
              </Box>

              {/* Doctor */}
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, fontWeight: 700, color: C.primaryLight }}>
                {row.assignedTo}
              </Typography>

              {/* Waiting time */}
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, color: C.text1 }}>
                {row.arrivalTime}
              </Typography>

              {/* Menu button */}
              <IconButton size="small" onClick={(e) => openMenu(e, row)} sx={{ color: C.text2 }}>
                <MoreVert sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ))}

          {filteredRows.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center', bgcolor: C.white }}>
              <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, color: C.text2 }}>
                No patients found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}
        PaperProps={{ sx: { borderRadius: '8px', mt: 1, minWidth: 130 } }}>
        {['all', 'WAITING', 'CONSULTING', 'COMPLETED'].map(s => (
          <MenuItem key={s} onClick={() => { setFilterStatus(s); setFilterAnchor(null); }}
            sx={{ fontSize: 13, fontFamily: "'Arimo',sans-serif", fontWeight: filterStatus === s ? 700 : 400 }}>
            {s === 'all' ? 'All Status' : statusConfig[s]?.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
        PaperProps={{ sx: { borderRadius: '8px', minWidth: 120 } }}>
        <MenuItem onClick={openEdit} sx={{ fontSize: 13, fontFamily: "'Arimo',sans-serif", gap: 1 }}>
          <Edit sx={{ fontSize: 16 }} /> Edit
        </MenuItem>
        <MenuItem onClick={openDelete} sx={{ color: '#ef4444', fontSize: 13, fontFamily: "'Arimo',sans-serif", gap: 1 }}>
          <Delete sx={{ fontSize: 16 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16 }}>Edit Patient</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="First Name" value={editData.firstName || ''} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} fullWidth size="small" />
            <TextField label="Last Name" value={editData.lastName || ''} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} fullWidth size="small" />
            <TextField label="Age" type="number" value={editData.age || ''} onChange={(e) => setEditData({ ...editData, age: e.target.value })} fullWidth size="small" />
            <TextField select label="Status" value={editData.status || ''} onChange={(e) => setEditData({ ...editData, status: e.target.value })} fullWidth size="small">
              {['WAITING', 'CONSULTING', 'COMPLETED'].map(s => (
                <MenuItem key={s} value={s}>{statusConfig[s]?.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Assigned Doctor" value={editData.assignedDoctor || ''} onChange={(e) => setEditData({ ...editData, assignedDoctor: e.target.value })} fullWidth size="small" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ fontFamily: "'Arimo',sans-serif", textTransform: 'none' }}>Cancel</Button>
          <Button onClick={() => setEditOpen(false)} variant="contained"
            sx={{ bgcolor: C.primary, fontFamily: "'Arimo',sans-serif", textTransform: 'none', '&:hover': { bgcolor: C.primaryLight } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'Arimo',sans-serif", fontSize: 14, color: C.text2 }}>
            Are you sure you want to delete <strong>{selectedPatient?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ fontFamily: "'Arimo',sans-serif", textTransform: 'none' }}>Cancel</Button>
          <Button onClick={() => setDeleteOpen(false)} color="error" variant="contained"
            sx={{ fontFamily: "'Arimo',sans-serif", textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  MedicalServices as QueueIcon,
  People as PatientsIcon,
  Person as StaffIcon,
  Schedule as AppointmentsIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LocalHospital,
  ChevronRight,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 281;

const menuItems = [
  { text: 'Patient Queue',   icon: <QueueIcon sx={{ fontSize: 20 }} />,        path: '/patient-queue' },
  { text: 'Patients',        icon: <PatientsIcon sx={{ fontSize: 18 }} />,      path: '/patients' },
  { text: 'Medical Staff',   icon: <StaffIcon sx={{ fontSize: 18 }} />,         path: '/staff' },
  { text: 'Appointments',    icon: <AppointmentsIcon sx={{ fontSize: 18 }} />,  path: '/appointments' },
  { text: 'Medical History', icon: <HistoryIcon sx={{ fontSize: 18 }} />,       path: '/medical-history' },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          bgcolor: '#190051',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.25)',
        },
      }}
    >
      {/* ── Logo / Header ── */}
      <Box sx={{
        height: 107,
        bgcolor: '#190051',
        px: '27px',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 2px 2px 0 #ffffff',
        flexShrink: 0,
      }}>
        <Box display="flex" alignItems="center" gap="18px">
          <Box sx={{
            width: 40, height: 40,
            bgcolor: '#fff',
            borderRadius: '50px',
            border: '0.2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <LocalHospital sx={{ color: '#190051', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "'Inter',sans-serif", fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: '25px' }}>
              ClinicaFlow
            </Typography>
            <Typography sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: '14.52px', mt: '4px' }}>
              Medical Management
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Nav Items ── */}
      <Box sx={{ flexGrow: 1, pt: '10px' }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: '16px', mb: '4px' }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    height: 51,
                    borderRadius: '10px',
                    px: '15px',
                    '&.Mui-selected': {
                      bgcolor: '#fff',
                      '&:hover': { bgcolor: '#fff' },
                      '& .MuiListItemIcon-root': { color: '#190051' },
                    },
                    '&:not(.Mui-selected):hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 35, color: isActive ? '#190051' : 'rgba(255,255,255,0.8)' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      lineHeight: '15px',
                      color: isActive ? '#190051' : '#fff',
                    }}
                  />
                  {isActive && <ChevronRight sx={{ fontSize: 20, color: '#190051' }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* ── Doctor Profile Card ── */}
      <Box sx={{ px: '16px', pb: '24px', mt: 'auto' }}>
        <Box sx={{
          width: '100%',
          height: 77,
          bgcolor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          px: '23px',
          gap: '16px',
        }}>
          <Avatar sx={{
            width: 42, height: 42,
            bgcolor: '#190051',
            fontFamily: "'Inter',sans-serif",
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 4px 4px 0 rgba(0,0,0,0.2)',
          }}>
            DS
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: '#190051', lineHeight: '15px' }}>
              Dr. Smith
            </Typography>
            <Typography sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(25,0,81,0.7)', lineHeight: '12.1px', mt: '4px' }}>
              Senior Physician
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: '#190051', p: 0.25, flexShrink: 0 }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
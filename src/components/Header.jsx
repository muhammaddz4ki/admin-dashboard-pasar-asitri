// File: src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
// --- TAMBAHKAN DUA IKON INI ---
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Data contoh untuk notifikasi sekarang bisa digunakan tanpa error
const notifications = [
    { id: 1, icon: <PersonIcon color="success"/>, title: 'Pengguna baru mendaftar', time: '5 menit lalu' },
    { id: 2, icon: <ShoppingCartIcon color="primary"/>, title: 'Pesanan baru masuk', time: '1 jam lalu' },
    { id: 3, icon: <VerifiedUserIcon color="warning"/>, title: 'Ada pengajuan sertifikasi baru', time: 'Kemarin' },
];

const Header = () => {
  const [currentUser, setCurrentUser] = useState({ name: 'Admin', email: '' });
  
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotifMenuOpen = Boolean(notifAnchorEl);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({
            name: userDocSnap.data().name || 'Admin',
            email: auth.currentUser.email,
          });
        }
      }
    };
    fetchUserData();
  }, []);

  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleNotifMenuOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifMenuClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    signOut(auth);
    handleProfileMenuClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600 }}>
        Dashboard Pemerintah
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color="inherit" onClick={handleNotifMenuOpen}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Avatar
          sx={{ cursor: 'pointer', bgcolor: 'primary.main' }}
          onClick={handleProfileMenuOpen}
        >
          {currentUser.name.charAt(0)}
        </Avatar>
        
        <Menu
          anchorEl={notifAnchorEl}
          open={isNotifMenuOpen}
          onClose={handleNotifMenuClose}
          PaperProps={{ sx: { width: 360, mt: 1.5 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifikasi</Typography>
            <Typography variant="body2" color="primary.main" sx={{cursor: 'pointer'}}>Lihat Semua</Typography>
          </Box>
          <Divider />
          {notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleNotifMenuClose}>
              <ListItemIcon>{notif.icon}</ListItemIcon>
              <ListItemText 
                primary={<Typography variant="body2" sx={{fontWeight: 'medium'}}>{notif.title}</Typography>}
                secondary={<Typography variant="caption" color="text.secondary">{notif.time}</Typography>} 
              />
            </MenuItem>
          ))}
        </Menu>
        
        <Menu
          anchorEl={profileAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          PaperProps={{ sx: { width: 240, mt: 1.5 } }}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mb: 1, mx: 'auto', bgcolor: 'primary.main' }}>
               {currentUser.name.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{currentUser.name}</Typography>
            <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profil Saya
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            Pengaturan
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
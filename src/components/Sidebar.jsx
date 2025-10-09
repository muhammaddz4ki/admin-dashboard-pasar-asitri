// File: src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SavingsIcon from '@mui/icons-material/Savings';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import logo from '../assets/logo.png'; 

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Products', icon: <StorefrontIcon />, path: '/products' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Certifications', icon: <VerifiedUserIcon />, path: '/certifications' },
  { text: 'Subsidies', icon: <SavingsIcon />, path: '/subsidies' },
  { text: 'Trainings', icon: <SchoolIcon />, path: '/trainings' },
  { text: 'Posts', icon: <PostAddIcon />, path: '/posts' },
  { text: 'Market Prices', icon: <AssessmentIcon />, path: '/market-prices' },
];

const Sidebar = () => {
  const getNavLinkStyles = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#10B981' : '#A6E4D2',
    display: 'block',
    position: 'relative',
  });
  
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: 'primary.main',
        height: '100vh',
        color: 'primary.contrastText',
        p: 2,
        display: { xs: 'none', md: 'block' },
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, mb: 1 }}>
        <img src={logo} alt="Pasar Atsiri Logo" style={{ height: '40px', marginRight: '12px' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
          Pasar Atsiri
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <NavLink to={item.path} key={item.text} style={getNavLinkStyles}>
            {({ isActive }) => (
              <ListItem disablePadding sx={{ my: 0.5 }}>
                <ListItemButton 
                  sx={{ 
                    py: 1.2,
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#F9FAFB' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#F9FAFB' : 'rgba(255, 255, 255, 0.08)'
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{fontWeight: isActive ? 600 : 400}} />
                </ListItemButton>

                {/* --- PERBAIKAN UTAMA DI SINI --- */}
                {isActive && (
                  <>
                    <Box sx={{
                      content: '""',
                      position: 'absolute',
                      top: '-20px',
                      right: 0,
                      height: '20px',
                      width: '20px',
                      // Membuat kurva "scoop" atas dengan gradien radial
                      background: 'radial-gradient(circle at 0% 0%, transparent 20px, #10B981 20.5px)',
                    }} />
                    <Box sx={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-20px',
                      right: 0,
                      height: '20px',
                      width: '20px',
                       // Membuat kurva "scoop" bawah dengan gradien radial
                      background: 'radial-gradient(circle at 0% 100%, transparent 20px, #10B981 20.5px)',
                    }} />
                  </>
                )}
              </ListItem>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
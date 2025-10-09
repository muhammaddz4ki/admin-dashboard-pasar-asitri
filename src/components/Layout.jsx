// File: src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const sidebarWidth = 260;

  return (
    // Box utama sekarang mengisi seluruh tinggi viewport
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          marginLeft: { md: `${sidebarWidth}px` }
        }}
      >
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
// File: src/adminTheme.js

import { createTheme } from '@mui/material/styles';

// DIUBAH: Nama variabel sekarang adalah "adminTheme"
export const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#10B981', 
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB', 
      paper: '#FFFFFF', 
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 700, fontSize: '2rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    subtitle1: { color: '#6B7280' },
    subtitle2: { color: '#6B7280', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12, // Membuat semua sudut lebih bulat
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          // Bayangan yang lebih halus dan menyebar
          boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#374151',
          backgroundColor: '#F3F4F6',
          borderBottom: 'none',
        },
        body: {
          borderBottom: '1px solid #F3F4F6',
        }
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        }
      }
    }
  },
});
import { createTheme } from '@mui/material/styles';

export const landingTheme = createTheme({
  // 1. Palet Warna (Color Palette)
  palette: {
    primary: {
      main: '#10b981', // Warna hijau emerald
      light: '#e6f8f3', // Versi lebih terang untuk background
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000ff', // Warna ungu untuk tombol CTA "Unduh Aplikasi"
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1f2937',  // Abu-abu gelap untuk teks utama
      secondary: '#6b7280', // Abu-abu lebih terang untuk sub-teks
    },
    background: {
      default: '#ffffff', // Latar belakang utama putih
      paper: '#ffffff',   // Latar belakang untuk komponen seperti Card/Paper
    },
    grey: {
        50: '#f9fafb' // Warna abu-abu sangat terang untuk background seksi
    }
  },

  // 2. Tipografi (Typography)
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  // 3. Kustomisasi Komponen (Component Overrides)
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        },
        contained: {
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
             '&:hover': {
               boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
           }
        }
      },
    },
    MuiPaper: {
        styleOverrides: {
            rounded: {
                borderRadius: 12,
            }
        }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb'
        }
      }
    }
  },
});
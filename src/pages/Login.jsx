// File: src/pages/Login.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  // --- BARU: Impor untuk ikon di dalam text field ---
  InputAdornment,
  IconButton
} from '@mui/material';

// --- BARU: Impor ikon mata untuk lihat/sembunyikan password ---
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Import aset dari folder Anda
import LogoIcon from '../assets/logo.png'; 
import MockupImage from '../assets/mockup.png';

// Impor yang dibutuhkan dari Firebase (hanya untuk email/password)
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';

const Login = ({ authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- BARU: State untuk mengontrol visibilitas password ---
  const [showPassword, setShowPassword] = useState(false);

  // --- BARU: Fungsi untuk mengubah state showPassword ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Mencegah fokus hilang dari text field
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Gagal login dengan email/password:", err.code, err.message);
      setLoginError("Email atau password salah.");
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        background: 'white', 
        overflow: 'hidden',
      }}
    >
      {/* Kolom Kiri: Formulir Login */}
      <Box
        sx={{
          flex: 1.2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <img src={LogoIcon} alt="Pasar Atsiri Logo" style={{ height: '32px', marginRight: '12px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Pasar Atsiri
            </Typography>
          </Box>

          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign In to Pasar Atsiri Portal
          </Typography>

          <Box component="form" onSubmit={handleEmailLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {/* --- PERUBAHAN DI SINI: TextField Password dimodifikasi --- */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'} // Tipe input dinamis
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', bgcolor: '#10B981', '&:hover': { bgcolor: '#0D9B6E' } }}
            >
              Sign In
            </Button>
            {(loginError || authError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {loginError || authError}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      {/* Kolom Kanan: Gambar Mockup */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <Box 
          component="img"
          src={MockupImage}
          alt="Login Illustration"
          sx={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-15px)' },
              '100%': { transform: 'translateY(0px)' },
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Login;
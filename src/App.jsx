// File: src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebaseConfig.js';
import { Box, CircularProgress } from '@mui/material';

// Layout dan Halaman
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Certifications from './pages/Certifications';
import Subsidies from './pages/Subsidies';
import Trainings from './pages/Trainings';
import Posts from './pages/Posts';
import MarketPrices from './pages/MarketPrices';

// Komponen Private Route untuk melindungi halaman admin
const PrivateRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthError('');
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setUser({ uid: currentUser.uid, email: currentUser.email, role: userDocSnap.data().role });
        } else {
          setAuthError("Anda tidak memiliki hak akses sebagai admin.");
          signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login authError={authError} />} />
        <Route 
          path="/*"
          element={
            <PrivateRoute user={user}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/certifications" element={<Certifications />} />
                  <Route path="/subsidies" element={<Subsidies />} />
                  <Route path="/trainings" element={<Trainings />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/market-prices" element={<MarketPrices />} />
                </Route>
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
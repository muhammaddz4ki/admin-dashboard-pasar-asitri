// File: src/pages/MarketPrices.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'market_prices'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrices(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching market prices:", err);
        setError("Gagal memuat data harga pasar.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data harga ini?")) {
      await deleteDoc(doc(db, 'market_prices', id));
    }
  };

  const formatDate = (timestamp) => {
    return timestamp && timestamp.toDate ? timestamp.toDate().toLocaleString('id-ID') : '-';
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" gutterBottom>Manajemen Harga Pasar</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', mt: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nama Komoditas</TableCell>
              <TableCell>Harga Saat Ini</TableCell>
              <TableCell>Harga Sebelumnya</TableCell>
              <TableCell>Update Terakhir</TableCell>
              <TableCell>Diupdate Oleh</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices.map((price) => (
              <TableRow hover key={price.id}>
                <TableCell>{price.commodityName || '-'}</TableCell>
                <TableCell>{price.currentPrice ? `Rp ${price.currentPrice.toLocaleString('id-ID')}` : '-'}</TableCell>
                <TableCell>{price.previousPrice ? `Rp ${price.previousPrice.toLocaleString('id-ID')}` : '-'}</TableCell>
                <TableCell>{formatDate(price.lastUpdate)}</TableCell>
                <TableCell>{price.updatedBy || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(price.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MarketPrices;
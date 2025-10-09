// File: src/pages/Orders.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon untuk lihat detail

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
        setLoading(false);
      }, 
      (err) => {
        console.error("Error fetching orders:", err);
        setError("Gagal memuat data pesanan.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka modal detail
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      await deleteDoc(doc(db, 'orders', id));
    }
  };
  
  const formatDate = (timestamp) => {
    return timestamp && timestamp.toDate ? timestamp.toDate().toLocaleString('id-ID') : '-';
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Manajemen Pesanan</Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pesanan</TableCell>
                <TableCell>Pengguna</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Total Harga</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize: '0.8rem', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.id}</TableCell>
                  <TableCell>{order.userName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.totalPrice ? `Rp ${order.totalPrice.toLocaleString('id-ID')}` : '-'}</TableCell>
                  <TableCell><Chip label={order.status || '-'} color="primary" variant="outlined" size="small" /></TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDetails(order)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(order.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal untuk menampilkan Detail Pesanan */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        {selectedOrder && (
          <>
            <DialogTitle>
              Detail Pesanan: <Typography component="span" sx={{fontWeight: 'medium', fontSize: 'inherit'}}>{selectedOrder.id}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Nama Pemesan</Typography>
                  <Typography variant="body1">{selectedOrder.userName || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tanggal Pesanan</Typography>
                  <Typography variant="body1">{formatDate(selectedOrder.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Alamat Pengiriman</Typography>
                  <Typography variant="body1">{selectedOrder.shippingAddress || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Metode Pembayaran</Typography>
                  <Typography variant="body1">{selectedOrder.paymentMethod || '-'}</Typography>
                </Grid>
                 <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={selectedOrder.status || '-'} color="primary" />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Item Pesanan</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell align="right">Jumlah</TableCell>
                      <TableCell align="right">Harga</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{`Rp ${item.price.toLocaleString('id-ID')}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Tutup</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Orders;
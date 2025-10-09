// File: src/pages/Subsidies.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Button, Chip, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon untuk lihat detail

const Subsidies = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubsidy, setSelectedSubsidy] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subsidies'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubsidies(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching subsidies:", err);
        setError("Gagal memuat data subsidi.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka modal
  const handleViewDetails = (subsidy) => {
    setSelectedSubsidy(subsidy);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubsidy(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengajuan subsidi ini?")) {
      await deleteDoc(doc(db, 'subsidies', id));
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "subsidies", id), { status: newStatus });
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'warning';
    if (status === 'Approved' || status === 'Disetujui') return 'success';
    return 'error';
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
        <Typography variant="h6" sx={{ p: 2 }}>Manajemen Subsidi</Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Pemohon</TableCell>
                <TableCell>Tipe Subsidi</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subsidies.map((sub) => (
                <TableRow hover key={sub.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{sub.userName || '-'}</TableCell>
                  <TableCell>{sub.subsidyType || '-'}</TableCell>
                  <TableCell>{sub.subsidyAmount ? `Rp ${sub.subsidyAmount.toLocaleString('id-ID')}` : '-'}</TableCell>
                  <TableCell><Chip label={sub.status} color={getStatusColor(sub.status)} /></TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDetails(sub)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    {sub.status === 'Pending' && (
                      <>
                        <Button startIcon={<CheckCircleIcon />} onClick={() => handleUpdateStatus(sub.id, 'Disetujui')} color="success" size="small" variant="outlined" sx={{mx: 1}}>Setujui</Button>
                        <Button startIcon={<CancelIcon />} onClick={() => handleUpdateStatus(sub.id, 'Ditolak')} color="error" size="small" variant="outlined">Tolak</Button>
                      </>
                    )}
                    <IconButton onClick={() => handleDelete(sub.id)} color="error" sx={{ml: 1}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal untuk menampilkan Detail Subsidi */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        {selectedSubsidy && (
          <>
            <DialogTitle>Detail Pengajuan Subsidi</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Nama Pemohon</Typography>
                  <Typography variant="body1">{selectedSubsidy.userName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tipe Pemohon</Typography>
                  <Typography variant="body1">{selectedSubsidy.applicantType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tipe Subsidi</Typography>
                  <Typography variant="body1">{selectedSubsidy.subsidyType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Jumlah Subsidi</Typography>
                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{selectedSubsidy.subsidyAmount ? `Rp ${selectedSubsidy.subsidyAmount.toLocaleString('id-ID')}` : '-'}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tanggal Pengajuan</Typography>
                  <Typography variant="body1">{formatDate(selectedSubsidy.submittedDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={selectedSubsidy.status} color={getStatusColor(selectedSubsidy.status)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Luas Lahan</Typography>
                  <Typography variant="body1">{selectedSubsidy.farmArea || '-'}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">No. Telepon</Typography>
                  <Typography variant="body1">{selectedSubsidy.phoneNumber || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Deskripsi</Typography>
                  <Typography variant="body1">{selectedSubsidy.description || '-'}</Typography>
                </Grid>
              </Grid>
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

export default Subsidies;
// File: src/pages/Certifications.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Button, Chip, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon untuk lihat detail

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'certifications'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCertifications(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching certifications:", err);
        setError("Gagal memuat data sertifikasi.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka modal
  const handleViewDetails = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus sertifikasi ini?")) {
      await deleteDoc(doc(db, 'certifications', id));
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "certifications", id), { status: newStatus });
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
        <Typography variant="h6" sx={{ p: 2 }}>Manajemen Sertifikasi</Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email Pemohon</TableCell>
                <TableCell>Tipe Sertifikasi</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((cert) => (
                <TableRow hover key={cert.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{cert.email || '-'}</TableCell>
                  <TableCell>{cert.certificationType || '-'}</TableCell>
                  <TableCell><Chip label={cert.status} color={getStatusColor(cert.status)} /></TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDetails(cert)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    {cert.status === 'Pending' && (
                      <>
                        <Button startIcon={<CheckCircleIcon />} onClick={() => handleUpdateStatus(cert.id, 'Disetujui')} color="success" size="small" variant="outlined" sx={{mx: 1}}>Setujui</Button>
                        <Button startIcon={<CancelIcon />} onClick={() => handleUpdateStatus(cert.id, 'Ditolak')} color="error" size="small" variant="outlined">Tolak</Button>
                      </>
                    )}
                    <IconButton onClick={() => handleDelete(cert.id)} color="error" sx={{ml: 1}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal untuk menampilkan Detail Sertifikasi */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        {selectedCert && (
          <>
            <DialogTitle>Detail Pengajuan Sertifikasi</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tipe Sertifikasi</Typography>
                  <Typography variant="body1">{selectedCert.certificationType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tipe Pemohon</Typography>
                  <Typography variant="body1">{selectedCert.applicantType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email Pemohon</Typography>
                  <Typography variant="body1">{selectedCert.email || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Lokasi</Typography>
                  <Typography variant="body1">{selectedCert.location || '-'}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Tanggal Pengajuan</Typography>
                  <Typography variant="body1">{formatDate(selectedCert.submittedDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={selectedCert.status} color={getStatusColor(selectedCert.status)} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Deskripsi</Typography>
                  <Typography variant="body1">{selectedCert.description || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Dokumen Pendukung</Typography>
                  {selectedCert.documents && selectedCert.documents.NPWP ? (
                     <Link href={selectedCert.documents.NPWP} target="_blank" rel="noopener noreferrer">
                      Lihat Dokumen
                    </Link>
                  ) : (
                    <Typography variant="body1">-</Typography>
                  )}
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

export default Certifications;
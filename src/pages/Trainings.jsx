// File: src/pages/Trainings.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, Divider, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [registrantsLoading, setRegistrantsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'trainings'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrainings(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching trainings:", err);
        setError("Gagal memuat data pelatihan.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka modal dan mengambil daftar peserta
  const handleViewDetails = (training) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
    setRegistrantsLoading(true);

    const registrantsRef = collection(db, 'trainings', training.id, 'registrants');
    
    onSnapshot(registrantsRef, (snapshot) => {
      const registrantsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrants(registrantsData);
      setRegistrantsLoading(false);
    }, (err) => {
      console.error("Gagal memuat pendaftar:", err);
      setRegistrantsLoading(false);
    });
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
    setRegistrants([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelatihan ini?")) {
      await deleteDoc(doc(db, 'trainings', id));
    }
  };

  const formatDate = (timestamp) => {
    return timestamp && timestamp.toDate ? timestamp.toDate().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : '-';
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Manajemen Pelatihan</Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Judul Pelatihan</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Jadwal</TableCell>
                <TableCell>Peserta</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings.map((tr) => (
                <TableRow hover key={tr.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{fontWeight: 'medium'}}>{tr.description || '-'}</TableCell>
                  <TableCell>{tr.category || '-'}</TableCell>
                  <TableCell>{formatDate(tr.date)}</TableCell>
                  <TableCell>{`${tr.currentParticipants || 0} / ${tr.maxParticipants}`}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDetails(tr)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(tr.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Modal untuk Detail Pelatihan dan Daftar Peserta */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        {selectedTraining && (
          <>
            <DialogTitle>Detail Pelatihan</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                 <Grid item xs={12}>
                  <Typography variant="h6">{selectedTraining.description}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{selectedTraining.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Penyelenggara</Typography>
                  <Typography variant="body1">{selectedTraining.organizer}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Lokasi</Typography>
                  <Typography variant="body1">{selectedTraining.location}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Daftar Peserta ({registrants.length})</Typography>
              {registrantsLoading ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
              ) : (
                <List dense>
                  {registrants.length > 0 ? registrants.map(reg => (
                    <ListItem key={reg.id}>
                      <ListItemText primary={reg.userName} secondary={`Mendaftar pada: ${formatDate(reg.createdAt)}`} />
                    </ListItem>
                  )) : (
                    <ListItem><ListItemText primary="Belum ada peserta yang mendaftar." /></ListItem>
                  )}
                </List>
              )}
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

export default Trainings;
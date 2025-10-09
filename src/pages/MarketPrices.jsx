// File: src/pages/MarketPrices.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Autocomplete, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ commodityName: '', newPrice: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'market_prices'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrices(data);
        // Extract unique commodities for suggestions
        const uniqueCommodities = [...new Set(data.map(item => item.commodityName).filter(name => name))];
        setCommodities(uniqueCommodities);
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

  const handleOpenModal = (price = null) => {
    if (price) {
      setFormData({ 
        commodityName: price.commodityName || '', 
        newPrice: price.currentPrice ? price.currentPrice.toString() : '' 
      });
      setEditingId(price.id);
    } else {
      setFormData({ commodityName: '', newPrice: '' });
      setEditingId(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData({ commodityName: '', newPrice: '' });
  };

  const generateCommodityId = (commodityName) => {
    return commodityName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
  };

  const handleSave = async () => {
    if (!formData.commodityName.trim() || !formData.newPrice) {
      alert('Nama komoditas dan harga tidak boleh kosong');
      return;
    }

    const newPrice = parseInt(formData.newPrice);
    if (isNaN(newPrice)) {
      alert('Harga harus berupa angka yang valid');
      return;
    }

    setSaving(true);
    try {
      const commodityName = formData.commodityName.trim();
      let docId;
      // Check if commodity already exists in prices to use existing ID
      const existingPrice = prices.find(p => p.commodityName === commodityName);
      if (existingPrice) {
        docId = existingPrice.id;
      } else {
        docId = generateCommodityId(commodityName);
      }

      const updateData = {
        commodityName,
        currentPrice: newPrice,
        lastUpdate: new Date(),
        updatedBy: 'Admin Dashboard',
      };

      if (editingId && editingId === docId) {
        // Update existing - hanya ubah harga, commodityName tetap yang lama
        updateData.commodityName = prices.find(p => p.id === editingId)?.commodityName || commodityName;
        updateData.previousPrice = prices.find(p => p.id === editingId)?.currentPrice || 0;
        await updateDoc(doc(db, 'market_prices', docId), updateData);
      } else {
        // Create new or update existing if commodity exists
        updateData.previousPrice = existingPrice ? existingPrice.currentPrice : 0;
        await setDoc(doc(db, 'market_prices', docId), updateData, { merge: true });
      }

      handleCloseModal();
      setError('');
    } catch (err) {
      console.error("Error saving market price:", err);
      setError("Gagal menyimpan data harga pasar.");
    } finally {
      setSaving(false);
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Manajemen Harga Pasar</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Tambah Harga
        </Button>
      </Box>
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
                  <IconButton onClick={() => handleOpenModal(price)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(price.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Harga' : 'Tambah Harga Baru'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {editingId ? (
              // Saat edit, commodityName disabled
              <TextField
                label="Komoditas"
                fullWidth
                margin="normal"
                value={formData.commodityName}
                disabled
              />
            ) : (
              // Saat add, gunakan Autocomplete
              <Autocomplete
                freeSolo
                options={commodities}
                value={formData.commodityName}
                onChange={(event, newValue) => setFormData({ ...formData, commodityName: newValue || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Komoditas"
                    fullWidth
                    margin="normal"
                    value={formData.commodityName}
                    onChange={(e) => setFormData({ ...formData, commodityName: e.target.value })}
                  />
                )}
              />
            )}
            <TextField
              label="Harga per Kg (Rp)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.newPrice}
              onChange={(e) => setFormData({ ...formData, newPrice: e.target.value })}
              helperText="Masukkan harga dalam rupiah"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={saving}>Batal</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MarketPrices;
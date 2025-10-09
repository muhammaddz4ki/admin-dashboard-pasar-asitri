// File: src/pages/Products.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, Rating, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReviewsIcon from '@mui/icons-material/Reviews';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setLoading(false);
      }, 
      // --- PERBAIKAN DI SINI ---
      (err) => {
        // Sekarang variabel 'err' digunakan untuk logging
        console.error("Error fetching products:", err); 
        setError("Gagal memuat data produk.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setReviewsLoading(true);

    const reviewsRef = collection(db, 'products', product.id, 'reviews');
    
    onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
      setReviewsLoading(false);
    }, (err) => {
      console.error("Gagal memuat ulasan:", err);
      setReviewsLoading(false);
    });
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setReviews([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Gagal menghapus produk.");
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Manajemen Produk</Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gambar</TableCell>
                <TableCell>Nama Produk</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow hover key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell><Avatar src={product.imageUrl} variant="rounded" /></TableCell>
                  <TableCell sx={{fontWeight: 'medium'}}>{product.name || '-'}</TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell>{product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewReviews(product)} color="info">
                      <ReviewsIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        {selectedProduct && (
          <>
            <DialogTitle>
              Ulasan untuk: <strong>{selectedProduct.name}</strong>
            </DialogTitle>
            <DialogContent dividers>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {reviews.length > 0 ? reviews.map((review, index) => (
                    <React.Fragment key={review.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                                {review.userName || 'Anonim'}
                              </Typography>
                              <Rating name="read-only" value={review.rating} readOnly size="small" />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.primary">
                              {review.comment}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < reviews.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  )) : (
                    <ListItem>
                      <ListItemText primary="Belum ada ulasan untuk produk ini." />
                    </ListItem>
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

export default Products;
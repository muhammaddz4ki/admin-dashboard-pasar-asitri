// File: src/pages/Posts.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, IconButton, CircularProgress, Box, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
        setLoading(false);
      },
      // --- PERBAIKAN DI SINI ---
      (err) => {
        // Sekarang variabel 'err' kita gunakan untuk logging
        console.error("Error fetching posts:", err); 
        setError("Gagal memuat data postingan.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    setCommentsLoading(true);

    const commentsRef = collection(db, 'posts', post.id, 'comments');
    
    const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
      setCommentsLoading(false);
    }, (err) => {
      console.error("Gagal memuat komentar:", err);
      setCommentsLoading(false);
    });

    return unsubscribeComments;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus post ini?")) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
          Manajemen Postingan Forum
        </Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Penulis</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Isi Konten</TableCell>
                <TableCell>Jml. Komentar</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow hover key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{post.authorName || '-'}</TableCell>
                  <TableCell>{post.category || '-'}</TableCell>
                  <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.content || '-'}
                  </TableCell>
                  <TableCell>{post.commentCount || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewDetails(post)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(post.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        {selectedPost && (
          <>
            <DialogTitle variant="h5">{selectedPost.category}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" color="text.secondary">
                Ditulis oleh: {selectedPost.authorName}
              </Typography>
              <Typography variant="body1" sx={{ my: 2, whiteSpace: 'pre-wrap' }}>
                {selectedPost.content}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Komentar</Typography>
              {commentsLoading ? (
                <CircularProgress />
              ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {comments.length > 0 ? comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>{comment.authorName ? comment.authorName.charAt(0) : 'U'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.authorName}
                          secondary={
                            <Typography sx={{ whiteSpace: 'pre-wrap' }} variant="body2" color="text.primary">
                              {comment.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  )) : (
                    <ListItem>
                      <ListItemText primary="Belum ada komentar." />
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

export default Posts;
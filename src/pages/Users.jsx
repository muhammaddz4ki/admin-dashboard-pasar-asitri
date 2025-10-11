import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, CircularProgress, Box, Alert, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'),
            (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
                setLoading(false);

                // Memanggil fungsi untuk memperbarui statistik setiap kali data pengguna berubah
                updateUserStats(snapshot);
            },
            (err) => {
                console.error("Error fetching users:", err);
                setError("Gagal memuat data pengguna.");
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    // Fungsi untuk menghitung dan menulis statistik ke 'metadata/userStats'
    const updateUserStats = (snapshot) => {
        let petaniCount = 0;
        let penyulinganCount = 0;
        let pembeliCount = 0;

        snapshot.forEach(doc => {
            const userRole = doc.data().role;
            if (userRole === 'petani') petaniCount++;
            if (userRole === 'penyulingan') penyulinganCount++;
            if (userRole === 'pembeli') pembeliCount++;
        });

        const statsData = {
            total: snapshot.size,
            petani: petaniCount,
            penyulingan: penyulinganCount,
            pembeli: pembeliCount
        };

        const statsDocRef = doc(db, "metadata", "userStats");

        setDoc(statsDocRef, statsData)
            .then(() => {
                console.log("Statistik pengguna berhasil diperbarui!");
            })
            .catch((err) => {
                console.error("Gagal memperbarui statistik:", err);
            });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
            await deleteDoc(doc(db, 'users', id));
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                    Daftar Pengguna
                </Typography>
            </Box>
            {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nama</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Nomor Telepon</TableCell>
                            <TableCell align="right">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow hover key={user.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{user.name ? user.name.charAt(0) : 'U'}</Avatar>
                                        {user.name || '-'}
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email || '-'}</TableCell>
                                <TableCell>{user.role || '-'}</TableCell>
                                <TableCell>{user.phoneNumber || '-'}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDelete(user.id)} color="error">
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

export default Users;
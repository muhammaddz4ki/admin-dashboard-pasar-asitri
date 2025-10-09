// File: src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';

// ICON IMPORTS - LAMA
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SavingsIcon from '@mui/icons-material/Savings';

// --- ICON IMPORTS - BARU UNTUK KPI CARD ---
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

// --- KpiCard DIDESAIN ULANG UNTUK MENAMPILKAN IKON DAN DETAIL ---
const KpiCard = ({ title, value, percentage, isPositive, icon, color = 'primary' }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? 'success.main' : 'error.main' }}>
        {isPositive ? <ArrowUpwardIcon sx={{ fontSize: '1rem' }} /> : null}
        <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'medium' }}>
          {percentage}
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        p: 2,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette[color].lighter ?? `${theme.palette[color].light}40`,
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalUsers: 0, totalOrders: 0, pendingCertifications: 0 });
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [doughnutData, setDoughnutData] = useState({ labels: [], datasets: [] });
  const [latestOrders, setLatestOrders] = useState([]);
  const [pendingItems, setPendingItems] = useState({ certifications: [], subsidies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Logika fetchData Anda tetap sama, tidak perlu diubah
    const fetchData = async () => {
      try {
        const [usersSnap, ordersSnap, certsSnap, productsSnap, subsidiesSnap, latestOrdersSnap] = await Promise.all([
          getDocs(collection(db, 'users')), getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'certifications')), getDocs(collection(db, 'products')),
          getDocs(collection(db, 'subsidies')), getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5))),
        ]);
        let totalRevenue = 0; let monthlyRevenue = {};
        ordersSnap.forEach(doc => {
          const orderData = doc.data();
          if (orderData.status === 'Selesai' && orderData.totalPrice) {
            totalRevenue += orderData.totalPrice;
            if (orderData.createdAt?.toDate) {
              const date = orderData.createdAt.toDate();
              const month = date.toLocaleString('id-ID', { month: 'short' });
              monthlyRevenue[month] = (monthlyRevenue[month] || 0) + orderData.totalPrice;
            }
          }
        });
        const pendingCerts = certsSnap.docs.filter(doc => doc.data().status === 'Pending');
        const pendingSubs = subsidiesSnap.docs.filter(doc => doc.data().status === 'Pending');
        setStats({
          totalRevenue: totalRevenue, totalUsers: usersSnap.size,
          totalOrders: ordersSnap.size, pendingCertifications: pendingCerts.length,
        });
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
        setLineChartData({
          labels: sortedMonths,
          datasets: [{ label: 'Pendapatan per Bulan', data: sortedMonths.map(m => monthlyRevenue[m]), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 }],
        });
        let categoryCounts = {};
        productsSnap.forEach(doc => {
          const category = doc.data().category || 'Lainnya';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        setDoughnutData({
          labels: Object.keys(categoryCounts),
          datasets: [{ data: Object.values(categoryCounts), backgroundColor: ['#10B981', '#3B82F6', '#F97316', '#EF4444', '#8B5CF6'], hoverOffset: 4, borderWidth: 0 }],
        });
        setLatestOrders(latestOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPendingItems({
          certifications: pendingCerts.slice(0, 3).map(doc => ({id: doc.id, ...doc.data()})),
          subsidies: pendingSubs.slice(0, 3).map(doc => ({id: doc.id, ...doc.data()}))
        });
      } catch (error) { console.error("Gagal mengambil data dashboard:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Baris 1: Kartu KPI (DENGAN IKON BARU) */}
      <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <KpiCard 
            title="Total Pendapatan" 
            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
            percentage="Dari pesanan selesai" 
            isPositive={true}
            color="success"
            icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 30 }} />}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <KpiCard 
            title="Jumlah Pengguna" 
            value={stats.totalUsers.toLocaleString('id-ID')} 
            percentage="Terdaftar" 
            isPositive={true}
            color="info"
            icon={<PeopleAltOutlinedIcon sx={{ fontSize: 30 }} />}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <KpiCard 
            title="Total Pesanan" 
            value={stats.totalOrders.toLocaleString('id-ID')}
            percentage="Semua status" 
            isPositive={true}
            color="primary"
            icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 30 }} />}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <KpiCard 
            title="Sertifikasi Pending" 
            value={stats.pendingCertifications.toLocaleString('id-ID')} 
            percentage="Perlu ditinjau" 
            isPositive={false}
            color="warning"
            icon={<PendingActionsOutlinedIcon sx={{ fontSize: 30 }} />}
          />
        </Box>
      </Box>

      {/* Baris 2: Grafik */}
      <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
        <Box sx={{ flex: 4 }}>
          <Paper sx={{ p: 3, height: '450px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Kategori Produk</Typography>
            <Box sx={{ height: '350px' }}><Doughnut data={doughnutData} options={doughnutOptions} /></Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 8 }}>
          <Paper sx={{ p: 3, height: '450px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Tren Pendapatan</Typography>
            <Box sx={{ height: '350px' }}><Line data={lineChartData} options={chartOptions} /></Box>
          </Paper>
        </Box>
      </Box>

      {/* Baris 3: Tabel dan Daftar */}
      <Box sx={{ display: 'flex', gap: 4, width: '100%', alignItems: 'stretch' }}>
        <Box sx={{ flex: 8 }}>
          <Paper sx={{ height: '100%', width: '100%' }}>
            <Typography variant="h6" sx={{p: 2}}>Pesanan Terbaru</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Pesanan</TableCell>
                    <TableCell>Pengguna</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestOrders.map((order) => (
                    <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{fontSize: '0.8rem', color: 'text.secondary'}}>{order.id}</TableCell>
                      <TableCell>{order.userName || 'N/A'}</TableCell>
                      <TableCell sx={{fontWeight: 'medium'}}>{`Rp ${order.totalPrice.toLocaleString('id-ID')}`}</TableCell>
                      <TableCell><Chip label={order.status} size="small" color={order.status === 'Selesai' ? 'success' : order.status === 'Dibatalkan' ? 'error' : 'warning'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
        <Box sx={{ flex: 4 }}>
          <Paper sx={{ height: '100%', width: '100%', p: 2 }}>
            <Typography variant="h6" sx={{mb: 1}}>Perlu Tinjauan</Typography>
            <List sx={{p: 0}}>
              <Typography variant="subtitle2" sx={{px: 2, fontWeight: 'medium'}}>Sertifikasi</Typography>
              {pendingItems.certifications.length > 0 ? pendingItems.certifications.map(item => (
                <ListItem key={item.id}>
                  <ListItemAvatar><Avatar sx={{bgcolor: 'warning.light'}}><AssignmentIcon color="warning" /></Avatar></ListItemAvatar>
                  <ListItemText primary={item.certificationType} secondary={item.email} />
                </ListItem>
              )) : <ListItem><ListItemText secondary="Tidak ada sertifikasi pending." /></ListItem>}
              <Divider variant="inset" component="li" sx={{my: 1}}/>
              <Typography variant="subtitle2" sx={{px: 2, fontWeight: 'medium'}}>Subsidi</Typography>
              {pendingItems.subsidies.length > 0 ? pendingItems.subsidies.map(item => (
                <ListItem key={item.id}>
                  <ListItemAvatar><Avatar sx={{bgcolor: 'info.light'}}><SavingsIcon color="info" /></Avatar></ListItemAvatar>
                  <ListItemText primary={item.subsidyType} secondary={item.userName} />
                </ListItem>
              )) : <ListItem><ListItemText secondary="Tidak ada subsidi pending." /></ListItem>}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
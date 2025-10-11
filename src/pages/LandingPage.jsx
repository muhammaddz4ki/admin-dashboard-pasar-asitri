import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Container, Grid, Paper, IconButton, Drawer, List, ListItem, ListItemText,
    Fade, Grow, Slide, Zoom, Divider, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import logo from '../assets/logo.png';
import mockup from '../assets/mockup.png';
import mockupSplashscreen from '../assets/mockup-splashscreen.png';
import poster from '../assets/poster.png';
import testimonialSari from '../assets/testimonial-sari.png';
import testimonialBudi from '../assets/testimonial-budi.png';
import testimonialAgus from '../assets/testimonial-agus.png';

const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentElement = ref.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return [ref, isVisible];
};

const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const startTimeRef = useRef(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const progress = elapsed / duration;
            if (progress >= 1) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(end * progress));
            }
        }, 50);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <Typography variant="h4" component="p" fontWeight="bold">{count.toLocaleString()}</Typography>;
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <Grid ref={ref} size={{ xs: 12, sm: 6, md: 4 }}>
            <Grow in={isVisible} timeout={{ enter: 800 + delay }} style={{ transformOrigin: '0 50% 0' }}>
                <Paper
                    sx={{
                        p: 4,
                        height: '100%',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: 'none',
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #13977c, #0e7a6a)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.5s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-12px)',
                            boxShadow: '0 20px 40px -10px rgba(19, 151, 124, 0.3)',
                            '&::before': {
                                transform: 'scaleX(1)',
                            }
                        }
                    }}
                >
                    <Slide direction="up" in={isVisible} timeout={600 + delay}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Zoom in={isVisible} timeout={400 + delay}>
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                    color: 'white',
                                    p: 1.8,
                                    borderRadius: 2.5,
                                    display: 'inline-flex',
                                    mr: 2,
                                    boxShadow: '0 8px 16px rgba(19, 151, 124, 0.3)',
                                }}>
                                    {icon}
                                </Box>
                            </Zoom>
                            <Typography variant="h6" fontWeight="bold" sx={{
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {title}
                            </Typography>
                        </Box>
                    </Slide>
                    <Fade in={isVisible} timeout={700 + delay}>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {description}
                        </Typography>
                    </Fade>
                </Paper>
            </Grow>
        </Grid>
    );
};

const RoleCard = ({ icon, title, description, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <Grid ref={ref} size={{ xs: 12, sm: 6, md: 3 }}>
            <Grow in={isVisible} timeout={{ enter: 800 + delay }} style={{ transformOrigin: '0 50% 0' }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 3,
                        background: 'white',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(19, 151, 124, 0.05) 0%, rgba(14, 122, 106, 0.05) 100%)',
                            opacity: 0,
                            transition: 'opacity 0.5s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-15px) scale(1.02)',
                            boxShadow: '0 20px 50px rgba(19, 151, 124, 0.25)',
                            '&::after': {
                                opacity: 1,
                            }
                        }
                    }}
                >
                    <Slide direction="up" in={isVisible} timeout={600 + delay}>
                        <Box sx={{
                            position: 'relative',
                            zIndex: 1,
                            mb: 2,
                            '& img': {
                                transition: 'transform 0.5s ease',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                            },
                            '&:hover img': {
                                transform: 'scale(1.1) rotate(5deg)',
                            }
                        }}>
                            <img src={icon} alt={`${title} icon`} style={{ height: 90, margin: '0 auto 16px' }} />
                        </Box>
                    </Slide>
                    <Fade in={isVisible} timeout={700 + delay}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {description}
                            </Typography>
                        </div>
                    </Fade>
                </Box>
            </Grow>
        </Grid>
    );
};

const StatCard = ({ icon, count, title, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <Grid ref={ref} size={{ xs: 12, sm: 6, md: 3 }}>
            <Grow in={isVisible} timeout={{ enter: 800 + delay }} style={{ transformOrigin: '0 50% 0' }}>
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        height: '100%',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 3,
                        border: 'none',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(19, 151, 124, 0.1) 0%, transparent 70%)',
                            opacity: 0,
                            transition: 'opacity 0.5s ease',
                        },
                        '&:hover': {
                            transform: 'scale(1.08) translateY(-5px)',
                            boxShadow: '0 15px 35px rgba(19, 151, 124, 0.25)',
                            '&::before': {
                                opacity: 1,
                            }
                        }
                    }}
                >
                    <Slide direction="up" in={isVisible} timeout={600 + delay}>
                        <Box sx={{
                            color: '#13977c',
                            fontSize: 50,
                            mb: 2,
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 4px 8px rgba(19, 151, 124, 0.2))',
                        }}>
                            {icon}
                        </Box>
                    </Slide>
                    <Fade in={isVisible} timeout={700 + delay}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                <AnimatedCounter end={count} duration={1500} />
                            </Box>
                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                {title}
                            </Typography>
                        </div>
                    </Fade>
                </Paper>
            </Grow>
        </Grid>
    );
};

const TestimonialCard = ({ photo, quote, author, role, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <Grid ref={ref} size={{ xs: 12, md: 4 }}>
            <Grow in={isVisible} timeout={{ enter: 800 + delay }} style={{ transformOrigin: '0 50% 0' }}>
                <Paper
                    sx={{
                        p: 4,
                        height: '100%',
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'white',
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #13977c, #0e7a6a)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.5s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 16px 32px rgba(19, 151, 124, 0.2)',
                            '&::before': {
                                transform: 'scaleX(1)',
                            }
                        }
                    }}
                >
                    <Zoom in={isVisible} timeout={500 + delay}>
                        <Box sx={{ 
                            position: 'relative', 
                            display: 'inline-block',
                            mb: 3,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -8,
                                left: -8,
                                right: -8,
                                bottom: -8,
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                borderRadius: '50%',
                                zIndex: -1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                            },
                            '&:hover::before': {
                                opacity: 1,
                            }
                        }}>
                            <img 
                                src={photo} 
                                alt={author} 
                                style={{ 
                                    width: 80, 
                                    height: 80, 
                                    borderRadius: '50%', 
                                    objectFit: 'cover', 
                                    border: '3px solid white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }} 
                            />
                        </Box>
                    </Zoom>
                    <Fade in={isVisible} timeout={600 + delay}>
                        <Box sx={{ mb: 3, color: '#13977c', fontSize: 48 }}>
                            <FormatQuoteIcon fontSize="inherit" />
                        </Box>
                    </Fade>
                    <Slide direction="up" in={isVisible} timeout={700 + delay}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.7, mb: 3 }}>
                            "{quote}"
                        </Typography>
                    </Slide>
                    <Fade in={isVisible} timeout={800 + delay}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {role}
                            </Typography>
                        </Box>
                    </Fade>
                </Paper>
            </Grow>
        </Grid>
    );
};

function LandingPage() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [headerShadow, setHeaderShadow] = useState(false);

    const [userStats, setUserStats] = useState({
        total: 0,
        petani: 0,
        penyulingan: 0,
        pembeli: 0,
    });

    useEffect(() => {
        const statsDocRef = doc(db, 'metadata', 'userStats');

        const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const statsData = snapshot.data();
                setUserStats({
                    total: statsData.total || 0,
                    petani: statsData.petani || 0,
                    penyulingan: statsData.penyulingan || 0,
                    pembeli: statsData.pembeli || 0,
                });
            } else {
                console.log("Dokumen statistik 'metadata/userStats' belum ada.");
            }
        }, (error) => {
            console.error("Gagal mengambil data statistik: ", error);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => setHeaderShadow(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [heroRef, heroVisible] = useScrollAnimation();
    const [previewRef, previewVisible] = useScrollAnimation();
    const [statsRef, statsVisible] = useScrollAnimation();
    const [problemRef, problemVisible] = useScrollAnimation();
    const [featureTitleRef, featureTitleVisible] = useScrollAnimation();
    const [roleTitleRef, roleTitleVisible] = useScrollAnimation();
    const [testimonialRef, testimonialVisible] = useScrollAnimation();
    const [ctaRef, ctaVisible] = useScrollAnimation();

    const navItems = [
        { text: 'Preview', id: 'preview' },
        { text: 'Fitur', id: 'fitur' },
        { text: 'Untuk Siapa', id: 'peran' },
        { text: 'Apa Kata Mereka', id: 'testimoni' },
        { text: 'Tentang', id: 'tentang' },
    ];

    const drawer = (
        <Box sx={{ width: { xs: '100vw', sm: 280 }, height: '100vh', backgroundColor: 'white' }}>
            {/* Header Drawer */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#f8f9fa'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ height: 32, marginRight: 12 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{
                        background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Pasar Atsiri
                    </Typography>
                </Box>
                <IconButton onClick={() => setDrawerOpen(false)}>
                    <MenuIcon />
                </IconButton>
            </Box>
            {/* List Nav */}
            <List sx={{ p: 0, mt: 2 }}>
                {navItems.map((item) => (
                    <ListItem
                        key={item.id}
                        button
                        onClick={() => {
                            scrollToSection(item.id);
                            setDrawerOpen(false);
                        }}
                        sx={{
                            py: 2.5,
                            mx: 2,
                            borderRadius: 2,
                            mb: 1,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: 'rgba(19, 151, 124, 0.08)',
                                transform: 'translateX(8px)',
                                boxShadow: '0 4px 12px rgba(19, 151, 124, 0.15)',
                            },
                            '& .MuiListItemText-primary': {
                                fontWeight: 600,
                                color: '#13977c',
                            }
                        }}
                    >
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            {/* Additional Button in Drawer */}
            <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.1)', mt: 'auto' }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        navigate('/admin');
                        setDrawerOpen(false);
                    }}
                    sx={{
                        background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0e7a6a 0%, #0a5a52 100%)',
                        },
                    }}
                >
                    Admin Login
                </Button>
            </Box>
        </Box>
    );

    const testimonials = [
        { 
            photo: testimonialSari,
            quote: "Platform ini benar-benar mengubah cara saya menjual hasil panen. Harga transparan dan pembeli langsung!", 
            author: "Sari", 
            role: "Petani Atsiri" 
        },
        { 
            photo: testimonialBudi,
            quote: "Mudah mengelola panen dan proses sertifikasi. Usaha pertanian saya lebih efisien berkat Pasar Atsiri.", 
            author: "Budi", 
            role: "Petani Atsiri" 
        },
        { 
            photo: testimonialAgus,
            quote: "Sebagai petani, saya bisa memverifikasi harga dan kualitas dengan mudah. Layanan yang sangat membantu!", 
            author: "Agus", 
            role: "Petani Atsiri" 
        },
    ];

    return (
        <Box sx={{ backgroundColor: '#fafafa', color: 'text.primary' }}>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    backgroundColor: headerShadow ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: headerShadow ? '0 8px 32px 0 rgba(19, 151, 124, 0.12)' : 'none',
                    borderBottom: headerShadow ? '1px solid rgba(19, 151, 124, 0.1)' : 'none',
                }}
            >
                <Container>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logo} alt="Logo" style={{ height: 32, marginRight: 24 }} />
                            <Typography variant="h6" fontWeight="bold" sx={{
                                background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Pasar Atsiri
                            </Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.id}
                                    color="inherit"
                                    onClick={() => scrollToSection(item.id)}
                                    sx={{
                                        fontWeight: 500,
                                        px: 2,
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(19, 151, 124, 0.1) 0%, rgba(14, 122, 106, 0.1) 100%)',
                                        }
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/admin')}
                                sx={{
                                    display: { xs: 'none', md: 'inline-flex' },
                                    background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(19, 151, 124, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0e7a6a 0%, #0a5a52 100%)',
                                        boxShadow: '0 6px 20px rgba(19, 151, 124, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Admin Login
                            </Button>
                            <IconButton
                                color="inherit"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ 
                                    display: { md: 'none' },
                                    backgroundColor: 'rgba(19, 151, 124, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(19, 151, 124, 0.2)',
                                    }
                                }}
                            >
                                <MenuIcon sx={{ color: '#13977c' }} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ '& .MuiDrawer-paper': { boxShadow: '4px 0 20px rgba(0,0,0,0.1)' } }}>
                {drawer}
            </Drawer>

            <main>
                <Box
                    component="section"
                    sx={{
                        pt: { xs: 14, md: 18 },
                        pb: { xs: 8, md: 12 },
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: { xs: 'auto', md: '100vh' },
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '70%',
                            height: '150%',
                            background: 'radial-gradient(circle, rgba(19, 151, 124, 0.08) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }
                    }}
                >
                    <Container ref={heroRef} sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid container alignItems="center" spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Fade in={heroVisible} timeout={1000}>
                                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                        <Slide direction="down" in={heroVisible} timeout={800}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2, px: 2, py: 1, borderRadius: 10, background: 'linear-gradient(135deg, rgba(19, 151, 124, 0.1) 0%, rgba(14, 122, 106, 0.1) 100%)' }}>
                                                <AutoAwesomeIcon sx={{ fontSize: 18, color: '#13977c' }} />
                                                <Typography variant="caption" fontWeight={600} sx={{ color: '#13977c' }}>
                                                    Platform E-Government Terintegrasi
                                                </Typography>
                                            </Box>
                                        </Slide>
                                        <Slide direction="down" in={heroVisible} timeout={900}>
                                            <Typography
                                                variant="h2"
                                                component="h1"
                                                fontWeight="800"
                                                gutterBottom
                                                sx={{
                                                    background: 'linear-gradient(135deg, #0a5a52 0%, #13977c 50%, #0e7a6a 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                Membangun Ekosistem Digital untuk Petani Atsiri
                                            </Typography>
                                        </Slide>
                                        <Slide direction="up" in={heroVisible} timeout={1000}>
                                            <Typography variant="h6" color="text.secondary" sx={{ my: 4, lineHeight: 1.8 }}>
                                                Platform e-Government terintegrasi yang menghubungkan petani, penyuling, pembeli, dan pemerintah untuk rantai pasok yang adil dan transparan.
                                            </Typography>
                                        </Slide>
                                        <Grow in={heroVisible} timeout={1200}>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => scrollToSection('fitur')}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                                        borderRadius: 2,
                                                        px: 4,
                                                        py: 1.5,
                                                        textTransform: 'none',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        boxShadow: '0 8px 20px rgba(19, 151, 124, 0.35)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #0e7a6a 0%, #0a5a52 100%)',
                                                            boxShadow: '0 12px 28px rgba(19, 151, 124, 0.45)',
                                                            transform: 'translateY(-3px)',
                                                        },
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }}
                                                >
                                                    Lihat Fitur
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    component="a"
                                                    href="https://drive.google.com/drive/folders/1PUWG03HyWSf8F8hOsfcWh-Epdu_9bCfn"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        borderRadius: 2,
                                                        px: 4,
                                                        py: 1.5,
                                                        textTransform: 'none',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        borderWidth: 2,
                                                        borderColor: '#13977c',
                                                        color: '#13977c',
                                                        '&:hover': {
                                                            borderWidth: 2,
                                                            borderColor: '#0e7a6a',
                                                            background: 'rgba(19, 151, 124, 0.05)',
                                                            transform: 'translateY(-3px)',
                                                        },
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }}
                                                >
                                                    Unduh Aplikasi
                                                </Button>
                                            </Box>
                                        </Grow>
                                    </Box>
                                </Fade>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Zoom in={heroVisible} timeout={1500}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '80%',
                                            height: '80%',
                                            background: 'radial-gradient(circle, rgba(19, 151, 124, 0.15) 0%, transparent 70%)',
                                            borderRadius: '50%',
                                            filter: 'blur(40px)',
                                            zIndex: 0,
                                        }
                                    }}>
                                        <img
                                            src={mockup}
                                            alt="Mockup Aplikasi Pasar Atsiri"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                maxHeight: '500px',
                                                filter: 'drop-shadow(0 20px 40px rgba(19, 151, 124, 0.3))',
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        />
                                    </Box>
                                </Zoom>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box ref={previewRef} component="section" id="preview" sx={{
                    py: 10,
                    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                    position: 'relative',
                }}>
                    <Container>
                        <Fade in={previewVisible} timeout={600}>
                            <Box sx={{ textAlign: 'center', mb: 8 }}>
                                <Typography
                                    variant="h3"
                                    component="h2"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Preview Aplikasi & Materi Promosi
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                                    Lihat tampilan aplikasi dan materi promosi kami
                                </Typography>
                            </Box>
                        </Fade>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Grow in={previewVisible} timeout={800}>
                                    <Paper sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        borderRadius: 3,
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 16px 40px rgba(19, 151, 124, 0.2)',
                                        }
                                    }}>
                                        <Zoom in={previewVisible} timeout={1000}>
                                            <Box sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            }}>
                                                <img
                                                    src={mockupSplashscreen}
                                                    alt="Mockup Splashscreen"
                                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </Box>
                                        </Zoom>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            Splashscreen
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            Selamat datang di dunia digital atsiri yang transparan dan adil.
                                        </Typography>
                                    </Paper>
                                </Grow>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Grow in={previewVisible} timeout={1000}>
                                    <Paper sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        borderRadius: 3,
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 16px 40px rgba(19, 151, 124, 0.2)',
                                        }
                                    }}>
                                        <Zoom in={previewVisible} timeout={1200}>
                                            <Box sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            }}>
                                                <img
                                                    src={mockup}
                                                    alt="Mockup Aplikasi"
                                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </Box>
                                        </Zoom>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            Mockup Utama
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            Interface intuitif untuk semua pengguna dalam ekosistem.
                                        </Typography>
                                    </Paper>
                                </Grow>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Grow in={previewVisible} timeout={1200}>
                                    <Paper sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        borderRadius: 3,
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 16px 40px rgba(19, 151, 124, 0.2)',
                                        }
                                    }}>
                                        <Zoom in={previewVisible} timeout={1400}>
                                            <Box sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            }}>
                                                <img
                                                    src={poster}
                                                    alt="Poster Promosi"
                                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </Box>
                                        </Zoom>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            Poster Promosi
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            Materi visual untuk sosialisasi dan kampanye transformasi digital atsiri.
                                        </Typography>
                                    </Paper>
                                </Grow>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box ref={statsRef} component="section" sx={{
                    py: 10,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                }}>
                    <Container>
                        <Fade in={statsVisible} timeout={600}>
                            <Box sx={{ textAlign: 'center', mb: 8 }}>
                                <Typography
                                    variant="h3"
                                    component="h2"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Bergabung dengan Ribuan Pengguna
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                    Komunitas yang terus berkembang
                                </Typography>
                            </Box>
                        </Fade>
                        <Grid container spacing={4} justifyContent="center">
                            <StatCard icon={<GroupIcon fontSize="inherit" />} count={userStats.total} title="Total Pengguna" delay={0} />
                            <StatCard icon={<AgricultureIcon fontSize="inherit" />} count={userStats.petani} title="Petani Terdaftar" delay={200} />
                            <StatCard icon={<FactoryIcon fontSize="inherit" />} count={userStats.penyulingan} title="Penyuling Terdaftar" delay={400} />
                            <StatCard icon={<ShoppingCartIcon fontSize="inherit" />} count={userStats.pembeli} title="Pembeli Terdaftar" delay={600} />
                        </Grid>
                    </Container>
                </Box>

                <Box component="section" id="masalah" sx={{
                    py: 12,
                    background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-10%',
                        width: '60%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }
                }}>
                    <Container ref={problemRef} sx={{ position: 'relative', zIndex: 1 }}>
                        <Fade in={problemVisible} timeout={800}>
                            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                                <Slide direction="down" in={problemVisible} timeout={600}>
                                    <Typography
                                        variant="h3"
                                        component="h2"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ color: 'white' }}
                                    >
                                        Potensi Besar, Kesejahteraan Rendah
                                    </Typography>
                                </Slide>
                                <Grow in={problemVisible} timeout={700}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            mt: 3,
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        Garut adalah jantung produksi minyak atsiri nasional, namun petani masih menghadapi ketergantungan pada tengkulak, fluktuasi harga, dan minimnya transparansi yang menghambat kesejahteraan mereka.
                                    </Typography>
                                </Grow>
                            </Box>
                        </Fade>
                    </Container>
                </Box>

                <Box component="section" id="fitur" sx={{
                    py: 12,
                    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                }}>
                    <Container ref={featureTitleRef}>
                        <Fade in={featureTitleVisible} timeout={800}>
                            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto', mb: 10 }}>
                                <Slide direction="down" in={featureTitleVisible} timeout={600}>
                                    <Typography
                                        variant="h3"
                                        component="h2"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Solusi Digital Terintegrasi
                                    </Typography>
                                </Slide>
                                <Grow in={featureTitleVisible} timeout={700}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                                        Pasar Atsiri memberdayakan setiap pihak dalam ekosistem dengan fitur yang dirancang khusus.
                                    </Typography>
                                </Grow>
                            </Box>
                        </Fade>
                        <Grid container spacing={4}>
                            <FeatureCard icon={<TrendingUpIcon />} title="Dashboard Harga Real-time" description="Menyediakan acuan harga resmi dari pemerintah untuk memastikan transparansi dan keadilan." delay={0} />
                            <FeatureCard icon={<VerifiedUserIcon />} title="Sertifikasi Digital" description="Mempermudah proses pengajuan dan verifikasi sertifikasi produk untuk meningkatkan daya saing." delay={200} />
                            <FeatureCard icon={<AccountBalanceWalletIcon />} title="Akses Subsidi & Bantuan" description="Sistem terintegrasi untuk pengajuan dan penyaluran bantuan pemerintah yang lebih tepat sasaran." delay={400} />
                            <FeatureCard icon={<StorefrontIcon />} title="Marketplace Langsung" description="Menghubungkan petani dan penyuling langsung ke pembeli industri dan konsumen tanpa perantara." delay={600} />
                            <FeatureCard icon={<SchoolIcon />} title="Pelatihan & Forum" description="Pusat pelatihan digital dan forum diskusi untuk meningkatkan kapasitas dan kolaborasi antar pengguna." delay={800} />
                            <FeatureCard icon={<BarChartIcon />} title="Analitik & Laporan" description="Dashboard analitik untuk memantau tren produksi dan penjualan sebagai dasar pengambilan keputusan." delay={1000} />
                        </Grid>
                    </Container>
                </Box>

                <Box component="section" id="peran" sx={{
                    py: 12,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                }}>
                    <Container ref={roleTitleRef}>
                        <Fade in={roleTitleVisible} timeout={800}>
                            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto', mb: 10 }}>
                                <Slide direction="down" in={roleTitleVisible} timeout={600}>
                                    <Typography
                                        variant="h3"
                                        component="h2"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Diciptakan untuk Seluruh Ekosistem
                                    </Typography>
                                </Slide>
                                <Grow in={roleTitleVisible} timeout={700}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                                        Setiap peran memiliki manfaat dan fitur khusus untuk mendukung aktivitas mereka.
                                    </Typography>
                                </Grow>
                            </Box>
                        </Fade>
                        <Grid container spacing={4}>
                            <RoleCard icon="https://img.icons8.com/plasticine/100/farmer.png" title="Petani & UMKM" description="Dapatkan harga adil, akses pasar luas, serta dukungan pelatihan, sertifikasi, dan subsidi." delay={0} />
                            <RoleCard icon="https://img.icons8.com/plasticine/100/factory.png" title="Penyuling" description="Catat data produksi, kelola mutu & stok, serta pasarkan produk langsung ke industri." delay={200} />
                            <RoleCard icon="https://img.icons8.com/plasticine/100/shopping-cart-loaded.png" title="Pembeli" description="Temukan produk berkualitas dengan jaminan mutu, harga transparan, dan sertifikasi resmi." delay={400} />
                            <RoleCard icon="/icons8-building-100.png" title="Pemerintah" description="Miliki data real-time untuk monitoring, penyaluran bantuan, dan kebijakan yang tepat sasaran." delay={600} />
                        </Grid>
                    </Container>
                </Box>

                <Box ref={testimonialRef} component="section" id="testimoni" sx={{
                    py: 12,
                    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                }}>
                    <Container>
                        <Fade in={testimonialVisible} timeout={800}>
                            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto', mb: 10 }}>
                                <Slide direction="down" in={testimonialVisible} timeout={600}>
                                    <Typography
                                        variant="h3"
                                        component="h2"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Apa Kata Mereka
                                    </Typography>
                                </Slide>
                                <Grow in={testimonialVisible} timeout={700}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                                        Dengar langsung dari pengguna Pasar Atsiri tentang bagaimana platform ini mengubah hidup mereka.
                                    </Typography>
                                </Grow>
                            </Box>
                        </Fade>
                        <Grid container spacing={4} justifyContent="center">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={index}
                                    photo={testimonial.photo}
                                    quote={testimonial.quote}
                                    author={testimonial.author}
                                    role={testimonial.role}
                                    delay={index * 200}
                                />
                            ))}
                        </Grid>
                    </Container>
                </Box>

                <Box component="section" id="tentang" sx={{
                    py: 14,
                    background: 'linear-gradient(135deg, #13977c 0%, #0e7a6a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-50%',
                        right: '-10%',
                        width: '60%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }
                }}>
                    <Container ref={ctaRef} sx={{ position: 'relative', zIndex: 1 }}>
                        <Fade in={ctaVisible} timeout={800}>
                            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                                <Slide direction="down" in={ctaVisible} timeout={600}>
                                    <Typography
                                        variant="h3"
                                        component="h2"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ color: 'white' }}
                                    >
                                        Siap Bergabung dengan Ekosistem Atsiri Digital?
                                    </Typography>
                                </Slide>
                                <Grow in={ctaVisible} timeout={700}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            my: 4,
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        Jadilah bagian dari transformasi digital sektor pertanian Indonesia. Unduh aplikasi Pasar Atsiri sekarang dan rasakan manfaatnya.
                                    </Typography>
                                </Grow>
                                <Zoom in={ctaVisible} timeout={900}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        component="a"
                                        href="https://drive.google.com/drive/folders/1PUWG03HyWSf8F8hOsfcWh-Epdu_9bCfn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            background: 'white',
                                            color: '#13977c',
                                            borderRadius: 2,
                                            px: 5,
                                            py: 2,
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.95)',
                                                boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                                                transform: 'translateY(-3px)',
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        Unduh Aplikasi Sekarang
                                    </Button>
                                </Zoom>
                            </Box>
                        </Fade>
                    </Container>
                </Box>
            </main>

            {/* ===== FOOTER BARU DIMULAI DARI SINI ===== */}
            <Box component="footer" sx={{
                backgroundColor: '#0A5344', // Warna hijau tua yang solid
                color: 'white',
                py: { xs: 4, md: 6 },
            }}>
                <Container>
                    {/* Bagian Atas Footer */}
                    <Grid container spacing={{ xs: 4, md: 5 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <img src={logo} alt="Logo" style={{ height: 32, marginRight: 16 }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Pasar Atsiri
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Platform e-Government terintegrasi untuk rantai pasok atsiri yang adil dan transparan.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Perusahaan
                            </Typography>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => scrollToSection('tentang')}
                                sx={{ color: 'inherit', textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
                            >
                                Tentang
                            </Link>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Solusi
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Link component="button" variant="body2" onClick={() => scrollToSection('preview')} sx={{ color: 'inherit', textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 }, textAlign: 'left' }}>
                                    Preview
                                </Link>
                                <Link component="button" variant="body2" onClick={() => scrollToSection('fitur')} sx={{ color: 'inherit', textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 }, textAlign: 'left' }}>
                                    Fitur
                                </Link>
                                <Link component="button" variant="body2" onClick={() => scrollToSection('peran')} sx={{ color: 'inherit', textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 }, textAlign: 'left' }}>
                                    Untuk Siapa
                                </Link>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Hubungi Kami
                            </Typography>
                             <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Politeknik Manufaktur Bandung<br/>
                                Jl. Kanayakan No.21, Dago, Kecamatan Coblong, Kota Bandung, Jawa Barat 40135
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Pembatas dan Bagian Bawah */}
                    <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                    
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            &copy; {new Date().getFullYear()} Pasar Atsiri (AOSOGI - POLMAN Bandung)
                        </Typography>
                        <Box>
                            <IconButton color="inherit" aria-label="facebook" component="a" href="https://facebook.com" target="_blank">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton color="inherit" aria-label="instagram" component="a" href="https://instagram.com" target="_blank">
                                <InstagramIcon />
                            </IconButton>
                            <IconButton color="inherit" aria-label="linkedin" component="a" href="https://linkedin.com" target="_blank">
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton color="inherit" aria-label="twitter" component="a" href="https://twitter.com" target="_blank">
                                <TwitterIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>
            {/* ===== FOOTER BARU SELESAI ===== */}
        </Box>
    );
}

export default LandingPage;
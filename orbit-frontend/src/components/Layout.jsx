// src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { Container, Box } from '@mui/material';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Outlet /> {/* Renders the current page component */}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
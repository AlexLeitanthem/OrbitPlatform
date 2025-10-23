// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Link, Container, Paper } from '@mui/material'; // 👈 Paper is now imported
import { useThemeContext } from '../context/ThemeContext.jsx';

function Footer() {
  const { mode } = useThemeContext();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, mt: 'auto' }}>
      <Paper // 👈 We use Paper directly here for styling
        elevation={0}
        sx={{
          py: 2,
          px: 3,
          borderRadius: 2,
          display: 'inline-block',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(18, 18, 18, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="#">
            Orbit
          </Link>
          . All Rights Reserved.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Footer;
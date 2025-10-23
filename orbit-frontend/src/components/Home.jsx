// src/components/Home.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Orbit
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          The centralized platform to reconnect, engage, and empower your alumni network.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {user ? (
            // If user is logged in, show this button
            <Button component={Link} to="/dashboard" variant="contained" color="primary">
              Go to Your Dashboard
            </Button>
          ) : (
            // If user is logged out, show these buttons
            <>
              <Button component={Link} to="/register" variant="contained" color="primary" sx={{ mr: 2 }}>
                Get Started
              </Button>
              <Button component={Link} to="/login" variant="outlined" color="primary">
                Login
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
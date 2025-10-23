// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Grid, Paper, Link } from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js'; // 👈 Corrected import path

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { user, login } = useAuth(); // 👈 Use hook

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', formData);
      if (response.data) {
        login(response.data); // 👈 Use context function
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus onChange={onChange} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" onChange={onChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
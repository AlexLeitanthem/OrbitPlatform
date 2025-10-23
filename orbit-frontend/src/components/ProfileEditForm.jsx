// src/components/ProfileEditForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import toast from 'react-hot-toast';

function ProfileEditForm({ onUpdate, existingProfile }) {
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    location: '',
    bio: '', // Skills field is removed
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        status: existingProfile.status || '',
        company: existingProfile.company || '',
        location: existingProfile.location || '',
        bio: existingProfile.bio || '',
      });
    }
  }, [existingProfile]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      
      // We only send the fields managed by this form to the backend
      const { status, company, location, bio } = formData;
      await axios.post('http://localhost:5001/api/profiles', { status, company, location, bio }, config);
      
      toast.success('Profile Details Updated!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update profile details.');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Typography variant="h6" gutterBottom>Edit Profile Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField name="status" label="* Status (e.g., Software Engineer)" fullWidth value={formData.status} onChange={onChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField name="company" label="Company" fullWidth value={formData.company} onChange={onChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField name="location" label="Location" fullWidth value={formData.location} onChange={onChange} />
        </Grid>
        {/* The Grid item for skills has been removed */}
        <Grid item xs={12}>
          <TextField name="bio" label="A short bio" fullWidth multiline rows={4} value={formData.bio} onChange={onChange} />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
}
export default ProfileEditForm;
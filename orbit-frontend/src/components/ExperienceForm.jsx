import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import toast from 'react-hot-toast';

function ExperienceForm({ onUpdate, data }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    description: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        company: data.company || '',
        location: data.location || '',
        from: data.from ? data.from.slice(0, 10) : '',
        to: data.to ? data.to.slice(0, 10) : '',
        description: data.description || '',
      });
    }
  }, [data]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) return toast.error('Authentication token missing.');

      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };

      if (data?._id) {
        await axios.put(
          `http://localhost:5001/api/profiles/experience/${data._id}`,
          formData,
          config
        );
        toast.success('Experience updated!');
      } else {
        await axios.put(
          'http://localhost:5001/api/profiles/experience',
          formData,
          config
        );
        toast.success('Experience added!');
      }

      if (onUpdate) onUpdate();
      if (!data?._id) {
        setFormData({ title: '', company: '', location: '', from: '', to: '', description: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to save experience.');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {data ? 'Edit Experience' : 'Add New Experience'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField name="title" label="* Job Title" fullWidth value={formData.title} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="company" label="* Company" fullWidth value={formData.company} onChange={onChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField name="location" label="Location" fullWidth value={formData.location} onChange={onChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="from" label="* From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.from} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="to" label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.to} onChange={onChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField name="description" label="Job Description" fullWidth multiline rows={4} value={formData.description} onChange={onChange} />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {data ? 'Update Experience' : 'Add Experience'}
      </Button>
    </Box>
  );
}

export default ExperienceForm;
